import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Funksjon for å kopiere en mappe rekursivt
function copyDirectory(source, destination) {
  // Opprett destinasjonsmappen hvis den ikke eksisterer
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true })
  }

  // Les alle filer og mapper i kilde-mappen
  const items = fs.readdirSync(source)

  for (const item of items) {
    const sourcePath = path.join(source, item)
    const destPath = path.join(destination, item)

    const stat = fs.statSync(sourcePath)

    if (stat.isDirectory()) {
      // Kopier mappe rekursivt
      copyDirectory(sourcePath, destPath)
    } else {
      // Kopier fil
      fs.copyFileSync(sourcePath, destPath)
    }
  }
}

// Hovedfunksjon
function buildContent() {
  console.log('🚀 Starter build av content...')
  
  const sourceDir = path.join(__dirname, '..', 'content')
  const destDir = path.join(__dirname, '..', 'public', 'content')
  
  try {
    // Slett eksisterende content i public
    if (fs.existsSync(destDir)) {
      fs.rmSync(destDir, { recursive: true, force: true })
    }
    
    // Kopier content til public
    copyDirectory(sourceDir, destDir)
    
    console.log('✅ Content bygget og kopiert til public/content/')
  } catch (error) {
    console.error('❌ Feil ved bygging av content:', error)
    process.exit(1)
  }
}

// Kjør hvis scriptet kjøres direkte
buildContent()
