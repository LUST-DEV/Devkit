import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import { Route, Routes } from 'react-router'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Layout } from '../components/Layout'
import { ThemeProvider } from '../features/theme/ThemeProvider'
import { tools } from '../tools/registry'

const HomePage = lazy(() => import('../pages/HomePage').then((module) => ({ default: module.HomePage })))
const ToolsPage = lazy(() => import('../pages/ToolsPage').then((module) => ({ default: module.ToolsPage })))
const ToolPlaceholderPage = lazy(() =>
  import('../pages/ToolPlaceholderPage').then((module) => ({ default: module.ToolPlaceholderPage })),
)
const HelpPage = lazy(() => import('../pages/HelpPage').then((module) => ({ default: module.HelpPage })))
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const Base64Page = lazy(() => import('../tools/base64/Base64Page').then((module) => ({ default: module.Base64Page })))

// Implemented tools, keyed by their registry id. Tools without an entry show the placeholder page.
const toolPages: Partial<Record<string, LazyExoticComponent<ComponentType>>> = {
  base64: Base64Page,
}

export function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tools" element={<ToolsPage />} />
            {tools.map((tool) => {
              const ToolPage = toolPages[tool.id]
              return (
                <Route
                  key={tool.id}
                  path={`tools/${tool.id}`}
                  element={ToolPage ? <ToolPage /> : <ToolPlaceholderPage tool={tool} />}
                />
              )
            })}
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
