import { Info, LayoutDashboard, Menu, PanelLeftClose, PanelLeftOpen, Search, Settings, ShieldCheck, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { CommandPalette } from '../features/search/CommandPalette'
import { useToolHistory } from '../features/toolHistory/ToolHistoryProvider'
import { getToolById } from '../tools/registry'
import { PageSkeleton } from './PageSkeleton'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const navItems: readonly NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/help', label: 'Help', icon: Info },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function linkClass({ isActive }: { isActive: boolean }) {
  const base = 'flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors'
  return `${base} ${isActive ? 'bg-accent text-white shadow-[0_0_18px_-4px_var(--accent)]' : 'text-muted hover:bg-edge hover:text-fg'}`
}

interface SidebarContentProps {
  collapsed: boolean
  onOpenSearch: () => void
  onNavigate?: () => void
  onToggleCollapse?: () => void
}

function SidebarContent({ collapsed, onOpenSearch, onNavigate, onToggleCollapse }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <p className="flex items-center gap-2 px-3 pt-2 text-lg font-bold tracking-tight">
        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent2 shadow-[0_0_12px_var(--accent2)]" />
        <span className={collapsed ? 'sr-only' : ''}>DEVKIT</span>
      </p>
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex min-h-11 items-center gap-3 rounded-xl border border-edge px-3 py-2 text-sm text-muted transition-colors hover:bg-edge hover:text-fg"
      >
        <Search aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span className={collapsed ? 'sr-only' : 'flex-1 text-left'}>Search</span>
        {!collapsed && <kbd className="rounded-md border border-edge px-1.5 py-0.5 text-xs">Ctrl K</kbd>}
      </button>
      <nav aria-label="Main" className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass} onClick={onNavigate} title={collapsed ? item.label : undefined}>
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                  <span className={collapsed ? 'sr-only' : ''}>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
      <p className="flex items-center gap-2 px-3 text-xs text-muted">
        <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-accent2" />
        <span className={collapsed ? 'sr-only' : ''}>Local only. Nothing leaves your browser.</span>
      </p>
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-edge hover:text-fg"
        >
          {collapsed ? <PanelLeftOpen aria-hidden="true" className="h-5 w-5" /> : <PanelLeftClose aria-hidden="true" className="h-5 w-5" />}
          <span className={collapsed ? 'sr-only' : ''}>Collapse</span>
        </button>
      )}
    </div>
  )
}

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const location = useLocation()
  const { recordVisit } = useToolHistory()
  const mainRef = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)

  // Lock the page scroll behind the drawer and close it with Escape.
  useEffect(() => {
    if (!drawerOpen) {
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [drawerOpen])

  // Ctrl+K (Cmd+K on macOS) opens or closes the command palette.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Move focus to the content after a navigation so keyboard and screen reader users land on the new page.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    mainRef.current?.focus({ preventScroll: true })
  }, [location.pathname])

  // Remember which tool was opened (the tool name only, never its content).
  useEffect(() => {
    const match = /^\/tools\/([^/]+)\/?$/.exec(location.pathname)
    if (match && getToolById(match[1])) {
      recordVisit(match[1])
    }
  }, [location.pathname, recordVisit])

  const closeDrawer = () => setDrawerOpen(false)
  const openSearch = () => setPaletteOpen(true)

  return (
    <div className="flex min-h-dvh text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <aside
        className={`hidden shrink-0 p-3 transition-[width] duration-200 md:sticky md:top-0 md:block md:h-dvh ${collapsed ? 'w-24' : 'w-72'}`}
      >
        <div className="glass h-full rounded-2xl">
          <SidebarContent collapsed={collapsed} onOpenSearch={openSearch} onToggleCollapse={() => setCollapsed((value) => !value)} />
        </div>
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 overscroll-contain md:hidden">
          <button type="button" aria-label="Close menu" onClick={closeDrawer} className="absolute inset-0 bg-black/60" />
          <aside className="glass drawer-enter relative h-full w-72 max-w-[85vw] overflow-y-auto overscroll-contain rounded-r-2xl">
            <SidebarContent
              collapsed={false}
              onNavigate={closeDrawer}
              onOpenSearch={() => {
                closeDrawer()
                openSearch()
              }}
            />
          </aside>
        </div>
      )}

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-[max(0.75rem,env(safe-area-inset-top))] z-30 mx-3 mt-3 flex items-center gap-2 rounded-full py-1 pl-1 pr-1 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-edge"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
          <span className="font-semibold">DEVKIT</span>
          <button
            type="button"
            aria-label="Open search"
            onClick={openSearch}
            className="ml-auto grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-edge"
          >
            <Search aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>
        <main
          id="main"
          ref={mainRef}
          tabIndex={-1}
          className="flex-1 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] outline-none sm:px-8"
        >
          <Suspense fallback={<PageSkeleton />}>
            <div key={location.pathname} className="page-enter">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  )
}
