import { useState } from 'react'
// Compo
import Page from '../../components/Page'
import TypeSelectionStep from './components/TypeSelectionStep'
import Form from './components/Form/Form'

const SignUpPage = () => {

  //States
  const [selectedUserType, setSelectedUserType] = useState<'Patient' | 'Doctor' | null>(null)

  return (
    <Page title="Sign Up - MedSlot">
      {
        selectedUserType === null
        ? <TypeSelectionStep setType={setSelectedUserType}/>
        : <Form userType={selectedUserType} onBack={() => setSelectedUserType(null)}/>
      }
    </Page>
  )
}

export default SignUpPage