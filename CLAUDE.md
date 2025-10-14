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

1. **Power Plants**: Nuclear, Coal, CCGT, Hydro, Wind, Solar (auto-dispatch in V1) - Output at 400kV
2. **Cities**: Load centers with time-varying demand (daily + seasonal cycles) - Connect at 110kV, may require multiple connections for high demand
3. **Transmission Lines**: 400kV/220kV/110kV with distance-based losses - Voltage auto-determined by endpoints
4. **Grid Substations (400/220kV)**: Step down from transmission to sub-transmission (€50-80M)
5. **Zone Substations (220/110kV)**: Step down to distribution voltage for cities (€20-40M)
6. **Switching Stations**: Breaker control for routing and protection (€5-10M)
7. **Pylons**: Structural support for long-distance lines, support multiple lines (€0.5-1M, 4-line capacity)

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
- Add Power Plant (outputs 400kV)
- Add City (accepts 110kV connections)
- Add Transmission Line (voltage auto-determined by endpoints, no user choice)
- Add Grid Substation (400→220kV transformation)
- Add Zone Substation (220→110kV transformation)
- Add Switching Station (same-voltage routing)
- Add Pylon (Phase 1 - structural support for long lines)

### UI Placement Mechanics (Phase 0)

**Snap-to-Grid:**

- Grid size: 50 pixels (configurable)
- All component placements snap to nearest grid intersection
- Optional grid overlay (toggle on/off)
- Applies to: All nodes (plants, cities, substations, switching stations, pylons)
- Lines connect to snapped positions (no snap for line paths)

**Collision Detection:**

- **Node Overlap**: Components cannot occupy same grid position or have overlapping bounding boxes
- **Visual Feedback**: Green outline = valid placement, Red outline = collision detected
- **Drag Behavior**: Component follows cursor with snap-to-grid, snaps back if dropped on occupied position
- **Bounding Boxes**: Power plant/metro (80px), large city (70px), medium city (60px), substations (60/50px), switching station (40px), pylon (30px), small city (50px)
- **Phase 0 Enforcement**: Node collisions blocked, line crossings allowed with visual warning

**Line Crossing (Phase 0 - Visual Warning Only):**

- Lines CAN cross each other (no enforcement in Phase 0 UI)
- Yellow warning indicator shown at crossing points
- Tooltip: "Transmission lines should not cross - consider rerouting with pylons"
- Full enforcement deferred to Phase 1 (requires pathfinding + auto-pylon logic)

**Component Size Reference:**

| Component         | Size (px) | Notes                   |
| ----------------- | --------- | ----------------------- |
| Power Plant       | 80×80     | Largest node            |
| City (Metro)      | 80×80     | Same as power plant     |
| City (Large)      | 70×70     | Scales with size        |
| City (Medium)     | 60×60     |                         |
| City (Small)      | 50×50     |                         |
| Grid Substation   | 60×60     | Square footprint        |
| Zone Substation   | 50×50     | Smaller than grid sub   |
| Switching Station | 40×40     | Smallest infrastructure |
| Pylon             | 30×30     | Minimal footprint       |

### Voltage Architecture (Critical Design Rule)

**Three-tier deterministic voltage system:**

```
Tier 1: Transmission (400kV)
Power Plant (400kV) → 400kV lines → Grid Substation input

Tier 2: Sub-Transmission (220kV)
Grid Substation output → 220kV lines → Zone Substation input

Tier 3: Distribution (110kV)
Zone Substation output → 110kV lines → City
```

**Key Rules:**

1. **No voltage choice**: Line voltage is ALWAYS auto-determined by source/target nodes
2. **No skipping levels**: Cannot connect 400kV plant directly to city
3. **Fixed component voltages**:
   - Power plants output: 400kV (fixed)
   - Grid substations: 400kV input → 220kV output (fixed)
   - Zone substations: 220kV input → 110kV output (fixed)
   - Cities input: 110kV (fixed)
4. **110kV capacity limit**: Each 110kV line maxes at ~300 MW
5. **Multi-connection cities**: Large cities (>300 MW demand) require multiple 110kV lines

### Pylon and Distance Constraints

**Maximum line spans without intermediate support:**

- 400kV lines: 100 km max span
- 220kV lines: 75 km max span
- 110kV lines: 50 km max span

**Long-distance lines require pylons:**

- Pylons provide structural support (no electrical function)
- Can carry 4 lines (default), upgradeable to 6-8 (Phase 2)
- Auto-placed when drawing lines >max span (Phase 1)
- Multiple lines can share same pylons (cost savings)

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
- 220kV line: €600k-1M/km
- 110kV line: €300-500k/km
- Grid Substation (400/220kV): €50-80M
- Zone Substation (220/110kV): €20-40M
- Switching Station: €5-10M
- Pylon: €0.5-1M (4-line capacity)

### Transmission Capacity

- 400 kV: 1000-2000 MVA
- 220 kV: 400-800 MVA
- 110 kV: 100-300 MVA (⚠️ ~300 MW per line limit)

### City Demand Ranges & Connection Requirements

- Small Town: 20-50 MW (1 × 110kV line)
- Medium City: 100-200 MW (1-2 × 110kV lines)
- Large City: 500-800 MW (3-4 × 110kV lines)
- Major Metro: 2000-5000 MW (10-20 × 110kV lines)

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

### Core Design Documents

- **docs/DesignDoc.md** - High-level game design, mechanics, and progression
- **docs/PhysicsSpec.md** - Power flow calculations, voltage drop formulas, line losses, and grid protection
- **docs/GeographyAndEconomy.md** - Geographic constraints, time simulation, economy, happiness system, and scoring
- **docs/TechnicalSpec.md** - Technology stack, code structure, data models, API design, and implementation
- **docs/DevelopmentApproach.md** - Phased development plan with detailed deliverables for each phase

### Component Reference (Modular)

- **docs/ComponentReference.md** - Index to all component specifications
- **docs/PowerPlants.md** - Generation sources (Nuclear, CCGT, Hydro, Wind, Solar)
- **docs/Cities.md** - Load centers with demand specs and multi-connection requirements
- **docs/TransmissionLines.md** - 400kV/220kV/110kV lines with voltage rules
- **docs/Substations.md** - Grid (400→220) and Zone (220→110) voltage transformation
- **docs/SwitchingStations.md** - Routing and breaker control
- **docs/Pylons.md** - Long-distance transmission support
- **docs/UISpecification.md** - Snap-to-grid, collision detection, placement mechanics
- **docs/GameplayGuide.md** - Strategic guidance, common mistakes, tutorial progression

### AI Assistant Reference

- **CLAUDE.md** (this file) - Quick reference for AI assistants

## Quick Reference Links

**Component Specs**: See docs/ComponentReference.md (index), or individual component files for detailed specs:

- docs/PowerPlants.md - All generation types with costs and characteristics
- docs/Cities.md - Demand specs and 110kV multi-connection requirements
- docs/TransmissionLines.md - Voltage levels, distance constraints, auto-determined voltage
- docs/Substations.md - Grid (400→220) and Zone (220→110) voltage cascade
- docs/SwitchingStations.md - Routing, breaker control, N-1 redundancy
- docs/Pylons.md - Long-distance support, multi-line capacity

**UI Mechanics**: See docs/UISpecification.md for snap-to-grid, collision detection, and placement rules

**Strategy Guide**: See docs/GameplayGuide.md for component selection, strategic principles, common mistakes

**Physics Formulas**: See docs/PhysicsSpec.md sections 2-6 for power flow model, voltage drop, line losses, capacity limits, and grid protection logic

**Game Mechanics**: See docs/GeographyAndEconomy.md for geographic constraints, time cycles, budget system, happiness mechanics, and scoring formula

**Implementation Details**: See docs/TechnicalSpec.md for code structure, data models, simulation API, persistence format, and testing approach
