import ProfileForm from './profile-form'
import ContentSection from '../components/content-section'

export default function SettingsProfile() {
  return (
    <ContentSection
      title='Profile'
      desc='This is how officers and administrators will recognize your profile in the Police Management System'
    >
      <ProfileForm />
    </ContentSection>
  )
}
