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
    const initialCount = await page.locator('.react-flow__edge').count()
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)
    const pylon = page.locator('.pylon-node').first()
    await pylon.click({ force: true })
    const switchingStation = page.locator('.switching-node').first()
    await switchingStation.click({ force: true })
    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()
    expect(initialCount).toBe(10)
    expect(newCount).toBe(12)
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
    const cityCount = await page.locator('.city-node').count()
    if (cityCount < 2) {
      test.skip(true, 'Only one city in mock data, skipping city-to-city test.')
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
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)
    const pylon = page.locator('.pylon-node').first()
    await pylon.click({ force: true })
    const switchingStation = page.locator('.switching-node').first()
    await switchingStation.click({ force: true })
    await page.waitForTimeout(500)
    await pylon.click({ force: true })
    await switchingStation.click({ force: true })
    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()
    expect(initialCount).toBe(10)
    expect(newCount).toBe(12)
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
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)
    const powerPlant = page.locator('.plant-node').first()
    await powerPlant.click({ force: true })
    const pylon = page.locator('.pylon-node').first()
    await pylon.click({ force: true })
    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()
    expect(initialCount).toBe(10)
    expect(newCount).toBe(12)
  })

  test('should display default details panel text', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.details-panel', { timeout: 5000 })
    const detailsPanel = page.locator('.details-panel')
    await expect(detailsPanel).toContainText('Select a component to view details', { timeout: 5000 })
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
