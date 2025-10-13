/**
 * Visual regression tests for GridSim
 * These tests capture screenshots and compare against baselines
 */

import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('should match the full application layout', async ({ page }) => {
    await page.goto('/?mockData=complex')

    // Wait for all content to load
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })
    await page.waitForTimeout(1000) // Allow for animations

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('full-app.png', {
      fullPage: true,
      maxDiffPixels: 1000, // Allow larger differences for visual tweaks
    })
  })

  test('should match the grid canvas area', async ({ page }) => {
    await page.goto('/?mockData=complex')

    // Wait for canvas to load
    await page.waitForSelector('.react-flow', { timeout: 5000 })
    await page.waitForTimeout(1000)

    // Screenshot just the canvas area
    const canvas = page.locator('.canvas-area')
    await expect(canvas).toHaveScreenshot('grid-canvas.png', {
      maxDiffPixels: 1000,
    })
  })

  test('should match the sidebar panels', async ({ page }) => {
    await page.goto('/?mockData=complex')

    // Wait for panels to load
    await page.waitForSelector('.sidebar-left', { timeout: 5000 })
    await page.waitForTimeout(500)

    // Screenshot the left sidebar with all panels
    const sidebar = page.locator('.sidebar-left')
    await expect(sidebar).toHaveScreenshot('left-sidebar.png', {
      maxDiffPixels: 1000,
    })
  })

  test('should match mode switcher toolbar', async ({ page }) => {
    await page.goto('/?mockData=complex')

    // Wait for toolbar to load
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Screenshot the mode switcher
    const modeSwitcher = page.locator('.mode-switcher')
    await expect(modeSwitcher).toHaveScreenshot('mode-switcher.png')
  })

  test('should match active mode state', async ({ page }) => {
    await page.goto('/?mockData=complex')

    // Wait for toolbar to load
    await page.waitForSelector('.mode-switcher', { timeout: 5000 })

    // Click power plant mode
    const powerPlantButton = page.locator('.mode-button').nth(1)
    await powerPlantButton.click()
    await page.waitForTimeout(300)

    // Screenshot with active state
    const modeSwitcher = page.locator('.mode-switcher')
    await expect(modeSwitcher).toHaveScreenshot('mode-switcher-active.png')
  })

  test('should match component details panel with selection', async ({ page }) => {
    await page.goto('/?mockData=complex')

    // Wait for nodes and select one
    await page.waitForSelector('.plant-node', { timeout: 5000 })
    await page.locator('.plant-node').first().click()
    await page.waitForTimeout(300)

    // Screenshot the details panel
    const detailsPanel = page.locator('.details-panel')
    await expect(detailsPanel).toHaveScreenshot('details-panel-selected.png')
  })
})
