import { Heading, Fieldset, Radio } from '@digdir/designsystemet-react'
import { useTestConfigStore, type TestProfile } from '../../stores/testConfigStore'

interface TestProfileSelectorProps {
  className?: string
}

export function TestProfileSelector({ className }: TestProfileSelectorProps) {
  const { availableProfiles, configuration, selectProfile } = useTestConfigStore()
  const { selectedProfile } = configuration

  const handleProfileChange = (profileId: string) => {
    selectProfile(profileId)
  }

  return (
    <div className={className}>
      <Heading level={2} data-size="lg">
        Velg testprofil
      </Heading>
      
      <Fieldset>
        <Fieldset.Legend>Testprofiler</Fieldset.Legend>
        
        {availableProfiles.map((profile) => (
          <Radio
            key={profile.id}
            label={profile.name}
            value={profile.id}
            name="test-profiles"
            description={profile.description}
            checked={selectedProfile?.id === profile.id}
            onChange={() => handleProfileChange(profile.id)}
          />
        ))}
      </Fieldset>
    </div>
  )
}
