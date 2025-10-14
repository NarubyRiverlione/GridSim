import { checkBoundingBoxOverlap, checkCollision } from './placement'

import type { Component } from '@/types'

const makeComponent = (id: string, x: number, y: number): Component =>
  ({
    id,
    location: { x, y },
  }) as unknown as Component

test('bounding boxes overlap when close', () => {
  expect(checkBoundingBoxOverlap(100, 100, 80, 120, 120, 80)).toBe(true)
})

test('bounding boxes do not overlap when far', () => {
  expect(checkBoundingBoxOverlap(0, 0, 50, 200, 200, 50)).toBe(false)
})

test('collision detects existing component', () => {
  const existing = [makeComponent('a', 100, 100)]
  // checkCollision signature: x, y, componentSize, existingComponents, excludeId?
  expect(checkCollision(100, 100, 80, existing)).toBe(true)
})

test('collision ignores excluded id', () => {
  const existing = [makeComponent('a', 100, 100)]
  expect(checkCollision(100, 100, 80, existing, 'a')).toBe(false)
})
