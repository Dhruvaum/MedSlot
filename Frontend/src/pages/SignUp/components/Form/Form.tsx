import { useSignUpForm } from './useSignUpForm'
import type { SignUpCredentials } from '../../../../features/auth/types'

const fields: { name: keyof SignUpCredentials; label: string; type: string }[] = [
  { name: 'userName', label: 'Username', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
]

const Form = ({ userType, onBack }: { userType: 'Patient' | 'Doctor', onBack: () => void }) => {
  const { credentials, errors, handleChange, handleSubmit } = useSignUpForm(userType)

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-3xl font-bold text-slate-800">Create your account</h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
      >
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label htmlFor={field.name} className="text-sm font-medium text-slate-700">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              value={credentials[field.name]}
              onChange={handleChange(field.name)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-slate-800 outline-none transition focus:border-brand"
            />
            {errors[field.name] && (
              <span className="text-sm text-red-500">{errors[field.name]}</span>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="mt-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90 hover:cursor-pointer active:scale-[0.97]"
        >
          Sign Up
        </button>

        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-500 transition hover:text-brand"
        >
          ← Back
        </button>
      </form>
    </div>
  )
}

export default Form