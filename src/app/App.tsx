import { lazy } from 'react'
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

export function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tools" element={<ToolsPage />} />
            {tools.map((tool) => (
              <Route key={tool.id} path={`tools/${tool.id}`} element={<ToolPlaceholderPage tool={tool} />} />
            ))}
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
