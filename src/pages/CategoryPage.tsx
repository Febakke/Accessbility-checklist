import { useParams, useNavigate } from 'react-router-dom'
import type { Category } from '../types/checklist'
import checklistData from '../../data/checklists.json'
import { TestCard } from '../components/ui/TestCard'
import { Heading, Paragraph, Button, Link } from '@digdir/designsystemet-react'
import { useTestStore } from '../stores/testStore'

const checklist = checklistData as {
  id: string
  title: string
  description: string
  categories: Category[]
}

export default function CategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { results } = useTestStore()
  const category = checklist.categories.find((cat) => cat.id === id)

  if (!category) {
    return <div className="container">Kategori ikke funnet</div>
  }

  return (
    <div className="container">
      <Link  
        href="/"
        className="backlink"
      >
        Tilbake
      </Link>
      
      <Heading data-size="xl" className="mb-4">{category.title}</Heading>
      <Paragraph className="categorypage-description">{category.description}</Paragraph>
      
      <div className="grid">
        {category.items.map((item) => (
          <TestCard
            key={item.id}
            test={item}
          />
        ))}
      </div>
      
      <div className="category-actions">
        <Button onClick={() => navigate('/summary')}>
          Se oppsummering
        </Button>
      </div>
    </div>
  )
} 