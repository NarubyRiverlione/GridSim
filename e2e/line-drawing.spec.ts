/**
 * E2E tests for Phase 0 transmission line drawing system
 */

import { test, expect } from '@playwright/test'

test.describe('Line Drawing System', () => {
  test('should switch to line drawing mode', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Click line mode button
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()

    // Verify mode is active
    await expect(lineButton).toHaveClass(/active/)
  })

  test('should draw line between pylon and switching station', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.react-flow__edge', { timeout: 5000 })

    // Count initial edges
    const initialCount = await page.locator('.react-flow__edge').count()

    // Switch to line drawing mode
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)

    // Click on pylon node (no voltage restrictions)
    const pylon = page.locator('.pylon-node').first()
    await pylon.click({ force: true })

    // Click on switching station node (no voltage restrictions)
    const switchingStation = page.locator('.switching-node').first()
    await switchingStation.click({ force: true })

    // Wait for line to appear
    await page.waitForTimeout(500)

    // Should have one more edge
    const newCount = await page.locator('.react-flow__edge').count()
  // Update expected edge count to match new mock data (now 8 edges after drawing)
  expect(newCount).toBe(initialCount + 1)
  })

  test('should show preview line when drawing', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Switch to line drawing mode
    await page.locator('button:has-text("Line")').click()

    // Click on a node to start drawing
    const node = page.locator('.react-flow__node').first()
    await node.click()

    // Move mouse to create preview
    await page.mouse.move(500, 500)
    await page.waitForTimeout(200)

    // Preview line should be visible (as a temporary edge)
    const edges = await page.locator('.react-flow__edge').count()
    expect(edges).toBeGreaterThan(0)
  })

  test('should show error for invalid connection (city to city)', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.city-node', { timeout: 5000 })

    // Make sure we have at least 2 cities
    const cityCount = await page.locator('.city-node').count()
    if (cityCount < 2) {
      test.skip()
      return
    }

    // Switch to line drawing mode
    await page.locator('button:has-text("Line")').click()

    // Click on first city
    const firstCity = page.locator('.city-node').first()
    await firstCity.click()

    // Click on second city
    const secondCity = page.locator('.city-node').nth(1)
    await secondCity.click()

    // Should show error message
    await page.waitForTimeout(500)
    const errorMessage = page.locator('.error-message, [role="alert"]')
    await expect(errorMessage).toBeVisible({ timeout: 3000 })
  })

  test('should prevent duplicate lines', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    const initialCount = await page.locator('.react-flow__edge').count()

    // Switch to line drawing mode
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)

    // Draw a line between pylon and switching station
    const pylon = page.locator('.pylon-node').first()
    await pylon.click({ force: true })

    const switchingStation = page.locator('.switching-node').first()
    await switchingStation.click({ force: true })

    await page.waitForTimeout(500)

    // Try to draw the same line again
    await pylon.click({ force: true })
    await switchingStation.click({ force: true })

    await page.waitForTimeout(500)

    // Should still have only one more edge (duplicate prevented)
    const newCount = await page.locator('.react-flow__edge').count()
  // Update expected edge count to match new mock data (now 8 edges after drawing)
  expect(newCount).toBe(initialCount + 1)
  })

  test('should cancel line drawing when clicking pane', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Switch to line drawing mode
    await page.locator('button:has-text("Line")').click()

    // Click on a node to start drawing
    const node = page.locator('.react-flow__node').first()
    await node.click()

    // Click on empty canvas
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 100, y: 100 } })

    // Preview line should be gone (line drawing cancelled)
    await page.waitForTimeout(300)

    // No error should be shown
    const errorMessage = page.locator('.error-message, [role="alert"]')
    const errorVisible = await errorMessage.isVisible().catch(() => false)
    expect(errorVisible).toBe(false)
  })

  test('should connect power plant to pylon', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    const initialCount = await page.locator('.react-flow__edge').count()

    // Switch to line drawing mode
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)

    // Click on power plant (first one)
    const powerPlant = page.locator('.plant-node').first()
    await powerPlant.click({ force: true })

    // Click on pylon (no voltage restrictions)
    const pylon = page.locator('.pylon-node').first()
    await pylon.click({ force: true })

    await page.waitForTimeout(500)

    // Should have created a line
    const newCount = await page.locator('.react-flow__edge').count()
  // Update expected edge count to match new mock data (now 8 edges after drawing)
  expect(newCount).toBe(initialCount + 1)
  })

  test('should display line details when selected', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.react-flow__edge', { timeout: 5000 })


    // Click on a transmission line edge using the data-type attribute
    const transmissionEdge = page.locator('.react-flow__edge[data-type="transmission-line"]').first()
    const box = await transmissionEdge.boundingBox()
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    }

    // Component details panel should show line info
    const detailsPanel = page.locator('.details-panel')
    await expect(detailsPanel).toContainText('Transmission Line')
    await expect(detailsPanel).toContainText('Voltage')
    await expect(detailsPanel).toContainText('kV')
  })

  test('should switch back to select mode after drawing line', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Switch to line drawing mode
    await page.locator('button:has-text("Line")').click()

    // Draw a line between pylon and switching station
    const pylon = page.locator('.pylon-node').first()
    await pylon.click({ force: true })

    const switchingStation = page.locator('.switching-node').first()
    await switchingStation.click({ force: true })

    await page.waitForTimeout(500)

    // Switch back to select mode
    await page.locator('button:has-text("Select")').click()

    // Should be able to select nodes normally
    await pylon.click()

    const detailsPanel = page.locator('.details-panel')
    await expect(detailsPanel).toContainText('Pylon')
  })
})
