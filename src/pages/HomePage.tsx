import { useState, useEffect } from 'react'
import { Heading, Paragraph } from '@digdir/designsystemet-react'
import checklistData from '../../data/checklists.json'
import { CategoryCard } from '../components/ui/CategoryCard'

function HomePage() {
  const [checklist, setChecklist] = useState(checklistData)

  return (
    <div className="container">
      <Heading level={1} data-size="xl">
        {checklist.title}
      </Heading>
      <Paragraph data-size="lg" className="homepage-description">
        {checklist.description}
      </Paragraph>
      
      <div className="grid">
        {checklist.categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

export default HomePage 