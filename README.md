# GridSim - Electrical Grid Management Simulation

A browser-based electrical grid management simulation game where players balance power generation, transmission infrastructure, and growing demand across a European-style geography. The game teaches real grid management principles through engaging gameplay.

## Phase 0 - UI Proof of Concept ✅

This is the Phase 0 implementation, focusing on the foundational UI components and visual design using React Flow for canvas rendering.

## Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Canvas Rendering**: React Flow (node-based graph library)
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Linting**: ESLint with strict TypeScript + React best practices
- **Formatting**: Prettier
- **Unit Testing**: Vitest
- **E2E Testing**: Playwright with visual regression
- **Type Checking**: TypeScript strict mode

## Project Structure

```
src/
  simulation/           # Core simulation engine (stub interfaces for Phase 0)
    types.ts           # Shared TypeScript interfaces
  ui/
    components/        # React UI components
      nodes/          # Custom React Flow nodes (PowerPlant, City, Substation, SwitchingStation)
      edges/          # Custom React Flow edges (TransmissionLine)
      panels/         # Information panels (GridStatus, ComponentDetails, TimeControl)
      toolbar/        # Mode switcher toolbar
      canvas/         # Main GridCanvas component
    hooks/            # React hooks (useInteractionMode, useSelection)
    utils/            # Utility functions (colors)
  types/              # TypeScript type definitions
  data/               # Mock data for testing
```

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm (v10.10.0 or higher)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Run unit tests (Vitest)
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage

# Run E2E tests (Playwright)
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Debug E2E tests
pnpm test:e2e:debug

# View E2E test report
pnpm test:e2e:report
```

### Build

```bash
# Production build
pnpm build

# Preview production build
pnpm preview
```

## Phase 0 Features

### ✅ Implemented

- **Project Setup**: Vite + React + TypeScript with pnpm
- **Code Quality**: ESLint, Prettier, Vitest, pre-commit hooks
- **Canvas Integration**: React Flow with zoom and pan controls
- **UI Polish**: Snap-to-grid (50px) and collision detection for clean component placement
- **Custom Node Types**:
  - Power Plants (Nuclear, Coal, CCGT, Hydro, Wind, Solar) - 400kV output
  - Cities (with demand display, multi-connection support) - 110kV input
  - Grid Substations (400→220kV transformation)
  - Zone Substations (220→110kV transformation)
  - Switching Stations (breaker control, same-voltage routing)
  - Pylons (structural support for long-distance lines, 4-line capacity)
- **Custom Edge Type**: Transmission Lines (400kV/220kV/110kV with voltage-based visual styling)
- **Interaction Modes**:
  - Select/Pan (default)
  - Add Power Plant
  - Add City
  - Add Transmission Line
  - Add Substation
  - Add Switching Station
- **Information Panels**:
  - Grid Status (budget, happiness, generation, demand) - in canvas footer
  - Component Details (selected component info) - in left sidebar
  - Time Control (in header with glassmorphism styling)
- **UI Layout**:
  - Header with title and time controls
  - Left sidebar with mode switcher and component details
  - Central canvas area with React Flow
  - Canvas footer with 8 grid status metrics in single row
- **Visual Polish**: Clean UI with color coding, smooth animations, and glassmorphism effects
- **Voltage Visualization**: Lines rendered with different colors/thickness by voltage (400kV=thick red, 220kV=medium blue, 110kV=thin green)
- **Placement Mechanics**:
  - Snap-to-grid (50px) for all component placements
  - Collision detection prevents node overlap
  - Visual feedback (green/red outlines) during placement
  - Line crossing warnings (Phase 0 visual hint, Phase 1 enforcement)

### Mock Data

The Phase 0 implementation includes comprehensive mock data demonstrating:

- 3 power plants (Nuclear, CCGT, Wind) at 400kV
- 3 cities (Berlin, Hamburg, Dresden) with 110kV connections
- Transmission lines at multiple voltages (400kV, 220kV, 110kV)
- Grid substation (400→220kV) and Zone substation (220→110kV)
- Switching station for routing
- Pylons supporting long-distance lines

## Key Components

### GridCanvas

Main canvas component using React Flow for rendering the electrical grid as a node-based graph.

**Location**: `src/ui/components/canvas/GridCanvas.tsx`

### Custom Nodes

- **PowerPlantNode**: Displays plant type, capacity, output, and utilization (400kV output)
- **CityNode**: Shows city name, size, demand, power delivery status, and connection points (110kV input)
- **GridSubstationNode**: Indicates 400→220kV voltage transformation and load
- **ZoneSubstationNode**: Indicates 220→110kV voltage transformation and load
- **SwitchingStationNode**: Displays breaker status and connected lines
- **PylonNode**: Shows line capacity utilization (e.g., "2/4 lines")

**Location**: `src/ui/components/nodes/`

### Custom Edges

- **TransmissionLineEdge**: Shows voltage level and current load percentage with voltage-based styling
  - 400kV: Thick (4px) red/dark lines
  - 220kV: Medium (3px) blue lines
  - 110kV: Thin (2px) green lines

**Location**: `src/ui/components/edges/`

### Information Panels

- **GridStatusPanel**: Overview of 8 grid metrics displayed in canvas footer (generation, demand, budget, happiness, price, utilization, cities powered, uptime)
- **ComponentDetailsPanel**: Detailed information for selected components, shown in left sidebar below mode switcher
- **TimeControlPanel**: Time display and controls in header with glassmorphism styling (play/pause/speed controls placeholder for Phase 1)

**Location**: `src/ui/components/panels/`

## Development Guidelines

### Code Style

- **Target**: ES2024 with ESNext modules
- **TypeScript**: Strict mode with all strict options enabled
- **Formatting**: Single quotes, no semicolons, 2 spaces indentation, 120 char line width
- **Files**: Aim for files <100 lines for separation of concerns
- **Linting**: Comprehensive ruleset enforced:
  - TypeScript strict rules (no-explicit-any, explicit-function-return-type, strict-boolean-expressions)
  - React best practices (hooks rules, component patterns, JSX formatting)
  - React Hooks rules (rules-of-hooks, exhaustive-deps)
  - Accessibility (jsx-a11y for a11y compliance)
  - Performance (no-unstable-nested-components, no-constructed-context-values)

### Git Workflow

- Create feature branches for new work (`git checkout -b feature/my-feature`)
- Run linting and type checking before commits (automated via pre-commit hooks)
- Create pull requests for review before merging

## Next Steps (Phase 1)

Phase 1 will implement the core simulation loop:

- Simulation engine with power flow calculations
- Time-based simulation with adjustable speed
- Save/load system with IndexedDB
- Tutorial scenario

See `docs/DevelopmentApproach.md` for detailed phase-by-phase plans.

## Testing

### Unit Tests (Vitest)

Unit tests for individual components and utilities using Vitest and React Testing Library.

### E2E Tests (Playwright)

Comprehensive end-to-end tests covering:

- Full application flow and user interactions
- Component rendering and state management
- Visual regression testing with screenshots
- Cross-browser compatibility

**Test Categories:**

- `e2e/app.spec.ts` - Core application functionality

## Recent Progress (Phase 0)

**Latest Updates (2025-01-13):**

- **Enhanced E2E Test Suite**: Comprehensive line drawing tests with voltage cascade coverage (14 tests for 400kV→220kV→110kV connections) - see commit b43e5ea, e61ef91
- **Code Refactoring**: Created 7 utility modules for better separation of concerns, reducing file sizes by 26-73% - see commit 15b5d34
- **UI Improvements**: 24-hour time format (DD/MM/YYYY), moved placement buffer control below details panel - see commits aaede94, 536ce85
- **CI/CD Ready**: Playwright configured for automated pipelines (no auto-open server) - see commit b11b39e
- **Test Coverage**: 4 unit tests (Vitest), 59 E2E tests (Playwright) - 58 passing, 1 skipped
- **Performance**: RAF-batched mouse-move updates, shallow-equality guards to reduce edge re-renders
- **UX Polish**: Edge labels with `pointer-events: none` to prevent hover flicker

**Phase 0 Status**: ✅ **SUBSTANTIALLY COMPLETE** - All 7 success criteria met. See [docs/phase-0_status.md](./docs/phase-0_status.md) for comprehensive project status.

**E2E Test Suites:**

- `e2e/app.spec.ts` - Core application functionality (19 tests)
- `e2e/interactions.spec.ts` - User interactions and component selection (9 tests)
- `e2e/placement.spec.ts` - Snap-to-grid and placement (7 tests)
- `e2e/collision.spec.ts` - Collision detection (4 tests)
- `e2e/visual.spec.ts` - Visual regression tests (3 tests)
- `e2e/line-drawing.spec.ts` - Transmission line drawing with voltage cascade (14 tests)
- `e2e/line-labels.spec.ts` - Edge label hover behavior (3 tests)
- `e2e/node-move.spec.ts` - Drag and drop persistence (3 tests)
- `e2e/edge-render-debug.spec.ts` - Performance debugging (1 test, skipped)

See [E2E_TESTING.md](./E2E_TESTING.md) for detailed testing guide.

**Key Features:**

- AI-friendly test structure and naming
- Automatic browser management
- Screenshot and video capture on failure
- Interactive debugging with Playwright Inspector
- Visual regression testing with baseline comparisons

## Documentation

Comprehensive documentation is available in the `docs/` directory:

### Core Design

- **DesignDoc.md**: High-level game design and mechanics
- **PhysicsSpec.md**: Power flow calculations and grid physics
- **GeographyAndEconomy.md**: Geographic constraints and economy
- **TechnicalSpec.md**: Technical implementation details
- **DevelopmentApproach.md**: Phased development plan

### Component Reference (Modular)

- **ComponentReference.md**: Index to all component specifications
- **PowerPlants.md**: Generation sources (Nuclear, CCGT, Hydro, Wind, Solar)
- **Cities.md**: Load centers with 110kV multi-connection requirements
- **TransmissionLines.md**: 400kV/220kV/110kV voltage levels
- **Substations.md**: Grid (400→220) and Zone (220→110) transformation
- **SwitchingStations.md**: Routing and breaker control
- **Pylons.md**: Long-distance transmission support
- **UISpecification.md**: Snap-to-grid and collision detection
- **GameplayGuide.md**: Strategic guidance and tutorial progression

### AI Assistant Reference

- **CLAUDE.md**: AI assistant guidance

## License

ISC
