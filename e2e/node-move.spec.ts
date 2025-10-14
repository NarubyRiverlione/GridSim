/**
 * E2E test for moving a node in GridSim
 */

import { test, expect } from '@playwright/test'

test.describe('Node Move', () => {
  test('should drag a substation node to a new position', async ({ page }) => {
    await page.goto('/?mockdata=e2e')
    await page.waitForSelector('.substation-node', { timeout: 5000 })

    // Get initial position of the node
    const node = page.locator('[data-id="substation-G1"]')
    const initialBox = await node.boundingBox()
    expect(initialBox).toBeTruthy()

    // Drag the node by 50px right and 50px down
    if (initialBox) {
      await page.mouse.move(initialBox.x + initialBox.width / 2, initialBox.y + initialBox.height / 2)
      await page.mouse.down()
      await page.mouse.move(initialBox.x + initialBox.width / 2 + 50, initialBox.y + initialBox.height / 2 + 50, {
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

    // Wait longer to allow persistence to be applied
    await page.waitForTimeout(1000)
    const finalBox = await node.boundingBox()
    expect(finalBox).toBeTruthy()
    if (initialBox && finalBox) {
      const dx = finalBox.x - initialBox.x
      const dy = finalBox.y - initialBox.y
      // Expect the node to have moved approximately by the drag delta (100, 50)
      // allow a larger tolerance due to grid snapping and UI offsets
      expect(Math.abs(dx - 50)).toBeLessThan(25)
      expect(Math.abs(dy - 50)).toBeLessThan(25)
    }
  })
})
