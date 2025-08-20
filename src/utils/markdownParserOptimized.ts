import { marked } from 'marked'
import type { Checklist, Category, ChecklistItem, WcagRef } from '../types/checklist'

// Cache for parsed data med TTL (Time To Live)
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutter

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }

  clearExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
const cache = new Cache()

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

// Funksjon for å laste en fil med caching
async function fetchWithCache(url: string, cacheKey: string, ttl?: number): Promise<string> {
  // Sjekk cache først
  const cached = cache.get<string>(cacheKey)
  if (cached) {
    return cached
  }

  // Last fra nettverk
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  const content = await response.text()
  
  // Lagre i cache
  cache.set(cacheKey, content, ttl)
  
  return content
}

// Funksjon for å laste hovedkonfigurasjon
async function loadConfig(): Promise<any> {
  try {
    const content = await fetchWithCache('/content/_config.md', 'config', 10 * 60 * 1000) // 10 minutter
    return parseMarkdownFile(content)
  } catch (error) {
    console.error('Kunne ikke laste konfigurasjon:', error)
    return null
  }
}

// Funksjon for å laste kategori-metadata
async function loadCategoryMetadata(categoryId: string): Promise<any> {
  try {
    const content = await fetchWithCache(
      `/content/categories/${categoryId}/_index.md`, 
      `category-${categoryId}`, 
      5 * 60 * 1000 // 5 minutter
    )
    return parseMarkdownFile(content)
  } catch (error) {
    console.error(`Kunne ikke laste kategori-metadata for ${categoryId}:`, error)
    return null
  }
}

// Dynamisk filsystem-lesing (forenklet implementasjon)
async function getTestFilesForCategory(categoryId: string): Promise<string[]> {
  // For nå, bruk hardkodet liste
  // I en ekte implementasjon ville vi lese filsystemet dynamisk
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

// Funksjon for å laste alle tester i en kategori
async function loadCategoryTests(categoryId: string): Promise<ChecklistItem[]> {
  const tests: ChecklistItem[] = []
  
  try {
    const testFiles = await getTestFilesForCategory(categoryId)
    
    // Last tester parallelt for bedre ytelse
    const testPromises = testFiles.map(async (testFile) => {
      return await loadTest(categoryId, testFile)
    })
    
    const testResults = await Promise.all(testPromises)
    
    // Filtrer bort null-verdier
    return testResults.filter((test): test is ChecklistItem => test !== null)
    
  } catch (error) {
    console.error(`Kunne ikke laste tester for kategori ${categoryId}:`, error)
    return tests
  }
}

// Hovedfunksjon for å laste hele checklisten
export async function loadChecklistFromFiles(): Promise<Checklist> {
  // Rydd opp utløpte cache-entries
  cache.clearExpired()
  
  // Sjekk cache først
  const cached = cache.get<Checklist>('full-checklist')
  if (cached) {
    return cached
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
    
    // Last kategorier parallelt
    const categoryPromises = categoryIds.map(async (categoryId) => {
      const metadata = await loadCategoryMetadata(categoryId)
      if (metadata) {
        const tests = await loadCategoryTests(categoryId)
        
        return {
          id: metadata.id,
          title: metadata.title,
          description: metadata.description,
          items: tests
        }
      }
      return null
    })
    
    const categoryResults = await Promise.all(categoryPromises)
    const categories = categoryResults.filter((cat): cat is Category => cat !== null)
    
    // Bygg opp checklist-struktur
    const checklist: Checklist = {
      id: config.id,
      title: config.title,
      description: config.description,
      categories: categories
    }
    
    // Cache resultatet
    cache.set('full-checklist', checklist, 10 * 60 * 1000) // 10 minutter
    
    return checklist
    
  } catch (error) {
    console.error('Feil ved lasting av checklist:', error)
    throw error
  }
}

// Funksjon for å laste en spesifikk test
export async function loadTest(categoryId: string, testId: string): Promise<ChecklistItem | null> {
  try {
    const cacheKey = `test-${categoryId}-${testId}`
    const content = await fetchWithCache(
      `/content/categories/${categoryId}/${testId}.md`,
      cacheKey,
      5 * 60 * 1000 // 5 minutter
    )
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
  cache.clear()
}

// Funksjon for å få cache-statistikk
export function getCacheStats(): { size: number } {
  return { size: cache.cache.size }
}
