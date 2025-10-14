/**
 * E2E tests for GridSim application
 * Tests the main application flow and UI interactions
 */

import { test, expect } from '@playwright/test'

test.describe('GridSim Application', () => {
  test('should load the application and display the header', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Check that the app loads
    await expect(page).toHaveTitle(/GridSim/)

    // Check header is visible
    await expect(page.locator('.app-header')).toBeVisible()
    await expect(page.locator('.app-title')).toContainText('GridSim')
    await expect(page.locator('.app-subtitle')).toContainText('Phase 0')
  })

  test('should display the grid canvas', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Check that React Flow canvas is rendered
    await expect(page.locator('.react-flow')).toBeVisible()

    // Check for hidden minimap
    await expect(page.locator('.react-flow__minimap')).not.toBeVisible()

    // Check for controls
    await expect(page.locator('.react-flow__controls')).toBeVisible()
  })

  test('should display mode switcher with all modes', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Check mode switcher is visible
    await expect(page.locator('.mode-switcher')).toBeVisible()
    // await expect(page.locator('.mode-switcher-title')).toContainText('Tool Mode')
    // Check all mode buttons are present
    const modeButtons = page.locator('.mode-button')
    await expect(modeButtons).toHaveCount(7)

    // Verify mode button labels
    await expect(modeButtons.nth(0)).toContainText('Select')
    await expect(modeButtons.nth(1)).toContainText('Power Plant')
    await expect(modeButtons.nth(2)).toContainText('City')
    await expect(modeButtons.nth(3)).toContainText('Line')
    await expect(modeButtons.nth(4)).toContainText('Substation')
    await expect(modeButtons.nth(5)).toContainText('Switching')
    await expect(modeButtons.nth(6)).toContainText('Pylon')
  })

  test('should switch between interaction modes', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Select mode should be active by default
    const selectButton = page.locator('.mode-button').nth(0)
    await expect(selectButton).toHaveClass(/active/)

    // Click power plant mode
    const powerPlantButton = page.locator('.mode-button').nth(1)
    await powerPlantButton.click()
    await expect(powerPlantButton).toHaveClass(/active/)
    await expect(selectButton).not.toHaveClass(/active/)

    // Click city mode
    const cityButton = page.locator('.mode-button').nth(2)
    await cityButton.click()
    await expect(cityButton).toHaveClass(/active/)
    await expect(powerPlantButton).not.toHaveClass(/active/)
  })

  test('should display grid status panel with metrics', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Check grid status panel is visible
    const statusPanel = page.locator('.grid-status-panel')
    await expect(statusPanel).toBeVisible()
    await expect(statusPanel.locator('.panel-title')).toContainText('Grid Status')

    // Check for key metrics
    await expect(statusPanel).toContainText('Budget')
    await expect(statusPanel).toContainText('Happiness')
    await expect(statusPanel).toContainText('Generation')
    await expect(statusPanel).toContainText('Demand')
    await expect(statusPanel).toContainText('Utilization')
    await expect(statusPanel).toContainText('Cities Powered')
  })

  test('should display time control panel', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Check time control panel is visible
    const timePanel = page.locator('.time-control-panel')
    await expect(timePanel).toBeVisible()

    // Check for time display
    await expect(timePanel.locator('.current-time')).toBeVisible()
    await expect(timePanel.locator('.season-badge')).toBeVisible()

    // Check for placeholder controls (disabled in Phase 0)
    const pauseButton = timePanel.locator('button').first()
    await expect(pauseButton).toBeDisabled()
    await expect(pauseButton).toHaveAttribute('title', /Phase 1/)
  })

  test('should display component details panel with empty state', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Check details panel is visible
    const detailsPanel = page.locator('.details-panel')
    await expect(detailsPanel).toBeVisible()
    await expect(detailsPanel.locator('.panel-title')).toContainText('Component Details')

    // Should show empty state initially
    await expect(detailsPanel.locator('.empty-state')).toContainText('Select a component')
  })

  test('should display grid components (nodes) on canvas', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Wait for React Flow to render
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Check that nodes are present
    const nodes = page.locator('.react-flow__node')
    const nodeCount = await nodes.count()
    expect(nodeCount).toBe(12) // 2 plants + 2 cities +  5 substations + 1 switching + 2 pylons = 12

    // Check for different node types
    await expect(page.locator('.plant-node').first()).toBeVisible()
    await expect(page.locator('.city-node').first()).toBeVisible()
  })

  test('should display transmission lines (edges) on canvas', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Wait for React Flow to render
    await page.waitForSelector('.react-flow__edge', { timeout: 5000 })

    // Check that edges are present
    const edges = page.locator('.react-flow__edge')
    const edgeCount = await edges.count()
    expect(edgeCount).toBe(14)  

    // Check for edge labels (hidden by default, visible on hover)
    await expect(page.locator('.edge-label')).toBeHidden()

    // Hover over first edge to show label
    const firstEdge = edges.first()
    const firstEdgePath = firstEdge.locator('.react-flow__edge-path')
    await firstEdgePath.hover()
    await expect(page.locator('.edge-label').first()).toBeVisible()
  })

  test('should be able to zoom and pan the canvas', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Wait for canvas to load
    await page.waitForSelector('.react-flow__viewport', { timeout: 5000 })

    // Get initial viewport transform
    const viewport = page.locator('.react-flow__viewport')
    const initialTransform = await viewport.getAttribute('style')

    // Use zoom controls
    const zoomInButton = page.locator('.react-flow__controls-button[title="zoom in"]')
    await zoomInButton.click()

    // Wait for transform to change
    await page.waitForTimeout(500)
    const newTransform = await viewport.getAttribute('style')

    // Transform should have changed (zoom applied)
    expect(newTransform).not.toBe(initialTransform)
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/?mockdata=e2e')

    // Check that buttons have proper accessibility
    const modeButtons = page.locator('.mode-button')
    const firstButton = modeButtons.first()

    // Buttons should have title attributes for tooltips
    await expect(firstButton).toHaveAttribute('title')
  })
})
