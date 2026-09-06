export const OFFICIAL_TIERS = ['free', 'legacy', 'premium', 'bootcamp']

const TIER_RANK = {
  free: 0,
  legacy: 1,
  premium: 2,
  bootcamp: 3,
}

export function normalizeTier(value) {
  const tier = String(value || 'free').trim().toLowerCase()
  if (tier === 'master') return 'bootcamp'
  return OFFICIAL_TIERS.includes(tier) ? tier : 'free'
}

export function tierRank(value) {
  return TIER_RANK[normalizeTier(value)]
}

export function hasProgramAccess(tier, program) {
  const normalizedTier = normalizeTier(tier)
  const normalizedProgram = String(program || '').trim().toUpperCase()
  if (normalizedProgram === 'MINI_COURSE') {
    return ['legacy', 'premium', 'bootcamp'].includes(normalizedTier)
  }
  if (normalizedProgram === 'BOOTCAMP') return normalizedTier === 'bootcamp'
  return false
}

export function resolveGrantTier(program, requestedTier) {
  const normalizedProgram = String(program || '').trim().toUpperCase()
  if (normalizedProgram === 'BOOTCAMP') {
    if (requestedTier && normalizeTier(requestedTier) !== 'bootcamp') {
      throw new Error('Tier Bootcamp tidak valid.')
    }
    return 'bootcamp'
  }
  if (normalizedProgram === 'MINI_COURSE') {
    const tier = normalizeTier(requestedTier || 'premium')
    if (!['legacy', 'premium'].includes(tier)) {
      throw new Error('Tier Mini Course tidak valid.')
    }
    return tier
  }
  throw new Error('Program tidak valid.')
}

export function normalizeDistributionStatus(value) {
  return String(value || '').trim().toLowerCase() === 'sent' ? 'sent' : 'not_sent'
}
