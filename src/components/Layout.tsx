import { Info, LayoutDashboard, Menu, PanelLeftClose, PanelLeftOpen, Settings, ShieldCheck, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router'

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
  onNavigate?: () => void
  onToggleCollapse?: () => void
}

function SidebarContent({ collapsed, onNavigate, onToggleCollapse }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <p className="flex items-center gap-2 px-3 pt-2 text-lg font-bold tracking-tight">
        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent2 shadow-[0_0_12px_var(--accent2)]" />
        <span className={collapsed ? 'sr-only' : ''}>DEVKIT</span>
      </p>
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

  useEffect(() => {
    if (!drawerOpen) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div className="flex min-h-screen text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <aside
        className={`hidden shrink-0 p-3 transition-[width] duration-200 md:sticky md:top-0 md:block md:h-screen ${collapsed ? 'w-24' : 'w-72'}`}
      >
        <div className="glass h-full rounded-2xl">
          <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
        </div>
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button type="button" aria-label="Close menu" onClick={closeDrawer} className="absolute inset-0 bg-black/60" />
          <aside className="glass relative h-full w-72 max-w-[85vw] rounded-r-2xl">
            <SidebarContent collapsed={false} onNavigate={closeDrawer} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-3 z-30 mx-3 mt-3 flex items-center gap-2 rounded-full py-1 pl-1 pr-4 md:hidden">
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
        </header>
        <main id="main" tabIndex={-1} className="flex-1 px-4 py-6 sm:px-8">
          <Suspense fallback={<p role="status" className="text-sm text-muted">Loading...</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
