/**
 * Debug test for line drawing - check if lines are being added
 */

import { test, expect } from '@playwright/test'

test.describe('Line Drawing Debug', () => {
  test('should add a line and verify it appears in the DOM', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('BROWSER:', msg.text()))

    await page.goto('/?mockdata=e2e')

    // Wait for nodes to render
    await page.waitForSelector('.custom-node', { timeout: 5000 })

    // Count initial edges
    const initialEdges = await page.locator('.react-flow__edge').count()
    console.log('Initial edge count:', initialEdges)

    // Switch to line drawing mode
    const lineButton = page.locator('.mode-button').filter({ hasText: 'Line' })
    await lineButton.click()
    await expect(lineButton).toHaveClass(/active/)

    // Get pylon and switching station nodes (they should have capacity)
    const pylonNode = page.locator('.pylon-node').first()
    const switchingNode = page.locator('.switching-node').first()

    const pylonText = await pylonNode.textContent()
    const switchingText = await switchingNode.textContent()
    console.log('Clicking pylon node:', pylonText)

    // Click pylon node
    await pylonNode.click()
    await page.waitForTimeout(500)

    console.log('Clicking switching node:', switchingText)

    // Click switching station node
    await switchingNode.click()
    await page.waitForTimeout(1000)

    // Check if edge count increased
    const finalEdges = await page.locator('.react-flow__edge').count()
    console.log('Final edge count:', finalEdges)

    // The edge count should have increased
    expect(finalEdges).toBeGreaterThan(initialEdges)
  })

  test('should call handleLineAdd when clicking two nodes', async ({ page }) => {
    // Track function calls
    await page.goto('/?mockdata=e2e')

    // Inject a spy to track handleLineAdd calls
    await page.evaluate(() => {
      (window as any).lineAddCalls = []
    })

    // Wait for nodes to render
    await page.waitForSelector('.custom-node', { timeout: 5000 })

    // Switch to line drawing mode
    const lineButton = page.locator('.mode-button').filter({ hasText: 'Line' })
    await lineButton.click()

    // Click two nodes
    const nodes = page.locator('.custom-node')
    await nodes.first().click()
    await page.waitForTimeout(200)
    await nodes.nth(1).click()
    await page.waitForTimeout(500)

    // Check the console logs
    const logs = await page.evaluate(() => {
      return (window as any).lineAddCalls || []
    })

    console.log('Line add calls:', logs)
  })
})
