import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading, Button } from '@digdir/designsystemet-react'
import { CategoryCard } from '../components/ui/CategoryCard'
import { MarkdownContent } from '../components/ui/MarkdownContent'
import { useTestStore } from '../stores/testStore'
import { useChecklistStore } from '../stores/checklistStore'
import { useTestConfigStore } from '../stores/testConfigStore'

function CategoryOverviewPage() {
  const navigate = useNavigate()
  const { startNewSession, results } = useTestStore()
  const { checklist, loading, error, loadChecklist } = useChecklistStore()
  const { getFilteredChecklist, configuration, reapplyFilters } = useTestConfigStore()

  useEffect(() => {
    loadChecklist()
  }, [loadChecklist])

  // Reapply filters når checklist lastes
  useEffect(() => {
    if (checklist) {
      reapplyFilters(checklist)
    }
  }, [checklist, reapplyFilters])

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

  // Bruk filtrert checklist hvis tilgjengelig, ellers bruk full checklist
  const displayChecklist = configuration.filteredCategories.length > 0 
    ? { 
        ...checklist, 
        categories: configuration.filteredCategories.map(category => ({
          ...category,
          items: category.items.filter(item => 
            configuration.filteredItems.some(filteredItem => filteredItem.id === item.id)
          )
        }))
      }
    : checklist

  return (
    <div className="container">
      <div className="page-header">
        <Button 
          onClick={() => navigate('/')}
          variant="tertiary"
        >
          ← Tilbake til forsiden
        </Button>
        <Heading level={1} data-size="xl">
          {displayChecklist?.title}
        </Heading>
      </div>
      <div className="homepage-description">
        <MarkdownContent size="large">{displayChecklist?.description}</MarkdownContent>
      </div>
      
      {configuration.filteredCategories.length > 0 && (
        <div className="filter-info" style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          backgroundColor: 'var(--ds-color-accent-surface-tinted)', 
          borderRadius: '0.5rem',
          borderLeft: '4px solid var(--ds-color-accent-border-default)'
        }}>
          <strong>Filtrerte tester:</strong> Viser {configuration.filteredItems.length} relevante tester fra {configuration.filteredCategories.length} kategorier basert på din valgte testprofil.
        </div>
      )}
      
      <div className="grid">
        {displayChecklist?.categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      
      {results.length > 0 && (
        <div className="homepage-actions">
          <Button onClick={() => startNewSession(checklist)}>
            Start ny testsesjon
          </Button>
        </div>
      )}
    </div>
  )
}

export default CategoryOverviewPage
