import { tools } from '../../tools/registry'
import type { SearchEntry } from './search'

export const ENTRIES: readonly SearchEntry[] = [
  ...tools.map(
    (tool): SearchEntry => ({
      id: tool.id,
      title: tool.name,
      description: tool.description,
      group: 'Tools',
      route: tool.route,
      keywords: [tool.category, tool.id],
    }),
  ),
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Home, favorites and recent tools',
    group: 'Pages',
    route: '/',
    keywords: ['home', 'favorites', 'recent'],
  },
  {
    id: 'tools',
    title: 'All tools',
    description: 'The full list of tools',
    group: 'Pages',
    route: '/tools',
    keywords: ['list', 'catalog'],
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Theme, visual effects and recent tools',
    group: 'Pages',
    route: '/settings',
    keywords: ['theme', 'dark', 'light', 'effects', 'appearance', 'privacy'],
  },
  {
    id: 'help',
    title: 'Help',
    description: 'Help center and documentation',
    group: 'Pages',
    route: '/help',
    keywords: ['documentation', 'shortcuts', 'faq', 'support'],
  },
]
