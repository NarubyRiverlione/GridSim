# E2E Testing Guide for GridSim

This guide explains how to use the End-to-End (E2E) testing system in GridSim, designed to work seamlessly with both human developers and AI-assisted development.

## Overview

GridSim uses **Playwright** for E2E testing, which provides:

- Cross-browser testing (Chromium, Firefox, WebKit)
- Automatic waiting and retry logic
- Visual regression testing with screenshots
- Interactive debugging tools
- AI-friendly test writing

## Quick Start

### Running Tests

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Run tests with UI (interactive mode)
pnpm test:e2e:ui

# Run tests with browser visible
pnpm test:e2e:headed

# Debug tests step-by-step
pnpm test:e2e:debug

# View test report
pnpm test:e2e:report

# Update visual snapshots
pnpm test:e2e:update-snapshots
```

## Test Structure

### Test Files Location

All E2E tests are located in the `/e2e` directory:

```
e2e/
  ├── app.spec.ts           # Main application tests
  ├── interactions.spec.ts  # User interaction tests
  ├── visual.spec.ts        # Visual regression tests
  └── tsconfig.json         # TypeScript config for tests
```

### Test Categories

#### 1. Application Tests (`app.spec.ts`)

Tests core application functionality:

- Page loading and rendering
- Header and main UI elements
- Canvas initialization
- Panel visibility
- Component display

#### 2. Interaction Tests (`interactions.spec.ts`)

Tests user interactions:

- Node selection and deselection
- Component detail display
- Mode switching
- Hover states
- Click handling

#### 3. Visual Regression Tests (`visual.spec.ts`)

Tests visual consistency:

- Full page screenshots
- Component screenshots
- State-based visuals
- Layout verification

## Writing Tests for AI Assistance

The test suite is designed to be AI-friendly with:

### 1. Clear Test Structure

```typescript
test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    await page.goto('/')

    // Arrange: Set up the test
    await page.waitForSelector('.some-element')

    // Act: Perform the action
    await page.click('.button')

    // Assert: Verify the result
    await expect(page.locator('.result')).toBeVisible()
  })
})
```

### 2. Descriptive Selectors

Tests use semantic CSS classes that describe what they do:

- `.mode-switcher` - The toolbar for changing modes
- `.grid-status-panel` - The panel showing grid metrics
- `.plant-node` - A power plant node on the canvas
- `.city-node` - A city node on the canvas

### 3. Waiting Strategies

Tests include proper waiting to avoid flakiness:

```typescript
// Wait for specific elements
await page.waitForSelector('.react-flow__node', { timeout: 5000 })

// Wait for animations
await page.waitForTimeout(300)

// Automatic waiting with expect
await expect(page.locator('.element')).toBeVisible()
```

## Common Test Patterns

### Testing Component Visibility

```typescript
test('should display the component', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.component-class')).toBeVisible()
})
```

### Testing Interactions

```typescript
test('should handle click', async ({ page }) => {
  await page.goto('/')
  await page.locator('.button').click()
  await expect(page.locator('.result')).toContainText('Expected Text')
})
```

### Testing State Changes

```typescript
test('should update state', async ({ page }) => {
  await page.goto('/')

  // Initial state
  await expect(page.locator('.button')).not.toHaveClass(/active/)

  // Change state
  await page.locator('.button').click()

  // Verify new state
  await expect(page.locator('.button')).toHaveClass(/active/)
})
```

### Visual Regression Testing

```typescript
test('should match visual snapshot', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.component')

  // Compare against baseline
  await expect(page.locator('.component')).toHaveScreenshot('component.png')
})
```

## Debugging Tests

### Using the Playwright Inspector

```bash
pnpm test:e2e:debug
```

This opens the Playwright Inspector where you can:

- Step through tests line by line
- Inspect the DOM
- View network requests
- See console logs

### Using Headed Mode

```bash
pnpm test:e2e:headed
```

Runs tests with the browser visible so you can see what's happening.

### Using the UI Mode

```bash
pnpm test:e2e:ui
```

Opens an interactive UI where you can:

- Run individual tests
- See test results in real-time
- Time-travel through test execution
- Inspect screenshots and traces

## Visual Regression Testing

### Updating Snapshots

When UI changes are intentional:

```bash
pnpm test:e2e:update-snapshots
```

This updates all baseline screenshots to match the current UI.

### Snapshot Comparison

Playwright compares screenshots pixel-by-pixel:

- Small differences (< 100 pixels) are allowed for anti-aliasing
- Large differences fail the test
- Failed tests generate diff images showing changes

## CI/CD Integration

Tests are configured to:

- Run in headless mode on CI
- Retry failed tests 2 times
- Generate HTML reports
- Capture screenshots and videos on failure

### Environment Variables

- `CI=true` - Enables CI-specific behavior
- Tests detect CI automatically via common CI environment variables

## Best Practices

### 1. Use Data Test IDs for Critical Elements

For stable selectors, consider adding `data-testid` attributes:

```tsx
<div data-testid="power-plant-node">
```

```typescript
await page.locator('[data-testid="power-plant-node"]').click()
```

### 2. Keep Tests Independent

Each test should:

- Start from a known state
- Not depend on other tests
- Clean up after itself

### 3. Use Meaningful Test Names

```typescript
// Good
test('should display error message when city is not connected')

// Bad
test('test 1')
```

### 4. Wait for Dynamic Content

```typescript
// Wait for React Flow to fully render
await page.waitForSelector('.react-flow__node', { timeout: 5000 })
```

### 5. Handle Animations

```typescript
// Wait for CSS transitions
await page.waitForTimeout(300)
```

## AI Coder Integration

### Prompt Examples for AI

**Creating a new test:**

```
Create a Playwright E2E test that:
1. Navigates to the app
2. Clicks on a city node
3. Verifies the component details panel shows the city name
4. Verifies the demand information is displayed
```

**Debugging a failing test:**

```
The test "should select a node and display its details" is failing.
The error shows that the details panel is not updating.
Help me debug this by:
1. Checking the click handler is working
2. Verifying the selector is correct
3. Adding appropriate waits if needed
```

**Adding visual regression tests:**

```
Create visual regression tests for:
1. The mode switcher toolbar
2. The grid canvas with all components
3. The component details panel in selected state
```

## Troubleshooting

### Tests are flaky

- Add explicit waits for animations
- Use `page.waitForLoadState('networkidle')`
- Increase timeout for slow elements

### Elements not found

- Verify the selector using browser DevTools
- Check if element is in an iframe
- Ensure page has loaded: `await page.waitForSelector()`

### Visual tests failing unexpectedly

- Check for animations completing: `await page.waitForTimeout(1000)`
- Update snapshots if changes are intentional
- Increase `maxDiffPixels` threshold if needed

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)
