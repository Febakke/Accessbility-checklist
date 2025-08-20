import fetch from 'node-fetch'

// Test at alle viktige Markdown-filer kan lastes
async function testMarkdownFiles() {
  console.log('🧪 Tester Markdown-filer i nettleseren...')
  
  const baseUrl = 'http://localhost:5174'
  const filesToTest = [
    '/content/_config.md',
    '/content/categories/automatic-tools/_index.md',
    '/content/categories/automatic-tools/alternative-tekster.md',
    '/content/categories/keyboard/_index.md',
    '/content/categories/keyboard/tastatur-funksjonalitet.md'
  ]
  
  let successCount = 0
  let errorCount = 0
  
  for (const file of filesToTest) {
    try {
      const response = await fetch(`${baseUrl}${file}`)
      if (response.ok) {
        const content = await response.text()
        if (content.includes('---') && content.includes('title:')) {
          console.log(`✅ ${file} - Lastet og har frontmatter`)
          successCount++
        } else {
          console.log(`⚠️  ${file} - Lastet men mangler frontmatter`)
          errorCount++
        }
      } else {
        console.log(`❌ ${file} - HTTP ${response.status}`)
        errorCount++
      }
    } catch (error) {
      console.log(`❌ ${file} - Feil: ${error.message}`)
      errorCount++
    }
  }
  
  console.log(`\n📊 Resultat: ${successCount} suksess, ${errorCount} feil`)
  
  if (errorCount === 0) {
    console.log('🎉 Alle Markdown-filer fungerer!')
  } else {
    console.log('⚠️  Noen filer har problemer')
  }
}

// Test at React-appen fungerer
async function testReactApp() {
  console.log('\n🧪 Tester React-applikasjon...')
  
  try {
    const response = await fetch('http://localhost:5174/')
    const html = await response.text()
    
    if (html.includes('Tilgjengelighetstester') && html.includes('react')) {
      console.log('✅ React-applikasjon fungerer')
    } else {
      console.log('❌ React-applikasjon har problemer')
    }
  } catch (error) {
    console.log(`❌ React-applikasjon: ${error.message}`)
  }
}

// Hovedfunksjon
async function runTests() {
  await testMarkdownFiles()
  await testReactApp()
}

runTests()
