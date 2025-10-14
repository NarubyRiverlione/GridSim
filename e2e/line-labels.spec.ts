import { test, expect } from '@playwright/test'

// Test that transmission line labels are hidden by default and show on hover

test.describe('Transmission line label visibility', () => {
  test('labels hidden by default and appear on hover', async ({ page }) => {
    await page.goto('/?mockdata=e2e')
    await page.waitForSelector('.react-flow__node', { timeout: 5000 })

    // Ensure there's at least one transmission line. If none, create a simple one programmatically
    const lineSelector = '.react-flow__edge[data-type="transmission-line"]'
    let lineCount = await page.locator(lineSelector).count()

    if (lineCount === 0) {
      // Create a line: switch to transmission mode, click first two nodes
      await page.locator('button:has-text("Transmission")').click()
      // Wait for nodes to be ready
      const node = page.locator('.react-flow__node').first()
      await node.waitFor({ state: 'visible' })
      // Click on two different nodes to create a line
      const firstNode = page.locator('.react-flow__node').nth(0)
      const secondNode = page.locator('.react-flow__node').nth(1)
      await firstNode.click()
      await secondNode.click()

      // Wait for the edge to appear
      await page.waitForSelector(lineSelector)
      lineCount = await page.locator(lineSelector).count()
    }

    expect(lineCount).toBeGreaterThan(0)

    // Pick the first transmission edge and hover its path element
    const edge = page.locator(lineSelector).first()
    const path = edge.locator('.react-flow__edge-path').first()

    // By default there should be no visible label globally
    await expect(page.locator('.edge-label')).toBeHidden()

    // Hover the edge path - the label (rendered via EdgeLabelRenderer) should appear
    await path.hover()
    await expect(page.locator('.edge-label').first()).toBeVisible()

    // Move mouse away - label should hide again
    await page.mouse.move(10, 10)
    await expect(page.locator('.edge-label')).toBeHidden()
  })
})
