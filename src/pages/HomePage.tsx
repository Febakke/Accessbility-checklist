import { useState, useEffect } from 'react'
import { Heading } from '@digdir/designsystemet-react'
import checklistData from '../../data/checklists.json'
import { CategoryCard } from '../components/ui/CategoryCard'
import { MarkdownContent } from '../components/ui/MarkdownContent'

function HomePage() {
  const [checklist, setChecklist] = useState(checklistData)

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
    </div>
  )
}

export default HomePage 