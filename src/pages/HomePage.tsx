import { useState, useEffect } from 'react'
import { Heading, Button } from '@digdir/designsystemet-react'
import checklistData from '../../data/checklists.json'
import { CategoryCard } from '../components/ui/CategoryCard'
import { MarkdownContent } from '../components/ui/MarkdownContent'
import { useTestStore } from '../stores/testStore'

function HomePage() {
  const [checklist, setChecklist] = useState(checklistData)
  const { startNewSession, results } = useTestStore()

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