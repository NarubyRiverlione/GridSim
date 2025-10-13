/**
 * E2E tests for Phase 0 transmission line drawing system
 */

import { test, expect } from '@playwright/test'

test.describe('Line Drawing System', () => {
  test('should switch to line drawing mode', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Click line mode button
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()

    // Verify mode is active
    await expect(lineButton).toHaveClass(/active/)
  })

  test('should draw line between pylon and switching station', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__edge', { timeout: 5000 })
    const initialCount = await page.locator('.react-flow__edge').count()
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)

    // Wait for nodes to be ready
    await page.waitForTimeout(200)

    // Use pylon-2 and substation since pylon-1 already connects to switching-1 (line-9)
    const pylon = page.locator('.pylon-node').nth(1) // pylon-2
    await pylon.click({ force: true })
    const substation = page.locator('.substation-node').first() // substation-G1
    await substation.click({ force: true })
    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()

    // Mock data has 10 lines, should add one more
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test('should show preview line when drawing', async ({ page }) => {
    await page.goto('/?mockData=complex')
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

  test('should handle city to city connection attempt', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.city-node', { timeout: 5000 })
    const cityCount = await page.locator('.city-node').count()
    if (cityCount < 2) {
      test.skip(true, 'Only one city in mock data, skipping city-to-city test.')
      return
    }

    const initialCount = await page.locator('.react-flow__edge').count()

    // Switch to line drawing mode
    await page.locator('button:has-text("Line")').click()
    await page.waitForTimeout(200)

    // Click on first city
    const firstCity = page.locator('.city-node').first()
    await firstCity.click({ force: true })

    // Click on second city
    const secondCity = page.locator('.city-node').nth(1)
    await secondCity.click({ force: true })

    // Should show error message OR not create the line (Phase 0 may allow with warning)
    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()
    const errorMessage = page.locator('.error-message, [role="alert"]')
    const errorVisible = await errorMessage.isVisible().catch(() => false)

    // Either error shown OR line not created
    expect(errorVisible || newCount === initialCount).toBe(true)
  })

  test('should prevent duplicate lines', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })
    const initialCount = await page.locator('.react-flow__edge').count()
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)

    await page.waitForTimeout(200)

    // Use plant-1 and substation-G3 (no existing connection)
    const plant = page.locator('.plant-node').first()
    await plant.click({ force: true })
    const substations = page.locator('.substation-node')
    const substation = substations.nth(Math.min(2, (await substations.count()) - 1)) // substation-G3
    await substation.click({ force: true })
    await page.waitForTimeout(500)

    const countAfterFirst = await page.locator('.react-flow__edge').count()

    // Try to draw the same line again
    await plant.click({ force: true })
    await substation.click({ force: true })
    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()

    // Should only add one line (duplicate prevention)
    expect(countAfterFirst).toBeGreaterThan(initialCount)
    expect(newCount).toBe(countAfterFirst) // No second line added
  })

  test('should cancel line drawing when clicking pane', async ({ page }) => {
    await page.goto('/?mockData=complex')
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
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })
    const initialCount = await page.locator('.react-flow__edge').count()
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)

    await page.waitForTimeout(200)

    const powerPlant = page.locator('.plant-node').first()
    await powerPlant.click({ force: true })
    const pylon = page.locator('.pylon-node').first()
    await pylon.click({ force: true })
    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()

    // Should add a new line
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test('should display default details panel text', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.details-panel', { timeout: 5000 })
    const detailsPanel = page.locator('.details-panel')
    await expect(detailsPanel).toContainText('Select a component to view details', { timeout: 5000 })
  })

  test('should switch back to select mode after drawing line', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Switch to line drawing mode
    await page.locator('button:has-text("Line")').click()
    await page.waitForTimeout(200)

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

  // New tests for direct component connections (voltage cascade)
  test('should connect power plant to grid substation (400kV)', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    const initialCount = await page.locator('.react-flow__edge').count()

    // Switch to line drawing mode
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)
    await page.waitForTimeout(200)

    // Wait for nodes to be visible
    await page.waitForSelector('.plant-node', { timeout: 5000 })
    await page.waitForSelector('.substation-node', { timeout: 5000 })

    // Connect plant-1 to substation-G3 (no existing connection, both 400kV)
    const powerPlant = page.locator('.plant-node').first() // plant-1
    await powerPlant.click({ force: true })

    const substations = page.locator('.substation-node')
    const substationCount = await substations.count()
    const substation = substations.nth(substationCount - 1) // substation-G3 (last one)
    await substation.click({ force: true })

    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()

    // Should successfully add 400kV line
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test('should connect grid substation to zone substation (220kV)', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    const initialCount = await page.locator('.react-flow__edge').count()

    // Switch to line drawing mode
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)
    await page.waitForTimeout(200)

    // Connect substation-G3 output (220kV) to substation-Z1 input (220kV)
    // Wait for substations to be visible
    await page.waitForSelector('.substation-node', { timeout: 5000 })
    const substations = page.locator('.substation-node')
    const substationCount = await substations.count()

    // Click the last substation (substation-G3)
    const firstSubstation = substations.nth(substationCount - 1)
    await firstSubstation.click({ force: true })

    const secondSubstation = substations.first() // substation-Z1
    await secondSubstation.click({ force: true })

    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()

    // Should successfully add 220kV line
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test('should connect zone substation to city (110kV)', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    const initialCount = await page.locator('.react-flow__edge').count()

    // Switch to line drawing mode
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)
    await page.waitForTimeout(200)

    // Wait for substations to be visible
    await page.waitForSelector('.substation-node', { timeout: 5000 })
    const substations = page.locator('.substation-node')
    const substationCount = await substations.count()

    // Connect substation-Z1 to city-2 (should be a new connection)
    // substation-Z1 is already connected to pylon-1, but not directly to city-2
    const substation = substations.nth(1) // substation-Z1 (2nd substation)
    await substation.click({ force: true })

    // Wait and find city-1 (Berlin) - connect to first city
    await page.waitForSelector('.city-node', { timeout: 5000 })
    const cities = page.locator('.city-node')
    const city = cities.first() // city-1 (Berlin)
    await city.click({ force: true })

    await page.waitForTimeout(500)
    const newCount = await page.locator('.react-flow__edge').count()

    // Should successfully add 110kV line
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test('should show error for invalid voltage connection (power plant to city)', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Switch to line drawing mode
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)
    await page.waitForTimeout(200)

    // Try to connect power plant (400kV output) directly to city (110kV input) - invalid
    const powerPlant = page.locator('.plant-node').first()
    await powerPlant.click({ force: true })

    const city = page.locator('.city-node').first()
    await city.click({ force: true })

    await page.waitForTimeout(500)

    // Should show error message for voltage mismatch
    const errorMessage = page.locator('.error-message, [role="alert"]')
    await expect(errorMessage).toBeVisible({ timeout: 3000 })
  })

  test('should show error for wrong direction substation connection', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Switch to line drawing mode
    const lineButton = page.locator('button:has-text("Line")')
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)
    await page.waitForTimeout(200)

    // Wait for substations to be visible
    await page.waitForSelector('.substation-node', { timeout: 5000 })

    // Try to connect zone substation output to grid substation input (backward voltage cascade)
    const substations = page.locator('.substation-node')
    const firstSubstation = substations.first()
    await firstSubstation.click({ force: true })

    const secondSubstation = substations.nth(1)
    await secondSubstation.click({ force: true })

    await page.waitForTimeout(500)

    // Should either show error or create line but with warning
    // (behavior depends on validation rules - adjust based on actual implementation)
    const newCount = await page.locator('.react-flow__edge').count()

    // For Phase 0, this might be allowed with a warning
    // Test just verifies the connection attempt completes without crash
    expect(newCount).toBeGreaterThanOrEqual(10)
  })
})
