import { Card, Heading, Paragraph, Tag } from '@digdir/designsystemet-react'
import { Link } from 'react-router-dom'
import type { Category } from '../../types/checklist'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card 
      asChild 
      data-color="neutral"
      variant="tinted"
    >
      <Link to={`/category/${category.id}`}>
        <Card.Block>
          <Heading level={2} data-size="sm">
            {category.title}
          </Heading>
          <Paragraph data-size="sm">
            {category.description}
          </Paragraph>
          <Tag data-color='neutral' data-color-scheme='light'>
            {category.items.length} tester
          </Tag>
        </Card.Block>
      </Link>
    </Card>
  )
} 