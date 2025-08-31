import React, { useEffect } from 'react'
import { Heading, Checkbox, Fieldset, Button } from '@digdir/designsystemet-react'
import { useTestConfigStore, type ProductFeatures } from '../../stores/testConfigStore'
import { useChecklistStore } from '../../stores/checklistStore'
import { useTestStore } from '../../stores/testStore'
import { useNavigate } from 'react-router-dom'

interface ProductConfiguratorProps {
  className?: string
}

export function ProductConfigurator({ className }: ProductConfiguratorProps) {
  const navigate = useNavigate()
  const { configuration, updateProductFeatures, getFilteredChecklist, applyFilters } = useTestConfigStore()
  const { productFeatures } = configuration
  const { checklist } = useChecklistStore()
  const { startNewSession } = useTestStore()

  // Anvend filtre når produktets egenskaper endres
  useEffect(() => {
    if (checklist) {
      console.log('ProductConfigurator: Applying filters due to product features change')
      applyFilters(checklist)
    }
  }, [checklist, productFeatures, applyFilters])

  const handleFeatureChange = (feature: keyof ProductFeatures, value: boolean) => {
    updateProductFeatures({ [feature]: value })
  }

  const handleStartTest = () => {
    if (checklist) {
      const filteredChecklist = getFilteredChecklist(checklist)
      startNewSession(filteredChecklist)
      navigate('/overview')
    }
  }

  return (
    <div className={className}>
      <Heading level={2} data-size="lg">
        Hva inneholder produktet ditt?
      </Heading>
      
      <Fieldset>
        <Fieldset.Legend>Produktets egenskaper</Fieldset.Legend>
        
        <div className="feature-grid">
          <Checkbox
            checked={productFeatures.hasVideo}
            onChange={(e) => handleFeatureChange('hasVideo', e.target.checked)}
            label="Video-innhold"
          />
            
          
          
          <Checkbox
            checked={productFeatures.hasAudio}
            onChange={(e) => handleFeatureChange('hasAudio', e.target.checked)}
            label="Lyd-innhold"
          />
          
          <Checkbox
            checked={productFeatures.hasForms}
            onChange={(e) => handleFeatureChange('hasForms', e.target.checked)}
            label="Skjemaer"
          />
          
          <Checkbox
            checked={productFeatures.hasTables}
            onChange={(e) => handleFeatureChange('hasTables', e.target.checked)}
            label="Tabeller"
          />
          
          <Checkbox
            checked={productFeatures.hasImages}
            onChange={(e) => handleFeatureChange('hasImages', e.target.checked)}
            label="Bilder og ikoner"
          />
          
          <Checkbox
            checked={productFeatures.hasInteractiveElements}
            onChange={(e) => handleFeatureChange('hasInteractiveElements', e.target.checked)}
            label="Interaktive elementer"
          />
          
          <Checkbox
            checked={productFeatures.hasNavigation}
            onChange={(e) => handleFeatureChange('hasNavigation', e.target.checked)}
            label="Navigasjon"
          />
          
          <Checkbox
            checked={productFeatures.hasDynamicContent}
            onChange={(e) => handleFeatureChange('hasDynamicContent', e.target.checked)}
            label="Dynamisk innhold"
          />
          
          <Checkbox
            checked={productFeatures.hasMobileVersion}
            onChange={(e) => handleFeatureChange('hasMobileVersion', e.target.checked)}
            label="Mobilversjon"
          />
          
          <Checkbox
            checked={productFeatures.hasKeyboardNavigation}
            onChange={(e) => handleFeatureChange('hasKeyboardNavigation', e.target.checked)}
            label="Tastaturnavigasjon"
          />
        </div>
      </Fieldset>
      
      <div className="start-test-section">
        <Button 
          onClick={handleStartTest}
          className="start-test-button"
        >
          Start test
        </Button>
      </div>
    </div>
  )
}
