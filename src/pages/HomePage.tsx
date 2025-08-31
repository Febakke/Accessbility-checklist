import React, { useEffect, useState } from 'react'
import { Heading, Button, Card } from '@digdir/designsystemet-react'
import { useNavigate } from 'react-router-dom'
import '../styles/new-homepage.css'
import { ProductConfigurator } from '../components/ui/ProductConfigurator'
import { TestProfileSelector } from '../components/ui/TestProfileSelector'

import { MarkdownContent } from '../components/ui/MarkdownContent'
import { useTestStore } from '../stores/testStore'
import { useChecklistStore } from '../stores/checklistStore'
import { useTestConfigStore } from '../stores/testConfigStore'

function HomePage() {
  const navigate = useNavigate()
  const { startNewSession, results } = useTestStore()
  const { checklist, loading, error, loadChecklist } = useChecklistStore()
  const { selectProfile, availableProfiles } = useTestConfigStore()
  const [step, setStep] = useState<'initial' | 'full-test' | 'component-test'>('initial')

  useEffect(() => {
    loadChecklist()
  }, [loadChecklist])



  const handleFullTest = () => {
    selectProfile('full-test')
    setStep('full-test')
  }

  const handleComponentTest = () => {
    setStep('component-test')
  }

  const handleBack = () => {
    setStep('initial')
  }

  if (loading) {
    return (
      <div className="container">
        <Heading level={1} data-size="xl">
          Laster checklist...
        </Heading>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <Heading level={1} data-size="xl">
          Feil ved lasting av checklist
        </Heading>
        <p>Det oppstod en feil: {error}</p>
        <Button onClick={loadChecklist}>
          Prøv igjen
        </Button>
      </div>
    )
  }

  if (!checklist) {
    return (
      <div className="container">
        <Heading level={1} data-size="xl">
          Ingen checklist tilgjengelig
        </Heading>
      </div>
    )
  }

  const renderStep = () => {
    switch (step) {
      case 'initial':
        return (
          <div className="wizard-step">
            <div className="hero-section">
              <Heading level={1} data-size="xl">
                {checklist.title}
              </Heading>
              <div className="hero-description">
                <MarkdownContent size="large">{checklist.description}</MarkdownContent>
              </div>
            </div>

            <div className="choice-grid">
              <Card className="choice-card" data-color="neutral">
                <Card.Block>
                  <Heading level={2} data-size="lg">Full tilgjengelighetstest</Heading>
                  <p>Test alle WCAG-krav for hele løsningen din.</p>
                  <Button onClick={handleFullTest} className="choice-button">
                    Velg full test
                  </Button>
                </Card.Block>
              </Card>

              <Card className="choice-card" data-color="neutral">
                <Card.Block>
                  <Heading level={2} data-size="lg">Test enkelt komponenter</Heading>
                  <p>Fokusert testing av spesifikke komponenter eller funksjoner.</p>
                  <Button onClick={handleComponentTest} className="choice-button">
                    Velg komponent-test
                  </Button>
                </Card.Block>
              </Card>
            </div>
          </div>
        )

      case 'full-test':
        return (
          <div className="wizard-step">
            <div className="step-header">
              <Button onClick={handleBack} variant="tertiary">
                ← Tilbake
              </Button>
              <Heading level={1} data-size="xl">Full tilgjengelighetstest</Heading>
            </div>

            <div className="configuration-grid">
              <Card className="config-card" data-color="neutral">
                <Card.Block>
                  <ProductConfigurator />
                </Card.Block>
              </Card>
            </div>
          </div>
        )

      case 'component-test':
        return (
          <div className="wizard-step">
            <div className="step-header">
              <Button onClick={handleBack} variant="tertiary">
                ← Tilbake
              </Button>
              <Heading level={1} data-size="xl">Test enkelt komponenter</Heading>
            </div>

            <div className="configuration-grid">
              <Card className="config-card" data-color="neutral">
                <Card.Block>
                  <TestProfileSelector 
                    profiles={availableProfiles.filter(p => p.id !== 'full-test')}
                  />
                </Card.Block>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="container">
      {renderStep()}

      {results.length > 0 && step === 'initial' && (
        <div className="previous-results" data-color="neutral">
          <Heading level={2} data-size="lg">
            Tidligere resultater
          </Heading>
          <p>Du har {results.length} tidligere testsesjoner.</p>
          <Button onClick={() => startNewSession(checklist)}>
            Start ny testsesjon
          </Button>
        </div>
      )}
    </div>
  )
}

export default HomePage
