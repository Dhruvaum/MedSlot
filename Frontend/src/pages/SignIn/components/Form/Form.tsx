import { useSignInForm, type SignInCredentials } from './useSignInForm'

const fields: { name: keyof SignInCredentials; label: string; type: string }[] = [
  { name: 'userName', label: 'Username', type: 'text' },
  { name: 'password', label: 'Password', type: 'password' },
]

const Form = () => {
  const { credentials, errors, handleChange, handleSubmit } = useSignInForm()

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-3xl font-bold text-slate-800">Sign In</h1>

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
          className="mt-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}

export default Form
