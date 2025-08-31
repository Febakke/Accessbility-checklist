import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@digdir/designsystemet-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ 
          padding: '2rem', 
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h1>Noe gikk galt</h1>
          <p>Det oppstod en uventet feil. Dette kan skje hvis du bruker nettleserens tilbake-knapp.</p>
          <Button onClick={this.handleReset}>
            Gå tilbake til forsiden
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
