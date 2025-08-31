import React, { useEffect } from 'react'
import { Heading, Fieldset, Radio, Button } from '@digdir/designsystemet-react'
import { useTestConfigStore, type TestProfile } from '../../stores/testConfigStore'
import { useChecklistStore } from '../../stores/checklistStore'
import { useTestStore } from '../../stores/testStore'
import { useNavigate } from 'react-router-dom'

interface TestProfileSelectorProps {
  className?: string
  profiles?: TestProfile[]
}

export function TestProfileSelector({ className, profiles }: TestProfileSelectorProps) {
  const navigate = useNavigate()
  const { availableProfiles, configuration, selectProfile, getFilteredChecklist, applyFilters } = useTestConfigStore()
  const { selectedProfile } = configuration
  const { checklist } = useChecklistStore()
  const { startNewSession } = useTestStore()

  // Anvend filtre når valgt profil endres
  useEffect(() => {
    if (checklist && selectedProfile) {
      console.log('TestProfileSelector: Applying filters due to profile change')
      applyFilters(checklist)
    }
  }, [checklist, selectedProfile, applyFilters])
  
  // Bruk tilgjengelige profiler eller filtrerte profiler
  const displayProfiles = profiles || availableProfiles

  const handleProfileChange = (profileId: string) => {
    selectProfile(profileId)
  }

  const handleStartTest = () => {
    if (checklist && selectedProfile) {
      const filteredChecklist = getFilteredChecklist(checklist)
      startNewSession(filteredChecklist)
      navigate('/overview')
    }
  }

  return (
    <div className={className}>
      <Heading level={2} data-size="lg">
        Velg testprofil
      </Heading>
      
      <Fieldset>
        <Fieldset.Legend>Testprofiler</Fieldset.Legend>
        
        {displayProfiles.map((profile) => (
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
      
      <div className="start-test-section">
        <Button 
          onClick={handleStartTest}
          disabled={!selectedProfile}
          className="start-test-button"
        >
          Start test
        </Button>
      </div>
    </div>
  )
}
