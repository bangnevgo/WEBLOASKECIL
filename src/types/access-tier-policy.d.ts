declare module '@/lib/access-tier-policy.mjs' {
  export type OfficialTier = 'free' | 'legacy' | 'premium' | 'bootcamp'
  export function normalizeTier(value: unknown): OfficialTier
  export function tierRank(value: unknown): number
  export function hasProgramAccess(tier: unknown, program: unknown): boolean
  export function resolveGrantTier(program: unknown, requestedTier?: unknown): OfficialTier
  export function normalizeDistributionStatus(value: unknown): 'sent' | 'not_sent'
}
