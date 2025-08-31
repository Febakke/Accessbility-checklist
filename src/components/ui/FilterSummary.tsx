import React from 'react'
import { Heading, Tag, Button } from '@digdir/designsystemet-react'
import { useTestConfigStore } from '../../stores/testConfigStore'
import { useChecklistStore } from '../../stores/checklistStore'

interface FilterSummaryProps {
  className?: string
  onStartTest: () => void
}

export function FilterSummary({ className, onStartTest }: FilterSummaryProps) {
  const { configuration, applyFilters } = useTestConfigStore()
  const { checklist } = useChecklistStore()
  const { productFeatures, selectedProfile, filteredCategories, filteredItems } = configuration

  // Anvend filtre når komponenten rendres
  React.useEffect(() => {
    if (checklist) {
      console.log('Applying filters with:', { productFeatures, selectedProfile })
      applyFilters(checklist)
    }
  }, [checklist, productFeatures, selectedProfile, applyFilters])

  const activeFeatures = Object.entries(productFeatures)
    .filter(([_, value]) => value)
    .map(([key, _]) => key)

  const totalTests = filteredItems.length
  const totalCategories = filteredCategories.length
  
  console.log('FilterSummary render:', { totalTests, totalCategories, filteredItems })

  return (
    <div className={className}>
      <Heading level={2} data-size="lg">
        Testoppsummering
      </Heading>
      
      <div className="summary-content">
        {selectedProfile && (
          <div className="selected-profile">
            <strong>Valgt profil:</strong> {selectedProfile.name}
          </div>
        )}
        
        <div className="active-features">
          <strong>Aktive egenskaper:</strong>
          <div className="feature-tags">
            {activeFeatures.length > 0 ? (
              activeFeatures.map((feature) => (
                <Tag key={feature} data-color="accent">
                  {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Tag>
              ))
            ) : (
              <span className="no-features">Ingen spesifikke egenskaper valgt</span>
            )}
          </div>
        </div>
        
        <div className="test-stats">
          <div className="stat">
            <strong>Kategorier:</strong> {totalCategories}
          </div>
          <div className="stat">
            <strong>Tester:</strong> {totalTests}
          </div>
        </div>
        
        {totalTests > 0 && (
          <Button 
            onClick={() => {
              console.log('Start test button clicked!')
              onStartTest()
            }} 
            className="start-test-button"
          >
            Start test ({totalTests} tester)
          </Button>
        )}
      </div>
    </div>
  )
}
