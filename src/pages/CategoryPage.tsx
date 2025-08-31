import { useParams, useNavigate } from 'react-router-dom'
import type { Category } from '../types/checklist'
import { TestCard } from '../components/ui/TestCard'
import { Heading, Paragraph, Button, Link } from '@digdir/designsystemet-react'
import { useTestStore } from '../stores/testStore'
import { useChecklistStore } from '../stores/checklistStore'
import { useTestConfigStore } from '../stores/testConfigStore'

export default function CategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { results } = useTestStore()
  const { checklist, loading, error } = useChecklistStore()
  const { configuration } = useTestConfigStore()
  
  // Bruk filtrert checklist hvis tilgjengelig
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
  
  const category = displayChecklist?.categories.find((cat) => cat.id === id)

  if (loading) {
    return <div className="container">Laster...</div>
  }

  if (error) {
    return <div className="container">Feil: {error}</div>
  }

  if (!category) {
    return <div className="container">Kategori ikke funnet</div>
  }

  return (
    <div className="container">
      <Link  
        href="/overview"
        className="backlink"
      >
        Tilbake til oversikt
      </Link>
      
      <Heading data-size="xl" className="mb-4">{category.title}</Heading>
      <Paragraph className="categorypage-description">{category.description}</Paragraph>
      
      {configuration.filteredItems.length > 0 && (
        <div className="filter-info" style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          backgroundColor: 'var(--ds-color-accent-surface-tinted)', 
          borderRadius: '0.5rem',
          borderLeft: '4px solid var(--ds-color-accent-border-default)'
        }}>
          <strong>Filtrerte tester:</strong> Viser {category.items.length} relevante tester av {checklist?.categories.find(cat => cat.id === id)?.items.length || 0} totalt i denne kategorien.
        </div>
      )}
      
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