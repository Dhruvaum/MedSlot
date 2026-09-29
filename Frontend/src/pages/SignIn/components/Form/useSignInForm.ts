import { useState, type ChangeEvent, type FormEvent } from 'react'
import * as yup from 'yup'
import { signInSchema } from './schema'
import { login } from '../../../../features/auth/AuthService'
import type { LoginResponse } from '../../../../features/auth/types'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export interface SignInCredentials {
  userName: string
  password: string
}

type FormErrors = Partial<Record<keyof SignInCredentials, string>>

export const useSignInForm = () => {

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<SignInCredentials>({
    userName: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange =
    (field: keyof SignInCredentials) => async (e: ChangeEvent<HTMLInputElement>) => {
      const updatedCredentials = { ...credentials, [field]: e.target.value }
      setCredentials(updatedCredentials)

      try {
        await signInSchema.validateAt(field, updatedCredentials)
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
      await signInSchema.validate(credentials, { abortEarly: false })
      setErrors({})

      // TODO: wire to real sign-in API once the service file is ready
      const response:LoginResponse = await login(credentials);
      if(response && response.authToken){
        toast.success("Signed In Successfully");

        localStorage.setItem("authToken", response.authToken);
        localStorage.setItem('isRegistrationCompleted', `${response.isRegistrationCompleted}`)

        navigate('/patient')
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: FormErrors = {}
        err.inner.forEach((validationError) => {
          if (validationError.path) {
            newErrors[validationError.path as keyof SignInCredentials] = validationError.message
          }
        })
        setErrors(newErrors);

        toast.error(`${err}`);
      }
    }
  }

  return { credentials, errors, handleChange, handleSubmit }
}
