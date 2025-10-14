/**
 * E2E tests for node expansion behavior on hover
 */

import { test, expect } from '@playwright/test'

test.describe('Node Expansion on Hover', () => {
  test('should expand node to show details when hovering in select mode', async ({ page }) => {
    await page.goto('/?mode=e2e')

    // Wait for nodes to render
    await page.waitForSelector('.custom-node', { timeout: 5000 })

    // Get a node
    const node = page.locator('.custom-node').first()

    // Get initial dimensions (should be compact: 56x56)
    const initialBox = await node.boundingBox()
    expect(initialBox).toBeTruthy()
    expect(initialBox!.width).toBeLessThan(80) // Should be ~56px wide initially

    // Get node content (should be hidden)
    const nodeContent = node.locator('.node-content')
    const initialOpacity = await nodeContent.evaluate(el => {
      return window.getComputedStyle(el).opacity
    })
    expect(parseFloat(initialOpacity)).toBeLessThan(0.1) // Should be ~0 opacity

    // Hover over the node
    await node.hover()

    // Wait for transition to complete
    await page.waitForTimeout(400)

    // Get dimensions after hover (should be expanded)
    const hoverBox = await node.boundingBox()
    expect(hoverBox).toBeTruthy()
    expect(hoverBox!.width).toBeGreaterThan(initialBox!.width) // Should expand

    // Node content should be visible
    const hoverOpacity = await nodeContent.evaluate(el => {
      return window.getComputedStyle(el).opacity
    })
    expect(parseFloat(hoverOpacity)).toBeGreaterThan(0.9) // Should be ~1 opacity

    // Should show text content
    await expect(nodeContent).toBeVisible()
    const hasText = await nodeContent.textContent()
    expect(hasText).toBeTruthy()
    expect(hasText!.length).toBeGreaterThan(0)
  })

  test('should show node title and info on expansion', async ({ page }) => {
    await page.goto('/?mode=e2e')

    // Wait for nodes to render
    await page.waitForSelector('.plant-node', { timeout: 5000 })

    // Hover over a power plant node
    const plantNode = page.locator('.plant-node').first()
    await plantNode.hover()

    // Wait for transition
    await page.waitForTimeout(400)

    // Should show title
    const nodeTitle = plantNode.locator('.node-title')
    await expect(nodeTitle).toBeVisible()
    await expect(nodeTitle).toHaveText(/nuclear|coal|ccgt|hydro|wind|solar/i)

    // Should show info
    const nodeInfo = plantNode.locator('.node-info')
    await expect(nodeInfo.first()).toBeVisible()
    await expect(nodeInfo.first()).toContainText(/MW|%/)
  })

  test('should NOT expand node when hovering in line drawing mode', async ({ page }) => {
    await page.goto('/?mode=e2e')

    // Wait for nodes to render
    await page.waitForSelector('.custom-node', { timeout: 5000 })

    // Switch to line drawing mode
    const lineButton = page.locator('.mode-button').filter({ hasText: 'Line' })
    await lineButton.click()

    // Verify mode switched (toolbar should show active state)
    await expect(lineButton).toHaveClass(/active/)

    // Verify data-mode attribute is set
    const gridCanvas = page.locator('.grid-canvas')
    const dataMode = await gridCanvas.getAttribute('data-mode')
    expect(dataMode).toBe('add-transmission-line')

    // Get a node
    const node = page.locator('.custom-node').first()

    // Get initial dimensions
    const initialBox = await node.boundingBox()
    expect(initialBox).toBeTruthy()
    const initialWidth = initialBox!.width
    const initialHeight = initialBox!.height

    // Node content should be hidden
    const nodeContent = node.locator('.node-content')
    const initialOpacity = await nodeContent.evaluate(el => {
      return window.getComputedStyle(el).opacity
    })
    expect(parseFloat(initialOpacity)).toBeLessThan(0.1)

    // Hover over the node
    await node.hover()

    // Wait for any potential transition
    await page.waitForTimeout(400)

    // Get dimensions after hover (should NOT expand)
    const hoverBox = await node.boundingBox()
    expect(hoverBox).toBeTruthy()

    // Allow small variance for browser rendering differences
    expect(Math.abs(hoverBox!.width - initialWidth)).toBeLessThan(5)
    expect(Math.abs(hoverBox!.height - initialHeight)).toBeLessThan(5)

    // Node content should remain hidden
    const hoverOpacity = await nodeContent.evaluate(el => {
      return window.getComputedStyle(el).opacity
    })
    expect(parseFloat(hoverOpacity)).toBeLessThan(0.1) // Should still be ~0 opacity
  })

  test('should not expand city nodes in line drawing mode', async ({ page }) => {
    await page.goto('/?mode=e2e')

    // Wait for nodes to render
    await page.waitForSelector('.city-node', { timeout: 5000 })

    // Switch to line drawing mode
    const lineButton = page.locator('.mode-button').filter({ hasText: 'Line' })
    await lineButton.click()

    // Get a city node
    const cityNode = page.locator('.city-node').first()

    // Get initial dimensions
    const initialBox = await cityNode.boundingBox()
    expect(initialBox).toBeTruthy()
    const initialWidth = initialBox!.width

    // Node content should be hidden
    const nodeContent = cityNode.locator('.node-content')
    const initialOpacity = await nodeContent.evaluate(el => {
      return window.getComputedStyle(el).opacity
    })
    expect(parseFloat(initialOpacity)).toBeLessThan(0.1)

    // Hover over the city node
    await cityNode.hover()

    // Wait for any potential transition
    await page.waitForTimeout(400)

    // Get dimensions after hover (should not expand horizontally with content)
    const hoverBox = await cityNode.boundingBox()
    expect(hoverBox).toBeTruthy()

    // Width should not have expanded significantly (no text content shown)
    // Allow some variance for the container itself
    expect(Math.abs(hoverBox!.width - initialWidth)).toBeLessThan(10)

    // Node content should remain hidden
    const hoverOpacity = await nodeContent.evaluate(el => {
      return window.getComputedStyle(el).opacity
    })
    expect(parseFloat(hoverOpacity)).toBeLessThan(0.1)
  })

  test('should expand node again when switching back to select mode', async ({ page }) => {
    await page.goto('/?mode=e2e')

    // Wait for nodes to render
    await page.waitForSelector('.custom-node', { timeout: 5000 })

    // Switch to line drawing mode
    const lineButton = page.locator('.mode-button').filter({ hasText: 'Line' })
    await lineButton.click()

    // Verify in line drawing mode
    await expect(lineButton).toHaveClass(/active/)

    // Get a non-city node (city nodes might have different size behavior)
    const node = page.locator('.plant-node, .pylon-node, .substation-node').first()

    // Hover (should not expand)
    await node.hover()
    await page.waitForTimeout(400)

    const lineDrawingBox = await node.boundingBox()
    const lineDrawingWidth = lineDrawingBox!.width

    // Move mouse away
    await page.mouse.move(0, 0)
    await page.waitForTimeout(200)

    // Switch back to select mode by clicking the Select button
    const selectButton = page.locator('.mode-button').filter({ hasText: 'Select' })
    await selectButton.click()

    // Verify mode switched back
    await expect(selectButton).toHaveClass(/active/)
    await expect(lineButton).not.toHaveClass(/active/)

    // Verify data-mode changed
    const gridCanvas = page.locator('.grid-canvas')
    const dataMode = await gridCanvas.getAttribute('data-mode')
    expect(dataMode).toBe('select')

    // Wait for mode change to take effect
    await page.waitForTimeout(200)

    // Hover again (should expand this time)
    await node.hover()
    await page.waitForTimeout(400)

    const selectModeBox = await node.boundingBox()
    expect(selectModeBox!.width).toBeGreaterThan(lineDrawingWidth)

    // Node content should be visible
    const nodeContent = node.locator('.node-content')
    const opacity = await nodeContent.evaluate(el => {
      return window.getComputedStyle(el).opacity
    })
    expect(parseFloat(opacity)).toBeGreaterThan(0.9)
  })
})
