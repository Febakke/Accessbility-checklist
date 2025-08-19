import { useState, useEffect } from 'react'
import { Card, Heading, Paragraph, Link, Textfield, Fieldset, Radio} from '@digdir/designsystemet-react'
import type { ChecklistItem } from '../../types/checklist'
import { MarkdownContent } from './MarkdownContent'
import { useTestStore } from '../../stores/testStore'

interface TestCardProps {
  test: ChecklistItem
}

export function TestCard({ test }: TestCardProps) {
  const [showDescription, setShowDescription] = useState(false)
  const [description, setDescription] = useState('')
  const { saveTestResult, getTestResult } = useTestStore()
  
  const existingResult = getTestResult(test.id)
  const [selectedStatus, setSelectedStatus] = useState<'no-issues' | 'found-issues' | null>(
    existingResult?.status || null
  )
  
  // Sett beskrivelse fra eksisterende resultat
  useEffect(() => {
    if (existingResult?.description) {
      setDescription(existingResult.description)
      setShowDescription(true)
    }
  }, [existingResult])

  const handleStatusChange = (status: 'no-issues' | 'found-issues') => {
    setSelectedStatus(status)
    
    if (status === 'found-issues') {
      setShowDescription(true)
    } else {
      setShowDescription(false)
      setDescription('')
    }
    
    saveTestResult(test.id, status, status === 'found-issues' ? description : undefined)
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    if (selectedStatus === 'found-issues') {
      saveTestResult(test.id, selectedStatus, value)
    }
  }

  return (
    <Card variant="tinted" data-color="neutral">
      <Card.Block>
        <Heading level={3} data-size="sm">
          {test.title}
        </Heading>
        <Paragraph data-size="sm">
          <MarkdownContent size="medium">
            {test.description}
          </MarkdownContent>
        </Paragraph>
        {test.howTo && (
          <Paragraph data-size="sm">
            <MarkdownContent size="medium">
              {test.howTo}
            </MarkdownContent>
          </Paragraph>
        )}
          
        {test.wcagRefs && test.wcagRefs.length > 0 && (
          <div className="testcard-linklist">
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

        <div className="testcard-actions">
          <Fieldset>
            <Fieldset.Legend>Testresultat</Fieldset.Legend>
            <div>
              <Radio
                label='Jeg fant ingen feil av denne typen'
                id={`${test.id}-no-issues`}
                name={`test-${test.id}`}
                value="no-issues"
                checked={selectedStatus === 'no-issues'}
                onChange={(e) => handleStatusChange(e.target.value as 'no-issues' | 'found-issues')}
              />
             
            </div>
            <div>
              <Radio
                label='Jeg fant feil'
                id={`${test.id}-found-issues`}
                name={`test-${test.id}`}
                value="found-issues"
                checked={selectedStatus === 'found-issues'}
                onChange={(e) => handleStatusChange(e.target.value as 'no-issues' | 'found-issues')}
              />
            </div>
          </Fieldset>

          {showDescription && (
            <div className="testcard-description">
              <Textfield
                label="Beskriv feilen du fant"
                multiline
                rows={4}
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                
              />
            </div>
          )}
        </div>
      </Card.Block>
    </Card>
  )
} 