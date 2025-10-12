# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GridSim is a browser-based electrical grid management simulation game where players balance power generation, transmission infrastructure, and growing demand across a European-style geography. The game teaches real grid management principles through engaging gameplay.

**Technology Stack:**

- TypeScript + React (frontend)
- Canvas rendering: **React Flow** (node-based graph library)
- Client-side only (runs entirely in browser)
- IndexedDB for persistence
- Package manager: pnpm

## Project Structure

```
src/
  simulation/           # Core simulation engine
    engine.ts          # Main simulation loop
    grid.ts            # Grid state & power flow calculations
    physics.ts         # Power flow physics (simplified AC power flow model)
    events.ts          # Time-based events, city spawning
    types.ts           # Shared TypeScript interfaces
    components/        # Grid component models
      powerPlant.ts    # Nuclear, Coal, CCGT, Hydro, Wind, Solar
      city.ts          # Load centers with demand profiles
      transmissionLine.ts  # Lines with voltage levels (400kV, 220kV, 110kV)
      substation.ts    # Voltage transformation
      switchingStation.ts  # Breaker control and routing

  ui/
    components/        # React UI components
    hooks/             # React hooks (useSimulation, etc.)
    canvas/            # Map rendering and interactions

  persistence/
    saveManager.ts     # Save/load to IndexedDB
```

## Core Concepts

### Grid Physics (Simplified AC Power Flow)

- Power flows from generation to load following Kirchhoff's laws
- Voltage drop increases with distance and current load
- Line losses (I²R) increase with distance and load
- Each line has thermal capacity limit (ampacity)
- Circuit breakers trip when capacity exceeded

### Components

1. **Power Plants**: Nuclear, Coal, CCGT, Hydro, Wind, Solar (auto-dispatch in V1)
2. **Cities**: Load centers with time-varying demand (daily + seasonal cycles)
3. **Transmission Lines**: 400kV/220kV/110kV with distance-based losses
4. **Substations**: Voltage transformation with capacity limits
5. **Switching Stations**: Breaker control for routing and protection

### Game Mechanics

- Cities spawn with 7-day warning, must be connected
- Budget system with bankruptcy after 30-day grace period
- Happiness meter (0-100%) affects game over
- Player sets grid-wide electricity price
- Time simulation with adjustable speed (1x to 10x)

## Development Commands

This project uses **pnpm** as the package manager. All commands should be run with pnpm.

### Setup (Future)

```bash
pnpm install            # Install dependencies
pnpm dev                # Start development server
pnpm build              # Production build
pnpm preview            # Preview production build
```

### Testing (Future - using Vitest)

```bash
pnpm test               # Run all tests
pnpm test -- --watch    # Run tests in watch mode
pnpm test -- --coverage # Run tests with coverage report
pnpm test -- <filename> # Run specific test file
```

### Code Quality (Future)

```bash
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint errors
pnpm format             # Run Prettier
pnpm typecheck          # Run TypeScript compiler check
```

## Key Development Guidelines

### Physics Validation

Always validate that power flow calculations satisfy:

- Kirchhoff's current law (sum of power at nodes = 0)
- Voltage drop formulas match electrical engineering principles
- Line losses scale correctly with distance and current
- Cascading failures propagate realistically

### Critical Features for Day 1

The save/load system must be implemented early, as it's critical for testing scenarios without manual replay. Include dev console commands for:

- Spawn city at location
- Add budget
- Fast-forward time
- Set happiness level
- Toggle god mode (disable failures)

### Component Architecture

All grid components implement a common interface pattern:

- Unique ID for persistence
- Location (Point)
- Capacity and current utilization
- Connection to grid topology (node-based graph)

### Simulation Loop

The engine runs on a tick-based system:

1. Update time (delta)
2. Calculate demand for all cities (time-of-day + seasonal)
3. Dispatch generation (auto in V1)
4. Solve power flow (simplified AC model)
5. Check capacity constraints and trip breakers if needed
6. Update budget (revenue from delivered power)
7. Update happiness (based on delivery performance)
8. Process scheduled events (city spawns)

### UI Interaction Modes

The canvas UI operates in distinct modes:

- Select/Pan (default)
- Add Power Plant
- Add Transmission Line (draw between nodes)
- Add Substation
- Add Switching Station

### Data Models

Key TypeScript interfaces are documented in **TechnicalSpec.md** (section 4). All models must be serializable for save/load functionality.

## Testing Scenarios

Implement these test scenarios as save files or dev console presets:

1. **Tutorial**: 1 plant, 1 city disconnected (starting scenario)
2. **Capacity Test**: Grid at 95% utilization
3. **Cascading Failure**: Redundant paths, trip one line
4. **Voltage Drop**: City far from plant without substation
5. **Budget Crisis**: Low funds with new city announcement
6. **Complex Topology**: Multiple plants with switching stations

## V1 Scope

**In Scope:**

- All component types (plants, lines, substations, switching stations)
- Auto-dispatch generation
- City spawning system with progressive difficulty
- Budget and happiness systems
- Geographic routing (manual player drawing)
- Save/load with IndexedDB
- Time simulation with speed control

**Out of Scope (V2+):**

- Variable renewable generation (wind/solar intermittency)
- Weather events
- Maintenance costs
- Energy storage
- Manual generation dispatch
- Full AC power flow with reactive power (use simplified AC model)

## Important Constants (from Design Doc)

### Construction Costs (Indicative)

- Nuclear: €4-6B (1000 MW)
- CCGT: €800M-1.2B (600 MW)
- 400kV line: €1-2M/km
- Substation 400/220kV: €50-80M
- Switching Station: €5-10M

### Transmission Capacity

- 400 kV: 1000-2000 MVA
- 220 kV: 400-800 MVA
- 110 kV: 100-300 MVA

### City Demand Ranges

- Small Town: 20-50 MW
- Medium City: 100-200 MW
- Large City: 500-800 MW
- Major Metro: 2000-5000 MW

## Development Phases

**Phase 0** (UI POC):

- Vite + React + TypeScript project setup with pnpm
- Canvas library integration (Konva recommended)
- Component rendering with mock data
- Interaction modes (select, place, draw lines)
- Information panels
- Visual polish

**Phase 1** (Core Loop):

- Simulation engine with power flow
- Basic UI (map, components, time control)
- Save/load system
- Tutorial scenario

**Phase 2** (Full V1):

- All component types
- City spawning system
- Economy and happiness
- Geographic obstacles
- UI polish

**Phase 3** (Post-V1):

- Variable renewables
- Maintenance costs
- Advanced analytics
- Performance optimization

See **docs/DevelopmentApproach.md** for detailed phase-by-phase implementation plans.

## Documentation Structure

All detailed documentation is located in the **docs/** directory:

- **docs/DesignDoc.md** - High-level game design, mechanics, and progression
- **docs/ComponentReference.md** - All component specifications, capacities, and construction costs
- **docs/PhysicsSpec.md** - Power flow calculations, voltage drop formulas, line losses, and grid protection
- **docs/GeographyAndEconomy.md** - Geographic constraints, time simulation, economy, happiness system, and scoring
- **docs/TechnicalSpec.md** - Technology stack, code structure, data models, API design, and implementation
- **docs/DevelopmentApproach.md** - Phased development plan with detailed deliverables for each phase
- **CLAUDE.md** (this file) - Quick reference for AI assistants

## Quick Reference Links

**Component Specs**: See docs/ComponentReference.md sections 1-5 for detailed specifications of power plants, cities, transmission lines, substations, and switching stations.

**Physics Formulas**: See docs/PhysicsSpec.md sections 2-6 for power flow model, voltage drop, line losses, capacity limits, and grid protection logic.

**Game Mechanics**: See docs/GeographyAndEconomy.md for geographic constraints, time cycles, budget system, happiness mechanics, and scoring formula.

**Implementation Details**: See docs/TechnicalSpec.md for code structure, data models, simulation API, persistence format, and testing approach.
