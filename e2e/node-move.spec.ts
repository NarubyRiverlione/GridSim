/**
 * E2E test for moving a node in GridSim
 */

import { test, expect } from '@playwright/test'

test.describe('Node Move', () => {
  test('should drag a power plant node to a new position', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.plant-node', { timeout: 5000 })

    // Get initial position of the node
    const node = page.locator('.plant-node').first()
    const initialBox = await node.boundingBox()
    expect(initialBox).toBeTruthy()

    // Drag the node by 100px right and 50px down
    if (initialBox) {
      await page.mouse.move(initialBox.x + initialBox.width / 2, initialBox.y + initialBox.height / 2)
      await page.mouse.down()
      await page.mouse.move(initialBox.x + initialBox.width / 2 + 100, initialBox.y + initialBox.height / 2 + 50, {
        steps: 10,
      })
      await page.mouse.up()
    }

    // Wait for UI to update
    await page.waitForTimeout(500)

    // Get new position (immediately after drag)
    const newBox = await node.boundingBox()
    expect(newBox).toBeTruthy()
    if (initialBox && newBox) {
      expect(newBox.x).toBeGreaterThan(initialBox.x)
      expect(newBox.y).toBeGreaterThan(initialBox.y)
    }

    // Wait longer to allow snap-back
    await page.waitForTimeout(1000)
    const finalBox = await node.boundingBox()
    expect(finalBox).toBeTruthy()
    if (initialBox && finalBox) {
      expect(Math.abs(finalBox.x - initialBox.x)).toBeLessThan(2)
      expect(Math.abs(finalBox.y - initialBox.y)).toBeLessThan(2)
    }
  })
})
