import { useState, type FormEvent, type ChangeEvent } from 'react'
import * as yup from 'yup'
import { credentialsSchema } from './schema'
import type { SignUpCredentials } from '../../../../features/auth/types'

type FormErrors = Partial<Record<keyof SignUpCredentials, string>>

export const useSignUpForm = () => {
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

      // TODO: wire to real registerAccount API once backend endpoint exists
      console.log('Valid credentials, ready to submit:', credentials)
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
