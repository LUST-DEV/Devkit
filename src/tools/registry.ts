import { Binary, Braces, Clock, Fingerprint, Hash, KeyRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ToolCategory = 'Data' | 'Encoding' | 'Security' | 'Time'
export type ToolAvailability = 'available' | 'planned'

export interface ToolDefinition {
  id: string
  name: string
  description: string
  category: ToolCategory
  icon: LucideIcon
  route: string
  availability: ToolAvailability
}

export const tools: readonly ToolDefinition[] = [
  {
    id: 'json',
    name: 'JSON Formatter & Validator',
    description: 'Format and validate JSON with readable errors.',
    category: 'Data',
    icon: Braces,
    route: '/tools/json',
    availability: 'planned',
  },
  {
    id: 'base64',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode and decode Base64, including Unicode text.',
    category: 'Encoding',
    icon: Binary,
    route: '/tools/base64',
    availability: 'available',
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Generate UUIDs with a cryptographically secure source.',
    category: 'Data',
    icon: Fingerprint,
    route: '/tools/uuid',
    availability: 'available',
  },
  {
    id: 'jwt',
    name: 'JWT Decoder',
    description: 'Inspect a JWT header and payload. Does not verify signatures.',
    category: 'Security',
    icon: KeyRound,
    route: '/tools/jwt',
    availability: 'planned',
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert between timestamps and dates, UTC and time zones.',
    category: 'Time',
    icon: Clock,
    route: '/tools/timestamp',
    availability: 'planned',
  },
  {
    id: 'hash',
    name: 'Hash Generator',
    description: 'Compute SHA-256, SHA-384 and SHA-512 hashes.',
    category: 'Security',
    icon: Hash,
    route: '/tools/hash',
    availability: 'available',
  },
]

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.id === id)
}
