import { test, expect } from '@playwright/test'

test.describe('Collision Detection', () => {
  test('should block placement on occupied cell and block overlapping drag', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Count initial nodes
    const initialCount = await page.locator('.react-flow__node').count()

    // Switch to power plant placement mode
    await page.locator('button:has-text("Power Plant")').click()

    // Move over a location where a node already exists (target Berlin city node)
    const firstNode = page.locator('.node-title:has-text("Berlin")').first()
    const box = await firstNode.boundingBox()
    expect(box).toBeTruthy()
    if (box) {
      const canvas = page.locator('.react-flow__pane')
      const canvasBox = await canvas.boundingBox()
      if (canvasBox) {
        const clientX = box.x + box.width / 2
        const clientY = box.y + box.height / 2
        // Move actual mouse (client coords) to trigger GridCanvas mouse handlers and ghost preview
        await page.mouse.move(clientX, clientY)
        // Move mouse to trigger preview then click (hard block enforced in app)
        await page.waitForTimeout(100)
        await page.mouse.click(clientX, clientY)
      }
    }

    // Wait for UI
    await page.waitForTimeout(500)

    // Node count should not increase OR an error toast should be shown
    const afterAttempt = await page.locator('.react-flow__node').count()
    const toastVisible = await page
      .locator('.error-toast')
      .isVisible()
      .catch(() => false)
    if (!toastVisible) {
      expect(afterAttempt).toBe(initialCount)
    }

    // Now test drag overlapping: drag second node on top of first
    const node1 = page.locator('.react-flow__node').first()
    const node2 = page.locator('.react-flow__node').nth(1)
    const box1 = await node1.boundingBox()
    const box2 = await node2.boundingBox()
    expect(box1).toBeTruthy()
    expect(box2).toBeTruthy()

    if (box1 && box2) {
      // Drag node2 to node1's center
      await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2)
      await page.mouse.down()
      await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2, { steps: 10 })
      await page.mouse.up()
    }

    // Wait for UI update
    await page.waitForTimeout(500)

    // Check for error toast message
    const toast = page.locator('.error-toast')
    await expect(toast).toBeVisible()
    await expect(toast).toContainText('Placement blocked')
  })
})
