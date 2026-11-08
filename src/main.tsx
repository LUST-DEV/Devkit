import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './app/App'
import { OnboardingProvider } from './features/onboarding/OnboardingProvider'
import { ToolHistoryProvider } from './features/toolHistory/ToolHistoryProvider'
import './styles/index.css'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element #root not found')
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <ToolHistoryProvider>
        <OnboardingProvider>
          <App />
        </OnboardingProvider>
      </ToolHistoryProvider>
    </BrowserRouter>
  </StrictMode>,
)
