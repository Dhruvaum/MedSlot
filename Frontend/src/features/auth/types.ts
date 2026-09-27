export interface SignUpCredentials {
  userName: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterRequest {
  userName: string
  email: string
  password: string
  userType: 'Patient' | 'Doctor'
}

export interface RegisterResponse {
  authToken: string
  role: string
  isRegistrationCompleted: boolean
}