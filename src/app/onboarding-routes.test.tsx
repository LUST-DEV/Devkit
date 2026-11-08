import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { OnboardingProvider } from '../features/onboarding/OnboardingProvider'
import { App } from './App'

function renderAt(path: string) {
  return render(
    <OnboardingProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </OnboardingProvider>,
  )
}

describe('restarting the onboarding', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem('devkit.introSeen', 'true')
    window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'done', step: 0 }))
  })

  it('does not show anything to a visitor who has already seen it', async () => {
    renderAt('/help')
    await screen.findByRole('heading', { name: 'Help' })
    expect(screen.queryByRole('dialog', { name: 'Guided tour' })).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Welcome to DEVKIT' })).not.toBeInTheDocument()
  })

  it('restarts the guided tour from the Help page', async () => {
    renderAt('/help')
    fireEvent.click(await screen.findByRole('button', { name: 'Start the guided tour' }))
    expect(screen.getByRole('dialog', { name: 'Guided tour' })).toBeInTheDocument()
    expect(screen.getByText(/Step 1 of/)).toBeInTheDocument()
  })

  it('restarts the guided tour from Settings', async () => {
    renderAt('/settings')
    fireEvent.click(await screen.findByRole('button', { name: 'Restart the guided tour' }))
    expect(screen.getByRole('dialog', { name: 'Guided tour' })).toBeInTheDocument()
  })

  it('replays the intro from Settings', async () => {
    renderAt('/settings')
    fireEvent.click(await screen.findByRole('button', { name: 'Replay the intro' }))
    expect(screen.getByRole('dialog', { name: 'Welcome to DEVKIT' })).toBeInTheDocument()
  })
})
