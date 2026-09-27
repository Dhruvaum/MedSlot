import { useState, type FormEvent, type ChangeEvent } from 'react'
import * as yup from 'yup'
import { credentialsSchema } from './schema'
import type { SignUpCredentials, RegisterRequest,  } from '../../../../features/auth/types'
import { registerAccount } from '../../../../services/Auth'
import { useNavigate } from 'react-router-dom'

type FormErrors = Partial<Record<keyof SignUpCredentials, string>>

export const useSignUpForm = (userType: 'Patient' | 'Doctor') => {

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<SignUpCredentials>({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange =
    (field: keyof SignUpCredentials) => async (e: ChangeEvent<HTMLInputElement>) => {
      const updatedCredentials = { ...credentials, [field]: e.target.value }
      setCredentials(updatedCredentials)

      try {
        await credentialsSchema.validateAt(field, updatedCredentials)
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          setErrors((prev) => ({ ...prev, [field]: err.message }))
        }
      }
    }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await credentialsSchema.validate(credentials, { abortEarly: false })
      setErrors({})

      // Prepare request data
      const request: RegisterRequest = {
        userName: credentials.userName,
        email: credentials.email,
        password: credentials.password,
        userType
      }

      // Hit register api
      const response = await registerAccount(request);
      if(response){
        localStorage.setItem('authToken', response.authToken);
        localStorage.setItem('role', response.role);

        navigate('/completeProfile')
      }

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: FormErrors = {}
        err.inner.forEach((validationError) => {
          if (validationError.path) {
            newErrors[validationError.path as keyof SignUpCredentials] = validationError.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  return { credentials, errors, handleChange, handleSubmit }
}
