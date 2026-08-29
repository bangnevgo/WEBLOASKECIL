import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const landing = readFileSync(new URL('../src/components/landing.tsx', import.meta.url), 'utf8')
const section = readFileSync(new URL('../src/components/mini-course-section.tsx', import.meta.url), 'utf8')

test('mini course section appears before cohort', () => {
  assert.ok(landing.indexOf('<MiniCourseSection />') > -1)
  assert.ok(landing.indexOf('<MiniCourseSection />') < landing.indexOf('id="cohort"'))
})

test('LOAS exposes exactly two tracked Mini Course placements', () => {
  const source = `${landing}\n${section}`
  assert.equal((source.match(/https:\/\/course\.nevgoinstitute\.com\//g) ?? []).length, 2)
  assert.match(source, /data-cta-id="mini-course-loas-home-section"/)
  assert.match(source, /data-cta-id="mini-course-loas-footer"/)
})

test('section retains the interactive Cohort alternative', () => {
  assert.match(section, /https:\/\/cohort\.nevgoinstitute\.com/)
  assert.match(section, /Butuh feedback langsung\? Lihat Cohort/)
})
