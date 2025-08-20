import { useEffect, useState } from 'react'
import { Heading, Button } from '@digdir/designsystemet-react'
import { loadChecklistFromFiles, loadTest } from '../utils/markdownParser'
import type { Checklist, ChecklistItem } from '../types/checklist'

function TestPage() {
  const [checklist, setChecklist] = useState<Checklist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testItem, setTestItem] = useState<ChecklistItem | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await loadChecklistFromFiles()
        setChecklist(data)
        
        // Test å laste en spesifikk test
        const test = await loadTest('automatic-tools', 'alternative-tekster')
        setTestItem(test)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ukjent feil')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container">
        <Heading level={1} data-size="xl">
          Tester Markdown-parser...
        </Heading>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <Heading level={1} data-size="xl">
          Feil ved testing
        </Heading>
        <p>Feil: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Prøv igjen
        </Button>
      </div>
    )
  }

  return (
    <div className="container">
      <Heading level={1} data-size="xl">
        Markdown-parser Test
      </Heading>
      
      {checklist && (
        <div>
          <h2>Checklist lastet:</h2>
          <p><strong>ID:</strong> {checklist.id}</p>
          <p><strong>Tittel:</strong> {checklist.title}</p>
          <p><strong>Beskrivelse:</strong> {checklist.description}</p>
          <p><strong>Kategorier:</strong> {checklist.categories.length}</p>
          
          <h3>Kategorier:</h3>
          <ul>
            {checklist.categories.map(category => (
              <li key={category.id}>
                {category.title} ({category.items.length} tester)
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {testItem && (
        <div>
          <h2>Test-element lastet:</h2>
          <p><strong>ID:</strong> {testItem.id}</p>
          <p><strong>Tittel:</strong> {testItem.title}</p>
          <p><strong>Beskrivelse:</strong> {testItem.description}</p>
          <p><strong>WCAG-referanser:</strong> {testItem.wcagRefs?.length || 0}</p>
          {testItem.howTo && (
            <div>
              <h3>Hvordan teste:</h3>
              <div dangerouslySetInnerHTML={{ __html: testItem.howTo }} />
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '2rem' }}>
        <Button onClick={() => window.location.href = '/'}>
          Tilbake til hovedsiden
        </Button>
      </div>
    </div>
  )
}

export default TestPage
