/**
 * Placement utilities for component positioning and collision detection
 */

import type { Component } from '@/types'
import { getComponentSize as getComponentSizeUtil } from '@/utils/componentUtils'

export const GRID_SIZE = 50

/**
 * Snaps a coordinate to the nearest grid position
 */
export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

/**
 * Snaps a point to the nearest grid intersection
 */
export const snapPointToGrid = (x: number, y: number): { x: number; y: number } => {
  return {
    x: snapToGrid(x),
    y: snapToGrid(y),
  }
}

/**
 * Gets the bounding box size for a component
 * Re-export from componentUtils for backward compatibility
 */
export const getComponentSize = getComponentSizeUtil

/**
 * Checks if two bounding boxes overlap
 */
export const checkBoundingBoxOverlap = (
  x1: number,
  y1: number,
  size1: number,
  x2: number,
  y2: number,
  size2: number,
  buffer = 0
): boolean => {
  const halfSize1 = size1 / 2 + buffer
  const halfSize2 = size2 / 2 + buffer

  return (
    x1 - halfSize1 < x2 + halfSize2 &&
    x1 + halfSize1 > x2 - halfSize2 &&
    y1 - halfSize1 < y2 + halfSize2 &&
    y1 + halfSize1 > y2 - halfSize2
  )
}

/**
 * Checks if a position would collide with any existing components
 */
export const checkCollision = (
  x: number,
  y: number,
  componentSize: number,
  existingComponents: Component[],
  excludeId?: string,
  buffer = 0
): boolean => {
  return existingComponents.some(existing => {
    if (excludeId !== undefined && existing.id === excludeId) {
      return false
    }

    const existingSize = getComponentSize(existing)
    return checkBoundingBoxOverlap(x, y, componentSize, existing.location.x, existing.location.y, existingSize, buffer)
  })
}

/**
 * Validates if a placement is valid (no collision)
 */
export const isValidPlacement = (
  x: number,
  y: number,
  componentSize: number,
  existingComponents: Component[],
  buffer = 0
): boolean => {
  return !checkCollision(x, y, componentSize, existingComponents, undefined, buffer)
}
