/**
 * E2E tests for Phase 0 component placement system
 */

import { test, expect } from '@playwright/test'

test.describe('Component Placement System', () => {
  test('should switch to power plant placement mode', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Click power plant mode button
    const powerPlantButton = page.locator('button:has-text("Power Plant")')
    await powerPlantButton.click()

    // Verify mode is active
    await expect(powerPlantButton).toHaveClass(/active/)
  })

  test('should show ghost preview when hovering in placement mode', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Switch to power plant mode
    await page.locator('button:has-text("Power Plant")').click()

    // Move mouse over canvas
    const canvas = page.locator('.react-flow__pane')
    await canvas.hover({ position: { x: 400, y: 300 } })

    // Wait for ghost node to appear
    await page.waitForTimeout(300)

    // Ghost node should be visible
    const ghostNode = page.locator('.ghost-node')
    await expect(ghostNode).toBeVisible()
  })

  test('should place a power plant on click', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Count initial power plant nodes
    const plantSelector = '.plant-node'
    const initialPlantCount = await page.locator(plantSelector).count()
    // there is at least one plant in mock data
    expect(initialPlantCount).toBeGreaterThanOrEqual(1)

    // Switch to power plant mode
    await page.locator('button:has-text("Power Plant")').click()

    // Click on canvas to place (use force to bypass pointer interception)
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 600, y: 200 }, force: true })

    // Wait for new node to appear
    await page.waitForTimeout(500)

    // Should have one more power plant node
    const newPlantCount = await page.locator(plantSelector).count()
    expect(newPlantCount).toBe(initialPlantCount + 1)
  })

  test('should select plant type before placing', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Switch to power plant mode
    await page.locator('button:has-text("Power Plant")').click()

    // Wait for build menu to become visible and ensure plant-type options exist
    await page.waitForSelector('.build-menu', { timeout: 5000 })
    // Build menu contains multiple sections; target the plant type area
    const plantSection = page.locator('.build-menu').filter({ hasText: 'Select Plant Type' }).first()
    await expect(plantSection).toBeVisible()
    await expect(plantSection).toContainText('Nuclear')
    await expect(plantSection).toContainText('CCGT')
    await expect(plantSection).toContainText('Solar')

    // Select CCGT
    await plantSection.locator('button:has-text("CCGT")').click()

    // CCGT button should be active
    await expect(plantSection.locator('button:has-text("CCGT")')).toHaveClass(/active/)
  })

  test('should place a city with selected size', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Count initial city nodes
    const citySelector = '.city-node'
    const initialCityCount = await page.locator(citySelector).count()
    expect(initialCityCount).toBeGreaterThanOrEqual(1)

    // Switch to city mode
    await page.locator('button:has-text("City")').click()

    // Select Large City size and wait for it to become active
    const largeCityButton = page.locator('button:has-text("Large City")').first()
    await largeCityButton.click()
    await expect(largeCityButton).toHaveClass(/active/)

    // Place city — try multiple positions, hovering first so ghost preview updates
    const canvas = page.locator('.react-flow__pane')
    const candidates = [
      { x: 700, y: 200 },
      { x: 200, y: 200 },
      { x: 600, y: 400 },
      { x: 300, y: 500 },
      { x: 450, y: 300 },
      { x: 500, y: 350 },
    ]

    let newCityCount = initialCityCount
    for (const pos of candidates) {
      await canvas.click({ position: pos, force: true })
      try {
        // wait for the city node count to increase for this candidate
        await expect(page.locator(citySelector)).toHaveCount(initialCityCount + 1, { timeout: 700 })
        newCityCount = await page.locator(citySelector).count()
        break
      } catch (e) {
        // try next candidate
      }
    }

    // Should have one more city node after placing
    expect(newCityCount).toBe(initialCityCount + 1)
  })

  test('should place substation with type selection', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Count initial substation nodes
    const substationSelector = '.substation-node'
    const initialSubCount = await page.locator(substationSelector).count()
    expect(initialSubCount).toBeGreaterThanOrEqual(1)

    // Switch to substation mode
    await page.locator('button:has-text("Substation")').click()

    // Should show Grid and Zone options
    await expect(page.locator('button:has-text("Grid")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Zone")').first()).toBeVisible()

    // Select Zone substation
    await page.locator('.build-menu button:has-text("Zone")').click()

    // Try several candidate positions until placement succeeds (robust against collisions)
    const canvas = page.locator('.react-flow__pane')
    const candidates = [
      { x: 800, y: 200 },
      { x: 200, y: 300 },
      { x: 650, y: 350 },
      { x: 350, y: 450 },
    ]

    let newSubCount = initialSubCount
    for (const pos of candidates) {
      await canvas.click({ position: pos, force: true })
      await page.waitForTimeout(300)
      newSubCount = await page.locator(substationSelector).count()
      if (newSubCount === initialSubCount + 1) break
    }

    expect(newSubCount).toBe(initialSubCount + 1)
  })

  test('should place switching station', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })
    // Count switching nodes by type
    const switchingSelector = '.switching-node'
    const initialSwitchingCount = await page.locator(switchingSelector).count()
    expect(initialSwitchingCount).toBeGreaterThanOrEqual(0)

    // Switch to switching station mode
    await page.locator('button:has-text("Switching")').click()

    // Place switching station
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 500, y: 250 }, force: true })

    // Wait for switching node count to increment
    await expect(page.locator(switchingSelector)).toHaveCount(initialSwitchingCount + 1, { timeout: 2000 })
  })

  test('should place pylon', async ({ page }) => {
    await page.goto('/?mockData=complex')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })
    // Count pylons by node type
    const pylonSelector = '.pylon-node'
    const initialPylonCount = await page.locator(pylonSelector).count()
    expect(initialPylonCount).toBeGreaterThanOrEqual(0)

    // Switch to pylon mode
    await page.locator('button:has-text("Pylon")').click()

    // Place pylon
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 450, y: 250 }, force: true })

    // Wait for pylon node to appear
    await expect(page.locator(pylonSelector)).toHaveCount(initialPylonCount + 1, { timeout: 2000 })
  })
})
