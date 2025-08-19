import { useNavigate } from 'react-router-dom'
import { Heading, Paragraph, Button, Link, Card } from '@digdir/designsystemet-react'
import { useTestStore } from '../stores/testStore'
import checklistData from '../../data/checklists.json'

// WCAG-rekkefølge basert på uutilsynet.no
const wcagOrder = [
  '1.1.1', '1.2.1', '1.2.2', '1.2.5', '1.3.1', '1.3.2', '1.3.3', '1.3.4', '1.3.5',
  '1.4.1', '1.4.2', '1.4.3', '1.4.4', '1.4.5', '1.4.10', '1.4.11', '1.4.12', '1.4.13',
  '2.1.1', '2.1.2', '2.1.4', '2.2.1', '2.2.2', '2.3.1', '2.4.1', '2.4.2', '2.4.3',
  '2.4.4', '2.4.5', '2.4.6', '2.4.7', '2.5.1', '2.5.2', '2.5.3', '2.5.4',
  '3.1.1', '3.1.2', '3.2.1', '3.2.2', '3.2.3', '3.2.4', '3.3.1', '3.3.2', '3.3.3', '3.3.4',
  '4.1.1', '4.1.2', '4.1.3'
]

const checklist = checklistData as {
  id: string
  title: string
  description: string
  categories: any[]
}

export default function SummaryPage() {
  const navigate = useNavigate()
  const { results, clearSession } = useTestStore()

  // Samle alle tester fra alle kategorier
  const allTests = checklist.categories.flatMap(category => 
    category.items.map(item => ({
      ...item,
      categoryTitle: category.title
    }))
  )

  // Organiser resultater etter WCAG-krav
  const resultsByWcag = new Map<string, any[]>()
  
  allTests.forEach(test => {
    if (test.wcagRefs) {
      test.wcagRefs.forEach(ref => {
        if (!resultsByWcag.has(ref.id)) {
          resultsByWcag.set(ref.id, [])
        }
        resultsByWcag.get(ref.id)!.push(test)
      })
    }
  })

  const handleStartNewSession = () => {
    clearSession()
    navigate('/')
  }

  const getTestResult = (testId: string) => {
    return results.find(r => r.testId === testId)
  }

  const getStatusText = (wcagId: string) => {
    const testsForWcag = resultsByWcag.get(wcagId) || []
    const testResults = testsForWcag.map(test => getTestResult(test.id))
    
    // Hvis ingen tester er utført
    if (testResults.every(result => !result)) {
      return 'Ikke testet'
    }
    
    // Hvis alle tester er godkjent
    if (testResults.every(result => result?.status === 'no-issues')) {
      return 'Godkjent'
    }
    
    // Hvis minst én test har feil
    const failedTests = testResults.filter(result => result?.status === 'found-issues')
    if (failedTests.length > 0) {
      return failedTests.map(result => result?.description).filter(Boolean).join('; ')
    }
    
    return 'Delvis godkjent'
  }

  return (
    <div className="container">
      <Link href="/" className="backlink">
        Tilbake
      </Link>
      
      <Heading data-size="xl" className="mb-4">
        Oppsummering av WCAG-tester
      </Heading>
      
      <Paragraph className="mb-4">
        Resultatene er organisert i henhold til den offisielle WCAG-rekkefølgen fra UUTilsynet.
      </Paragraph>

      <div className="summary-grid">
        {wcagOrder.map(wcagId => {
          const testsForWcag = resultsByWcag.get(wcagId) || []
          const statusText = getStatusText(wcagId)
          const hasIssues = statusText !== 'Godkjent' && statusText !== 'Ikke testet'
          
          return (
            <Card 
              key={wcagId} 
              variant={hasIssues ? "tinted" : "default"} 
              data-color={hasIssues ? "danger" : "success"}
            >
              <Card.Block>
                <Heading level={4} data-size="sm">
                  {wcagId}
                </Heading>
                <Paragraph data-size="sm">
                  {testsForWcag.length > 0 ? testsForWcag[0].wcagRefs?.find((ref: any) => ref.id === wcagId)?.title : 'Ukjent krav'}
                </Paragraph>
                <Paragraph data-size="sm" className="status-text">
                  <strong>Status:</strong> {statusText}
                </Paragraph>
              </Card.Block>
            </Card>
          )
        })}
      </div>

      <div className="summary-actions">
        <Button onClick={handleStartNewSession}>
          Start ny testsesjon
        </Button>
      </div>
    </div>
  )
}

