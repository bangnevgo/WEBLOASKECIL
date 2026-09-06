import assert from 'node:assert/strict'
import test from 'node:test'

const policy = await import('../src/lib/access-tier-policy.mjs').catch(() => ({}))

test('legacy opens Mini Course but not Bootcamp', () => {
  assert.equal(policy.hasProgramAccess?.('legacy', 'MINI_COURSE'), true)
  assert.equal(policy.hasProgramAccess?.('legacy', 'BOOTCAMP'), false)
})

test('premium opens Mini Course but not Bootcamp', () => {
  assert.equal(policy.hasProgramAccess?.('premium', 'MINI_COURSE'), true)
  assert.equal(policy.hasProgramAccess?.('premium', 'BOOTCAMP'), false)
})

test('bootcamp inherits Mini Course and opens Bootcamp', () => {
  assert.equal(policy.hasProgramAccess?.('bootcamp', 'MINI_COURSE'), true)
  assert.equal(policy.hasProgramAccess?.('bootcamp', 'BOOTCAMP'), true)
})

test('master remains a temporary Bootcamp-compatible alias', () => {
  assert.equal(policy.normalizeTier?.('master'), 'bootcamp')
  assert.equal(policy.hasProgramAccess?.('master', 'MINI_COURSE'), true)
  assert.equal(policy.hasProgramAccess?.('master', 'BOOTCAMP'), true)
})

test('grant targets use the official four-tier policy', () => {
  assert.equal(policy.resolveGrantTier?.('MINI_COURSE', 'legacy'), 'legacy')
  assert.equal(policy.resolveGrantTier?.('MINI_COURSE', 'premium'), 'premium')
  assert.equal(policy.resolveGrantTier?.('BOOTCAMP'), 'bootcamp')
  assert.throws(() => policy.resolveGrantTier?.('BOOTCAMP', 'legacy'), /tidak valid/i)
})

test('distribution status is normalized to sent or not_sent', () => {
  assert.equal(policy.normalizeDistributionStatus?.('sent'), 'sent')
  assert.equal(policy.normalizeDistributionStatus?.('anything-else'), 'not_sent')
})
