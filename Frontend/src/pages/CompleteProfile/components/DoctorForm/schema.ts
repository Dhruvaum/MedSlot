import * as yup from 'yup'

export const doctorFormSchema = yup.object({
    fullName: yup.string().required('Full name is required'),
    phone: yup.string().required('Phone number is required'),
    specializationId: yup.string().required('Specialization is required'),
    qualificationId: yup.string().required('Qualification is required'),
    registrationNumber: yup.string().required('Registration Number is required'),
    registeringCouncilId: yup.string().required('Registering Council is required'),
    workAddress: yup.string().required('Address is required')
})