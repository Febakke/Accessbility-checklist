import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Design system imports
import '@digdir/designsystemet-css'
import '../design-tokens-build/theme.css'
import '../design-tokens-build/theme/semantic.css'

// Font imports
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'

// Our styles
import './index.css'

import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'

function App() {
  useEffect(() => {
    document.body.setAttribute('data-color-scheme', 'dark')
    document.body.setAttribute('data-typography', 'primary')
    document.body.setAttribute('data-color', 'neutral')

    return () => {
      document.body.removeAttribute('data-color-scheme')
      document.body.removeAttribute('data-typography')
      document.body.removeAttribute('data-color')
    }
  }, [])

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 