import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from '../app/App'
import { I18nProvider } from './I18nProvider'

function setBrowserLanguages(languages: string[]) {
  Object.defineProperty(window.navigator, 'languages', { value: languages, configurable: true })
}

function renderAt(path: string) {
  return render(
    <I18nProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </I18nProvider>,
  )
}

describe('language', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    Reflect.deleteProperty(window.navigator, 'languages')
    document.documentElement.lang = ''
  })

  it('follows the browser language', async () => {
    setBrowserLanguages(['fr-FR', 'en'])
    renderAt('/tools')
    expect(await screen.findByRole('heading', { name: 'Outils', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Formateur et validateur JSON')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('fr')
  })

  it('falls back to English when the browser language is not supported', async () => {
    setBrowserLanguages(['de-DE'])
    renderAt('/tools')
    expect(await screen.findByRole('heading', { name: 'Tools', level: 1 })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
  })

  it('prefers the language the user chose over the browser language', async () => {
    setBrowserLanguages(['fr-FR'])
    window.localStorage.setItem('devkit.locale', 'es')
    renderAt('/tools')
    expect(await screen.findByRole('heading', { name: 'Herramientas', level: 1 })).toBeInTheDocument()
  })

  it('ignores a stored language that is not supported', async () => {
    setBrowserLanguages(['en-US'])
    window.localStorage.setItem('devkit.locale', 'xx')
    renderAt('/tools')
    expect(await screen.findByRole('heading', { name: 'Tools', level: 1 })).toBeInTheDocument()
  })

  it('lets the user change the language in Settings and remembers it', async () => {
    setBrowserLanguages(['en-US'])
    renderAt('/settings')
    fireEvent.click(await screen.findByRole('radio', { name: 'Fran\u00e7ais' }))
    expect(await screen.findByRole('heading', { name: 'R\u00e9glages', level: 1 })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('fr')
    expect(window.localStorage.getItem('devkit.locale')).toBe('fr')
    fireEvent.click(screen.getByRole('radio', { name: 'Espa\u00f1ol' }))
    expect(await screen.findByRole('heading', { name: 'Ajustes', level: 1 })).toBeInTheDocument()
  })

  it('translates the navigation, the dashboard and the search', async () => {
    setBrowserLanguages(['es-ES'])
    renderAt('/')
    expect(await screen.findByRole('heading', { name: 'DEVKIT' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Herramientas' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('list', { name: 'Cifras clave' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Acceso r\u00e1pido' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog', { name: 'Paleta de comandos' })).toBeInTheDocument()
  })

  it('translates the title of a tool page', async () => {
    setBrowserLanguages(['fr-FR'])
    renderAt('/tools/uuid')
    expect(await screen.findByRole('heading', { name: "G\u00e9n\u00e9rateur d'UUID" })).toBeInTheDocument()
  })

  it('translates the 404 page', async () => {
    setBrowserLanguages(['es-ES'])
    renderAt('/nope')
    expect(await screen.findByRole('heading', { name: 'P\u00e1gina no encontrada' })).toBeInTheDocument()
  })
})
