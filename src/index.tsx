import App from '@/app'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
