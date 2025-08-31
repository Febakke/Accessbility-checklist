import React, { useEffect } from 'react'
import { Heading, Button, Card } from '@digdir/designsystemet-react'
import { useNavigate } from 'react-router-dom'
import '../styles/new-homepage.css'
import { ProductConfigurator } from '../components/ui/ProductConfigurator'
import { TestProfileSelector } from '../components/ui/TestProfileSelector'
import { FilterSummary } from '../components/ui/FilterSummary'
import { MarkdownContent } from '../components/ui/MarkdownContent'
import { useTestStore } from '../stores/testStore'
import { useChecklistStore } from '../stores/checklistStore'
import { useTestConfigStore } from '../stores/testConfigStore'

function HomePage() {
  const navigate = useNavigate()
  const { startNewSession, results } = useTestStore()
  const { checklist, loading, error, loadChecklist } = useChecklistStore()
  const { getFilteredChecklist } = useTestConfigStore()

  useEffect(() => {
    loadChecklist()
  }, [loadChecklist])

  const handleStartTest = () => {
    console.log('handleStartTest called')
    if (checklist) {
      console.log('Checklist exists, getting filtered checklist')
      const filteredChecklist = getFilteredChecklist(checklist)
      console.log('Filtered checklist:', filteredChecklist)
      startNewSession(filteredChecklist)
      console.log('startNewSession called')
      
      // Naviger til kategorioversikt med filtrerte kategorier
      console.log('Navigating to category overview with filtered categories')
      navigate('/overview')
    } else {
      console.log('No checklist available')
    }
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

  return (
    <div className="container">
      <div className="hero-section">
        <Heading level={1} data-size="xl">
          {checklist.title}
        </Heading>
        <div className="hero-description">
          <MarkdownContent size="large">{checklist.description}</MarkdownContent>
        </div>
      </div>

      <div className="configuration-grid">
        <Card className="config-card" data-color="neutral">
          <Card.Block>
            <ProductConfigurator />
          </Card.Block>
        </Card>

        <Card className="config-card" data-color="neutral">
          <Card.Block>
            <TestProfileSelector />
          </Card.Block>
        </Card>

        <Card className="config-card summary-card" data-color="accent">
          <Card.Block>
            <FilterSummary onStartTest={handleStartTest} />
          </Card.Block>
        </Card>
      </div>

      {results.length > 0 && (
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
