/**
 * E2E tests for user interactions with grid components
 */

import { test, expect } from '@playwright/test'

test.describe('Component Interactions', () => {
  test('should select a node and display its details', async ({ page }) => {
    await page.goto('/')

    // Wait for nodes to render
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Click on a power plant node
    const powerPlantNode = page.locator('.plant-node').first()
    await powerPlantNode.click()

    // Check that component details panel updates
    const detailsPanel = page.locator('.details-panel')
    await expect(detailsPanel).not.toContainText('Select a component')
    await expect(detailsPanel).toContainText('Power Plant')

    // Should display component details
    await expect(detailsPanel).toContainText('Capacity')
    await expect(detailsPanel).toContainText('Current Output')
    await expect(detailsPanel).toContainText('MW')
  })

  test('should select a city node and display its details', async ({ page }) => {
    await page.goto('/')

    // Wait for nodes to render
    await page.waitForSelector('.city-node', { timeout: 5000 })

    // Click on a city node
    const cityNode = page.locator('.city-node').first()
    await cityNode.click()

    // Check that component details panel updates
    const detailsPanel = page.locator('.details-panel')
    await expect(detailsPanel).toContainText('City')
    await expect(detailsPanel).toContainText('Name')
    await expect(detailsPanel).toContainText('Demand')
  })

  test('should deselect component when clicking on canvas', async ({ page }) => {
    await page.goto('/')

    // Wait for nodes to render
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Select a node first
    const node = page.locator('.plant-node').first()
    await node.click()

    // Verify it's selected
    const detailsPanel = page.locator('.details-panel')
    await expect(detailsPanel).toContainText('Power Plant')

    // Click on empty canvas area (React Flow pane)
    const canvas = page.locator('.react-flow__pane')
    await canvas.click({ position: { x: 50, y: 50 } })

    // Should show empty state again
    await expect(detailsPanel).toContainText('Select a component')
  })

  test('should display node information inline on the canvas', async ({ page }) => {
    await page.goto('/')

    // Wait for nodes to render
    await page.waitForSelector('.plant-node', { timeout: 5000 })

    // Check that power plant nodes show capacity and output
    const powerPlantNode = page.locator('.plant-node').first()
    await expect(powerPlantNode).toContainText('MW')
    await expect(powerPlantNode).toContainText('%')
  })

  test('should display city connection status', async ({ page }) => {
    await page.goto('/')

    // Wait for city nodes to render
    await page.waitForSelector('.city-node', { timeout: 5000 })

    // Check all city nodes
    const cityNodes = page.locator('.city-node')
    const count = await cityNodes.count()

    // At least one city should show connection status
    let foundConnectionStatus = false
    for (let i = 0; i < count; i++) {
      const text = await cityNodes.nth(i).textContent()
      if (text?.includes('powered') || text?.includes('Not connected')) {
        foundConnectionStatus = true
        break
      }
    }

    expect(foundConnectionStatus).toBe(true)
  })

  test('should display component state with color coding', async ({ page }) => {
    await page.goto('/')

    // Wait for nodes to render
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Nodes should have border colors indicating state
    const node = page.locator('.custom-node').first()
    const borderColor = await node.evaluate(el => {
      return window.getComputedStyle(el).borderColor
    })

    // Should have a colored border (not default black)
    expect(borderColor).toBeTruthy()
    expect(borderColor).not.toBe('rgb(0, 0, 0)')
  })

  test('should show transmission line voltage and load', async ({ page }) => {
    await page.goto('/')

    // Wait for edges and labels to render
    await page.waitForSelector('.edge-label', { timeout: 5000 })

    // Check edge label content
    const edgeLabel = page.locator('.edge-label').first()
    await expect(edgeLabel).toContainText('kV')
    await expect(edgeLabel).toContainText('load')
  })

  test('should hover over nodes and show hover state', async ({ page }) => {
    await page.goto('/')

    // Wait for nodes to render
    await page.waitForSelector('.custom-node', { timeout: 5000 })

    // Hover over a node
    const node = page.locator('.custom-node').first()

    // Get initial box shadow
    const initialShadow = await node.evaluate(el => {
      return window.getComputedStyle(el).boxShadow
    })

    // Hover
    await node.hover()

    // Wait a bit for transition
    await page.waitForTimeout(300)

    // Get hover box shadow
    const hoverShadow = await node.evaluate(el => {
      return window.getComputedStyle(el).boxShadow
    })

    // Shadow should change on hover (becomes larger/more prominent)
    expect(hoverShadow).not.toBe(initialShadow)
  })
})
