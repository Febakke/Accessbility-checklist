import { Card, Details, Paragraph, Link } from '@digdir/designsystemet-react'
import type { ChecklistItem } from '../../types/checklist'

interface TestCardProps {
  test: ChecklistItem
}

export function TestCard({ test }: TestCardProps) {
  return (
    <Card variant="tinted" data-color="neutral">
      <Details>
        <Details.Summary>{test.title}</Details.Summary>
        <Details.Content>
          <Paragraph data-size="sm">
            {test.description}
          </Paragraph>
          
          {test.wcagRefs && test.wcagRefs.length > 0 && (
            <div className="testcard-wcag-refs">
              {test.wcagRefs.map((ref, index) => (
                <Link 
                  key={ref.id} 
                  href={ref.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  
                >
                  {ref.id} - {ref.title} (åpnes i ny fane)
                </Link>
              ))}
            </div>
          )}
        </Details.Content>
      </Details>
    </Card>
  )
} 