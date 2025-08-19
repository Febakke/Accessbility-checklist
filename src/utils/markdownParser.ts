import { marked } from 'marked'
import type { Checklist, Category, ChecklistItem, WcagRef } from '../types/checklist'

// Cache for parsed data
let checklistCache: Checklist | null = null

// Enkel frontmatter-parser som fungerer i nettleseren
function parseFrontmatter(content: string): { data: any, content: string } {
  const lines = content.split('\n')
  
  if (lines[0] !== '---') {
    return { data: {}, content }
  }
  
  let i = 1
  const frontmatterLines: string[] = []
  
  while (i < lines.length && lines[i] !== '---') {
    frontmatterLines.push(lines[i])
    i++
  }
  
  if (i >= lines.length) {
    return { data: {}, content }
  }
  
  const frontmatterText = frontmatterLines.join('\n')
  const markdownContent = lines.slice(i + 1).join('\n')
  
  // Parse YAML-lignende frontmatter
  const data: any = {}
  const frontmatterLines2 = frontmatterText.split('\n')
  
  let currentKey: string | null = null
  let currentArray: any[] = []
  let inArray = false
  
  for (const line of frontmatterLines2) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    
    // Sjekk om vi starter et array
    if (trimmed.endsWith(':')) {
      const key = trimmed.slice(0, -1).trim()
      currentKey = key
      currentArray = []
      inArray = true
      data[key] = currentArray
      continue
    }
    
    // Sjekk om vi er i et array
    if (inArray && trimmed.startsWith('- ')) {
      const itemText = trimmed.slice(2)
      const item: any = {}
      
      // Parse array-item (enkel implementasjon)
      const lines = itemText.split(', ')
      for (const line of lines) {
        const [key, value] = line.split(': ')
        if (key && value) {
          item[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '')
        }
      }
      
      currentArray.push(item)
      continue
    }
    
    // Håndter vanlige key-value par
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = trimmed.substring(0, colonIndex).trim()
    let value = trimmed.substring(colonIndex + 1).trim()
    
    // Fjern quotes hvis de finnes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    
    data[key] = value
    inArray = false
  }
  
  return { data, content: markdownContent }
}

// Funksjon for å parse en Markdown-fil
function parseMarkdownFile(content: string): any {
  const { data, content: markdownContent } = parseFrontmatter(content)
  
  return {
    ...data,
    content: marked(markdownContent)
  }
}

// Funksjon for å laste hovedkonfigurasjon
async function loadConfig(): Promise<any> {
  try {
    const response = await fetch('/content/_config.md')
    const content = await response.text()
    return parseMarkdownFile(content)
  } catch (error) {
    console.error('Kunne ikke laste konfigurasjon:', error)
    return null
  }
}

// Funksjon for å laste kategori-metadata
async function loadCategoryMetadata(categoryId: string): Promise<any> {
  try {
    const response = await fetch(`/content/categories/${categoryId}/_index.md`)
    const content = await response.text()
    return parseMarkdownFile(content)
  } catch (error) {
    console.error(`Kunne ikke laste kategori-metadata for ${categoryId}:`, error)
    return null
  }
}

// Funksjon for å laste alle tester i en kategori
async function loadCategoryTests(categoryId: string): Promise<ChecklistItem[]> {
  const tests: ChecklistItem[] = []
  
  try {
    // For nå, last tester manuelt basert på kategorien
    // I en ekte implementasjon ville vi lese filsystemet dynamisk
    const testFiles = await getTestFilesForCategory(categoryId)
    
    for (const testFile of testFiles) {
      const test = await loadTest(categoryId, testFile)
      if (test) {
        tests.push(test)
      }
    }
    
    return tests
  } catch (error) {
    console.error(`Kunne ikke laste tester for kategori ${categoryId}:`, error)
    return tests
  }
}

// Funksjon for å få test-filer for en kategori (hardkodet for nå)
async function getTestFilesForCategory(categoryId: string): Promise<string[]> {
  const testFiles: Record<string, string[]> = {
    'automatic-tools': [
      'alternative-tekster',
      'input-ledetekster',
      'sprak-definert',
      'ingen-auto-refresh',
      'ingen-auto-oppdatering',
      'overskrifter-innhold',
      'tomme-knapper',
      'tomme-lenker',
      'kontraster',
      'nettsiden-tittel'
    ],
    'keyboard': [
      'tastatur-funksjonalitet',
      'rekkefolge-mening',
      'ingen-tastaturfelle',
      'synlig-fokusmarkor',
      'hoppe-over-blokker',
      'ingen-auto-fokus',
      'hurtigtaster-tegn',
      'konsekvent-navigasjon',
      'fokus-kontekstendring'
    ],
    'screenreader': [
      'overskrifter-landmerker',
      'tilgjengelig-navn',
      'statusbeskjeder',
      'rekkefolge-innhold'
    ],
    'media': [
      'video-tekstalternativ',
      'video-uten-lyd',
      'video-teksting',
      'lyd-kontroll',
      'pause-stopp',
      'video-synstolking'
    ],
    'contrast': [
      'tekst-kontrast',
      'sma-kontrast',
      'komponent-kontrast',
      'element-kontrast',
      'grafiske-elementer'
    ],
    'zoom': [
      'zoom-200',
      'zoom-400',
      'tekstavstand'
    ],
    'mobile': [
      'visningstilpasning',
      'bevegelsesstyring'
    ],
    'forms': [
      'standardformat',
      'feilmelding-identifikasjon',
      'feilmelding-forslag',
      'feilmelding-juridisk',
      'skjemaelement-instruksjoner',
      'obligatoriske-felt'
    ],
    'pointer': [
      'enkel-pekerinput',
      'forhindre-feilaktig-input'
    ],
    'manual': [
      'ikke-bare-visuelle',
      'ikke-bare-farge',
      'viktige-bilder',
      'ekstra-innhold',
      'blinking',
      'sidetitler',
      'sprak-deler',
      'konsekvent-funksjonalitet',
      'kodedeling',
      'navn-rolle',
      'relasjoner',
      'flere-mater'
    ]
  }
  
  return testFiles[categoryId] || []
}

// Hovedfunksjon for å laste hele checklisten
export async function loadChecklistFromFiles(): Promise<Checklist> {
  // Returner cache hvis tilgjengelig
  if (checklistCache) {
    return checklistCache
  }
  
  try {
    // Last konfigurasjon
    const config = await loadConfig()
    if (!config) {
      throw new Error('Kunne ikke laste konfigurasjon')
    }
    
    // Definer kategorier
    const categoryIds = [
      'automatic-tools',
      'keyboard', 
      'screenreader',
      'media',
      'contrast',
      'zoom',
      'mobile',
      'forms',
      'pointer',
      'manual'
    ]
    
    const categories: Category[] = []
    
    // Last hver kategori
    for (const categoryId of categoryIds) {
      const metadata = await loadCategoryMetadata(categoryId)
      if (metadata) {
        const tests = await loadCategoryTests(categoryId)
        
        categories.push({
          id: metadata.id,
          title: metadata.title,
          description: metadata.description,
          items: tests
        })
      }
    }
    
    // Bygg opp checklist-struktur
    const checklist: Checklist = {
      id: config.id,
      title: config.title,
      description: config.description,
      categories: categories
    }
    
    // Cache resultatet
    checklistCache = checklist
    
    return checklist
    
  } catch (error) {
    console.error('Feil ved lasting av checklist:', error)
    throw error
  }
}

// Funksjon for å laste en spesifikk test
export async function loadTest(categoryId: string, testId: string): Promise<ChecklistItem | null> {
  try {
    const response = await fetch(`/content/categories/${categoryId}/${testId}.md`)
    const content = await response.text()
    const parsed = parseMarkdownFile(content)
    
    return {
      id: parsed.id,
      title: parsed.title,
      description: parsed.description,
      wcagRefs: parsed.wcagRefs || [],
      howTo: parsed.content
    }
  } catch (error) {
    console.error(`Kunne ikke laste test ${testId}:`, error)
    return null
  }
}

// Funksjon for å rydde cache
export function clearCache(): void {
  checklistCache = null
}
