import fetch from 'node-fetch'

// Simuler den originale parseren
async function testOriginalParser() {
  console.log('🧪 Tester original parser...')
  const startTime = Date.now()
  
  try {
    // Last konfigurasjon
    const configResponse = await fetch('http://localhost:5174/content/_config.md')
    const configContent = await configResponse.text()
    
    // Last en kategori
    const categoryResponse = await fetch('http://localhost:5174/content/categories/automatic-tools/_index.md')
    const categoryContent = await categoryResponse.text()
    
    // Last noen tester
    const testFiles = ['alternative-tekster', 'input-ledetekster', 'sprak-definert']
    const testPromises = testFiles.map(async (testId) => {
      const response = await fetch(`http://localhost:5174/content/categories/automatic-tools/${testId}.md`)
      return await response.text()
    })
    
    await Promise.all(testPromises)
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log(`✅ Original parser: ${duration}ms`)
    return duration
    
  } catch (error) {
    console.error('❌ Original parser feilet:', error.message)
    return null
  }
}

// Simuler den optimaliserte parseren med caching
async function testOptimizedParser() {
  console.log('🧪 Tester optimalisert parser...')
  const startTime = Date.now()
  
  try {
    // Simuler caching ved å laste samme filer flere ganger
    const files = [
      '/content/_config.md',
      '/content/categories/automatic-tools/_index.md',
      '/content/categories/automatic-tools/alternative-tekster.md',
      '/content/categories/automatic-tools/input-ledetekster.md',
      '/content/categories/automatic-tools/sprak-definert.md'
    ]
    
    // Første runde (ingen cache)
    for (const file of files) {
      const response = await fetch(`http://localhost:5174${file}`)
      await response.text()
    }
    
    // Andre runde (med cache)
    for (const file of files) {
      const response = await fetch(`http://localhost:5174${file}`)
      await response.text()
    }
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log(`✅ Optimalisert parser: ${duration}ms`)
    return duration
    
  } catch (error) {
    console.error('❌ Optimalisert parser feilet:', error.message)
    return null
  }
}

// Test parallell lasting
async function testParallelLoading() {
  console.log('🧪 Tester parallell lasting...')
  const startTime = Date.now()
  
  try {
    const files = [
      '/content/_config.md',
      '/content/categories/automatic-tools/_index.md',
      '/content/categories/keyboard/_index.md',
      '/content/categories/screenreader/_index.md',
      '/content/categories/media/_index.md'
    ]
    
    const promises = files.map(async (file) => {
      const response = await fetch(`http://localhost:5174${file}`)
      return await response.text()
    })
    
    await Promise.all(promises)
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log(`✅ Parallell lasting: ${duration}ms`)
    return duration
    
  } catch (error) {
    console.error('❌ Parallell lasting feilet:', error.message)
    return null
  }
}

// Hovedfunksjon
async function runPerformanceTests() {
  console.log('🚀 Starter ytelsestester...\n')
  
  const results = {
    original: await testOriginalParser(),
    optimized: await testOptimizedParser(),
    parallel: await testParallelLoading()
  }
  
  console.log('\n📊 Ytelsesresultater:')
  console.log(`Original parser: ${results.original}ms`)
  console.log(`Optimalisert parser: ${results.optimized}ms`)
  console.log(`Parallell lasting: ${results.parallel}ms`)
  
  if (results.original && results.optimized) {
    const improvement = ((results.original - results.optimized) / results.original * 100).toFixed(1)
    console.log(`\n🎯 Forbedring: ${improvement}%`)
  }
  
  if (results.parallel) {
    console.log(`⚡ Parallell lasting: ${results.parallel}ms`)
  }
}

runPerformanceTests()
