import { test, expect } from '@playwright/test'

// Capture console messages while moving the mouse across the canvas to detect re-render frequency

test('capture edge render logs during mouse move', async ({ page }) => {
  await page.goto('/?mockData=e2e')
  await page.waitForSelector('.react-flow__pane', { timeout: 5000 })

  const logs: string[] = []
  page.on('console', msg => {
    const text = msg.text()
    // capture debug messages only
    if (text.includes('TransmissionLineEdge render') || text.includes('GridCanvas')) {
      logs.push(text)
      // echo to test stdout so it's visible in test output
      // eslint-disable-next-line no-console
      console.log('[CAPTURE]', text)
    }
  })

  // Move the mouse across the canvas in a grid pattern
  const pane = page.locator('.react-flow__pane')
  const box = await pane.boundingBox()
  if (!box) throw new Error('Canvas bounding box not found')

  // Define a path of points across the pane
  const points = []
  const steps = 10
  for (let i = 0; i <= steps; i++) {
    const x = box.x + (i / steps) * box.width
    const y = box.y + (i / steps) * box.height
    points.push({ x, y })
  }

  // Perform repeated passes for a short duration
  const passes = 6
  for (let p = 0; p < passes; p++) {
    for (const pt of points) {
      await page.mouse.move(pt.x, pt.y)
      // small delay to let RAF batching run
      await page.waitForTimeout(20)
    }
  }

  // wait briefly for any last logs
  await page.waitForTimeout(300)

  // Ensure we captured some logs
  expect(logs.length).toBeGreaterThan(0)

  // Write a small summary
  const renderLogs = logs.filter(l => l.includes('TransmissionLineEdge render'))
  const canvasLogs = logs.filter(l => l.includes('GridCanvas'))

  // eslint-disable-next-line no-console
  console.log('--- Summary ---')
  // eslint-disable-next-line no-console
  console.log('TransmissionLineEdge logs:', renderLogs.length)
  // eslint-disable-next-line no-console
  console.log('GridCanvas logs:', canvasLogs.length)
})
