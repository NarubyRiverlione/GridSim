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
- **Custom Node Types**:
  - Power Plants (Nuclear, Coal, CCGT, Hydro, Wind, Solar)
  - Cities (with demand display)
  - Substations (voltage transformation)
  - Switching Stations (breaker control)
- **Custom Edge Type**: Transmission Lines (with voltage and load display)
- **Interaction Modes**:
  - Select/Pan (default)
  - Add Power Plant
  - Add City
  - Add Transmission Line
  - Add Substation
  - Add Switching Station
- **Information Panels**:
  - Grid Status (budget, happiness, generation, demand)
  - Component Details (selected component info)
  - Time Control (placeholder for Phase 1)
- **Visual Polish**: Clean UI with color coding and smooth animations

### Mock Data

The Phase 0 implementation includes comprehensive mock data demonstrating:

- 3 power plants (Nuclear, CCGT, Wind)
- 3 cities (Berlin, Hamburg, Dresden)
- 3 transmission lines
- 1 substation
- 1 switching station

## Key Components

### GridCanvas

Main canvas component using React Flow for rendering the electrical grid as a node-based graph.

**Location**: `src/ui/components/canvas/GridCanvas.tsx`

### Custom Nodes

- **PowerPlantNode**: Displays plant type, capacity, output, and utilization
- **CityNode**: Shows city name, size, demand, and power delivery status
- **SubstationNode**: Indicates voltage transformation and load
- **SwitchingStationNode**: Displays breaker status and connected lines

**Location**: `src/ui/components/nodes/`

### Custom Edges

- **TransmissionLineEdge**: Shows voltage level and current load percentage

**Location**: `src/ui/components/edges/`

### Information Panels

- **GridStatusPanel**: Overview of grid metrics (generation, demand, budget, happiness)
- **ComponentDetailsPanel**: Detailed information for selected components
- **TimeControlPanel**: Placeholder for time simulation controls (Phase 1)

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
- `e2e/interactions.spec.ts` - User interactions and component selection
- `e2e/visual.spec.ts` - Visual regression tests

See [E2E_TESTING.md](./E2E_TESTING.md) for detailed testing guide.

**Key Features:**

- AI-friendly test structure and naming
- Automatic browser management
- Screenshot and video capture on failure
- Interactive debugging with Playwright Inspector
- Visual regression testing with baseline comparisons

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **DesignDoc.md**: High-level game design and mechanics
- **ComponentReference.md**: Component specifications and costs
- **PhysicsSpec.md**: Power flow calculations and grid physics
- **GeographyAndEconomy.md**: Geographic constraints and economy
- **TechnicalSpec.md**: Technical implementation details
- **DevelopmentApproach.md**: Phased development plan
- **CLAUDE.md**: AI assistant guidance

## License

ISC
