import matter from 'gray-matter'
import { marked } from 'marked'

// Simuler fetch for Node.js
import fetch from 'node-fetch'

// Funksjon for å parse en Markdown-fil
function parseMarkdownFile(content) {
  const { data, content: markdownContent } = matter(content)
  
  return {
    ...data,
    content: marked(markdownContent)
  }
}

// Funksjon for å laste hovedkonfigurasjon
async function loadConfig() {
  try {
    const response = await fetch('http://localhost:5174/content/_config.md')
    const content = await response.text()
    return parseMarkdownFile(content)
  } catch (error) {
    console.error('Kunne ikke laste konfigurasjon:', error)
    return null
  }
}

// Funksjon for å laste kategori-metadata
async function loadCategoryMetadata(categoryId) {
  try {
    const response = await fetch(`http://localhost:5174/content/categories/${categoryId}/_index.md`)
    const content = await response.text()
    return parseMarkdownFile(content)
  } catch (error) {
    console.error(`Kunne ikke laste kategori-metadata for ${categoryId}:`, error)
    return null
  }
}

// Test-filer for hver kategori (hardkodet for nå)
const testFiles = {
  'automatic-tools': ['alternative-tekster'],
  'keyboard': ['tastatur-funksjonalitet'],
  'screenreader': ['overskrifter-landmerker'],
  'media': ['video-tekstalternativ'],
  'contrast': ['tekst-kontrast'],
  'zoom': ['zoom-200'],
  'mobile': ['visningstilpasning'],
  'forms': ['standardformat'],
  'pointer': ['enkel-pekerinput'],
  'manual': ['ikke-bare-visuelle']
}

// Funksjon for å laste en test
async function loadTest(categoryId, testId) {
  try {
    const response = await fetch(`http://localhost:5174/content/categories/${categoryId}/${testId}.md`)
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

async function testMarkdownParser() {
  console.log('🧪 Tester Markdown-parser...')
  
  try {
    // Last konfigurasjon
    const config = await loadConfig()
    if (!config) {
      throw new Error('Kunne ikke laste konfigurasjon')
    }
    
    console.log('✅ Konfigurasjon lastet:', {
      id: config.id,
      title: config.title
    })
    
    // Test en kategori
    const categoryId = 'automatic-tools'
    const metadata = await loadCategoryMetadata(categoryId)
    
    if (metadata) {
      console.log('✅ Kategori-metadata lastet:', {
        id: metadata.id,
        title: metadata.title
      })
      
      // Test en test
      const testId = 'alternative-tekster'
      const test = await loadTest(categoryId, testId)
      
      if (test) {
        console.log('✅ Test lastet:', {
          id: test.id,
          title: test.title,
          hasWcagRefs: test.wcagRefs.length > 0
        })
      }
    }
    
    console.log('\n🎉 Test fullført!')
    
  } catch (error) {
    console.error('❌ Test feilet:', error)
    process.exit(1)
  }
}

testMarkdownParser()
