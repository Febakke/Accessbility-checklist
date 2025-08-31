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
import CategoryOverviewPage from './pages/CategoryOverviewPage'
import CategoryPage from './pages/CategoryPage'
import SummaryPage from './pages/SummaryPage'
import TestPage from './pages/TestPage'

function App() {
  useEffect(() => {
    document.body.setAttribute('data-color-scheme', 'auto')
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
          <Route path="/overview" element={<CategoryOverviewPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 