import * as yup from 'yup'

export const patientFormSchema = yup.object({
    fullName: yup.string().required('Full name is required'),
    dob: yup.date().required('Date of birth is required').max(new Date(), 'Date of birth can not be in future'),
    gender: yup.string().required('Gender is required'),
    phone: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required')
})