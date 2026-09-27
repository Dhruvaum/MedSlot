import Page from "../../components/Page"
import PatientForm from "./components/PatientForm/PatientForm"
import DoctorForm from "./components/DoctorForm/DoctorForm"

const CompleteProfilePage = () => {

  const role = localStorage.getItem('role');

  return (
    <Page title="Complete Your Profile - MedSlot">
      {role === 'Patient' ? <PatientForm/> : <DoctorForm/>}
    </Page>
  );
}

export default CompleteProfilePage