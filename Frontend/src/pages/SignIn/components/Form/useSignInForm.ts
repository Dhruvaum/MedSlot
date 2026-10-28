import { useState, type ChangeEvent, type FormEvent } from 'react'
import * as yup from 'yup'
import axios from 'axios'
import { signInSchema } from './schema'
import { login } from '../../../../features/auth/AuthService'
import type { LoginResponse } from '../../../../features/auth/types'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { decodeToken } from '../../../../utils/token'

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
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: FormErrors = {}
        err.inner.forEach((validationError) => {
          if (validationError.path) {
            newErrors[validationError.path as keyof SignInCredentials] = validationError.message
          }
        })
        setErrors(newErrors)
      }
      return
    }

    setIsSubmitting(true)
    try {
      const response:LoginResponse = await login(credentials);
      if(response && response.authToken){
        const {role} = decodeToken(response.authToken);

        toast.success("Signed In Successfully");

        localStorage.setItem("authToken", response.authToken);
        localStorage.setItem('isRegistrationCompleted', `${response.isRegistrationCompleted}`)

        // Check whether SupportAgent
        if (role === 'SupportAgent') {
          navigate('/support/pending-doctors')
          return
        }

        // Catch and redirect if registration is not completed
        if(!response.isRegistrationCompleted){
          navigate('/completeProfile');
          return;
        }

        // Navigate on the basis of decoded token's role
        if(role){
          if(role === 'Patient') navigate('/patient');
          else if(role === 'Doctor') navigate('/doctor');
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const message = (err.response.data as { error?: string } | undefined)?.error
          toast.error(message ?? 'Sign in failed. Please try again.')
        } else {
          toast.error('Could not reach the server. Check your connection and try again.')
        }
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { credentials, errors, isSubmitting, handleChange, handleSubmit }
}
