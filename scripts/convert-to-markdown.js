import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Enkel frontmatter-stringifier som fungerer i Node.js
function stringifyFrontmatter(data, content) {
  const frontmatterLines = []
  
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      // Håndter arrays (som wcagRefs)
      frontmatterLines.push(`${key}:`)
      for (const item of value) {
        frontmatterLines.push(`  - id: ${item.id}`)
        frontmatterLines.push(`    title: ${item.title}`)
        frontmatterLines.push(`    url: '${item.url}'`)
      }
    } else {
      // Håndter enkle verdier
      frontmatterLines.push(`${key}: ${typeof value === 'string' && value.includes(' ') ? `'${value}'` : value}`)
    }
  }
  
  return `---\n${frontmatterLines.join('\n')}\n---\n\n${content}`
}

// Les JSON-filen
const jsonData = JSON.parse(fs.readFileSync('data/checklists.json', 'utf8'))

// Funksjon for å konvertere WCAG-referanser til frontmatter-format
function convertWcagRefs(wcagRefs) {
  if (!wcagRefs || wcagRefs.length === 0) return []
  
  return wcagRefs.map(ref => ({
    id: ref.id,
    title: ref.title,
    url: ref.url
  }))
}

// Funksjon for å generere Markdown-innhold for en test
function generateTestMarkdown(item) {
  let content = `# ${item.title}\n\n`
  
  if (item.description) {
    content += `${item.description}\n\n`
  }
  
  if (item.howTo && item.howTo.trim()) {
    content += `## Hvordan teste\n\n${item.howTo}\n\n`
  }
  
  return content
}

// Funksjon for å opprette test-fil
function createTestFile(categoryId, item) {
  const categoryPath = path.join('content', 'categories', categoryId)
  const fileName = `${item.id}.md`
  const filePath = path.join(categoryPath, fileName)
  
  const frontmatter = {
    id: item.id,
    title: item.title,
    description: item.description,
    order: 1 // Dette kan justeres senere
  }
  
  if (item.wcagRefs && item.wcagRefs.length > 0) {
    frontmatter.wcagRefs = convertWcagRefs(item.wcagRefs)
  }
  
  const content = generateTestMarkdown(item)
  const markdownContent = stringifyFrontmatter(frontmatter, content)
  
  fs.writeFileSync(filePath, markdownContent)
  console.log(`✅ Opprettet: ${filePath}`)
}

// Hovedfunksjon for konvertering
function convertToMarkdown() {
  console.log('🚀 Starter konvertering fra JSON til Markdown...\n')
  
  // Konverter hver kategori
  jsonData.categories.forEach((category, categoryIndex) => {
    console.log(`📁 Kategori: ${category.title}`)
    
    // Opprett test-filer for hver kategori
    category.items.forEach((item, itemIndex) => {
      createTestFile(category.id, item)
    })
    
    console.log(`✅ ${category.items.length} tester konvertert for ${category.title}\n`)
  })
  
  console.log('🎉 Konvertering fullført!')
  console.log(`📊 Totalt: ${jsonData.categories.reduce((sum, cat) => sum + cat.items.length, 0)} tester konvertert`)
}

// Kjør konverteringen
convertToMarkdown()
