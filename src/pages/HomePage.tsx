import { useEffect } from 'react'
import { Heading, Button } from '@digdir/designsystemet-react'
import { CategoryCard } from '../components/ui/CategoryCard'
import { MarkdownContent } from '../components/ui/MarkdownContent'
import { useTestStore } from '../stores/testStore'
import { useChecklistStore } from '../stores/checklistStore'

function HomePage() {
  const { startNewSession, results } = useTestStore()
  const { checklist, loading, error, loadChecklist } = useChecklistStore()

  useEffect(() => {
    loadChecklist()
  }, [loadChecklist])

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
      <Heading level={1} data-size="xl">
        {checklist.title}
      </Heading>
      <div className="homepage-description">
        <MarkdownContent size="large">{checklist.description}</MarkdownContent>
      </div>
      
      <div className="grid">
        {checklist.categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      
      {results.length > 0 && (
        <div className="homepage-actions">
          <Button onClick={startNewSession}>
            Start ny testsesjon
          </Button>
        </div>
      )}
    </div>
  )
}

export default HomePage 