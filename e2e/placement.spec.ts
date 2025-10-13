/**
 * E2E tests for Phase 0 component placement system
 */

import { test, expect } from '@playwright/test'

test.describe('Component Placement System', () => {
  test('should switch to power plant placement mode', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Click power plant mode button
    const powerPlantButton = page.locator('button:has-text("Power Plant")')
    await powerPlantButton.click()

    // Verify mode is active
    await expect(powerPlantButton).toHaveClass(/active/)
  })

  test('should show ghost preview when hovering in placement mode', async ({ page }) => {
    await page.goto('/')
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
    await page.goto('/')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Count initial nodes
    const initialCount = await page.locator('.react-flow__node').count()

    // Switch to power plant mode
    await page.locator('button:has-text("Power Plant")').click()

    // Click on canvas to place (use force to bypass pointer interception)
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 600, y: 200 }, force: true })

    // Wait for new node to appear
    await page.waitForTimeout(500)

    // Should have one more node
    const newCount = await page.locator('.react-flow__node').count()
    expect(newCount).toBe(initialCount + 1)
  })

  test('should select plant type before placing', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Switch to power plant mode
    await page.locator('button:has-text("Power Plant")').click()

    // Wait for build menu to become visible
    await page.waitForSelector('.build-menu:visible', { timeout: 5000 })

    // Build menu should show plant type options
    const buildMenu = page.locator('.build-menu')
    await expect(buildMenu).toBeVisible()
    await expect(buildMenu).toContainText('Nuclear')
    await expect(buildMenu).toContainText('CCGT')
    await expect(buildMenu).toContainText('Solar')

    // Select CCGT
    await page.locator('.build-menu button:has-text("CCGT")').click()

    // CCGT button should be active
    await expect(page.locator('.build-menu button:has-text("CCGT")')).toHaveClass(/active/)
  })

  test('should place a city with selected size', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    const initialCount = await page.locator('.react-flow__node').count()

    // Switch to city mode
    await page.locator('button:has-text("City")').click()

    // Select Large City size
    await page.locator('button:has-text("Large City")').click()

    // Place city
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 700, y: 200 }, force: true })

    await page.waitForTimeout(500)

    // Should have one more node
    const newCount = await page.locator('.react-flow__node').count()
    expect(newCount).toBe(initialCount + 1)
  })

  test('should place substation with type selection', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    const initialCount = await page.locator('.react-flow__node').count()

    // Switch to substation mode
    await page.locator('button:has-text("Substation")').click()

    // Should show Grid and Zone options
    await expect(page.locator('button:has-text("Grid")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Zone")').first()).toBeVisible()

    // Select Zone substation
    await page.locator('.build-menu button:has-text("Zone")').click()

    // Place substation
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 800, y: 200 }, force: true })

    await page.waitForTimeout(500)

    const newCount = await page.locator('.react-flow__node').count()
    expect(newCount).toBe(initialCount + 1)
  })

  test('should place switching station', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    const initialCount = await page.locator('.react-flow__node').count()

    // Switch to switching station mode
    await page.locator('button:has-text("Switching")').click()

    // Place switching station
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 500, y: 250 }, force: true })

    await page.waitForTimeout(500)

    const newCount = await page.locator('.react-flow__node').count()
    expect(newCount).toBe(initialCount + 1)
  })

  test('should place pylon', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    const initialCount = await page.locator('.react-flow__node').count()

    // Switch to pylon mode
    await page.locator('button:has-text("Pylon")').click()

    // Place pylon
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 450, y: 250 }, force: true })

    await page.waitForTimeout(500)

    const newCount = await page.locator('.react-flow__node').count()
    expect(newCount).toBe(initialCount + 1)
  })
})
