# GridSim Development Approach

This document outlines the phased development strategy for the European Grid Simulator, with a focus on iterative delivery and learning as you build.

---

## Phase 0: UI Proof of Concept (POC)

**Goal**: Build a functional UI prototype without simulation logic to validate the interface design and get comfortable with React and canvas rendering.

### 0.1 Project Setup

**Deliverables**:

- Initialize Vite + React + TypeScript project with pnpm
- Configure ESLint with strict TypeScript rules (per global CLAUDE.md guidelines)
- Configure Prettier with 120-char line width, single quotes, no semicolons
- Set up Vitest for testing framework
- Configure CI-ready package.json scripts

**Commands**:

```bash
pnpm create vite gridsim --template react-ts
cd gridsim
pnpm install
# Add ESLint, Prettier, Vitest configurations
```

**Files to create**:

- `eslint.config.js` - ESLint configuration with TypeScript strict rules
- `prettier.config.js` - Prettier configuration
- `vitest.config.ts` - Vitest testing configuration
- `tsconfig.json` - Strict TypeScript settings (ES2024, ESNext modules)

### 0.2 Canvas Library Setup

**Decision Made**: **React Flow** (2025-10-12)

**Why React Flow:**

- Grid simulator is a node-based graph (perfect fit)
- Built-in pan/zoom/drag (no manual implementation needed)
- Rapid prototyping (working UI in hours)
- Excellent React integration (stays in React paradigm)
- Sufficient performance for Phase 0 scope

**Installation**:

```bash
pnpm add reactflow
```

**Key Features to Use**:

- Custom node types for power plants, cities, substations, switching stations
- Edges for transmission lines with custom styling
- Built-in controls (zoom, pan, minimap)
- Node dragging for placement
- Edge labels for capacity/utilization

**Deliverable**: Working canvas with React Flow, custom nodes, pan/zoom capability

### 0.3 Mock Data Models

**Deliverables**: TypeScript interfaces for all grid components (matching DesignDoc.md Section 11.4)

**Files to create**:

```
src/
  types/
    components.ts      # PowerPlant, City, TransmissionLine, Substation, SwitchingStation
    grid.ts            # GridState, Point, NodeId
    enums.ts           # PlantType, CitySize, Season
```

**Mock Data**: Create static test data

```typescript
// src/data/mockGrid.ts
export const mockPowerPlants: PowerPlant[] = [...]
export const mockCities: City[] = [...]
export const mockLines: TransmissionLine[] = [...]
```

### 0.4 Canvas Component Rendering

**Deliverables**: Visual representation of all grid components

**Components to render**:

1. **Power Plants** - Different shapes/colors by type (Nuclear, Coal, CCGT, Hydro, Wind, Solar)
2. **Cities** - Size-based visual scaling (Small, Medium, Large, Metro)
3. **Transmission Lines** - Thickness by voltage level (400kV, 220kV, 110kV)
4. **Substations** - Distinct icon showing voltage transformation
5. **Switching Stations** - Junction point icon

**Visual Design Guidelines**:

- Use color coding: green (healthy), yellow (stressed), red (failed)
- Show labels on hover
- Make components draggable for testing (will be locked later)
- Add grid background for reference

**Files to create**:

```
src/
  ui/
    canvas/
      GridCanvas.tsx           # Main canvas component
      components/
        PowerPlantNode.tsx     # Renders power plant
        CityNode.tsx           # Renders city
        TransmissionLine.tsx   # Renders line between nodes
        SubstationNode.tsx     # Renders substation
        SwitchingStationNode.tsx  # Renders switching station
```

### 0.5 Interaction Modes

**Deliverables**: Mode-based interaction system

**Modes to implement**:

1. **Select/Pan Mode** (default)
   - Click to select component
   - Drag to pan canvas
   - Scroll to zoom
   - Show selection highlight

2. **Add Power Plant Mode**
   - Click canvas to place plant
   - Show ghost preview at cursor
   - Display type selector in toolbar

3. **Add City Mode**
   - Click canvas to place city
   - Show ghost preview at cursor
   - Display size selector in toolbar

4. **Add Transmission Line Mode**
   - Click first node (plant/substation/switching station)
   - Drag to show preview line
   - Click second node to complete
   - Validate connections (can't connect city to city)

5. **Add Substation Mode**
   - Click canvas to place substation
   - Show ghost preview at cursor

6. **Add Switching Station Mode**
   - Click canvas to place switching station
   - Show ghost preview at cursor

**Files to create**:

```
src/
  ui/
    components/
      Toolbar.tsx              # Mode selection toolbar
      BuildMenu.tsx            # Component type selection
    hooks/
      useInteractionMode.ts    # State management for modes
      useGridInteraction.ts    # Mouse event handlers
```

### 0.6 Information Panels

**Deliverables**: UI panels showing component and grid information

**Panels to build**:

1. **Grid Status Panel** (always visible)
   - Total generation capacity vs current demand (mock values)
   - Grid-wide utilization % (mock)
   - Number of cities powered / total cities
   - Current budget (mock)
   - Happiness meter (mock)
   - Current electricity price (mock)

2. **Component Details Panel** (shows when component selected)
   - Power plant: type, capacity, current output (mock)
   - City: name, size, demand, power received (mock)
   - Line: voltage level, capacity, utilization (mock)
   - Substation: voltage transformation, capacity (mock)

3. **Time Controls Panel**
   - Play/Pause button (non-functional in POC)
   - Speed selector: 1x, 2x, 5x, 10x (non-functional)
   - Current time/date display (static)
   - Season indicator (static)

**Files to create**:

```
src/
  ui/
    components/
      panels/
        GridStatusPanel.tsx
        ComponentDetailsPanel.tsx
        TimeControlPanel.tsx
```

### 0.7 Visual Polish

**Deliverables**: Professional look and feel

**Tasks**:

- Add CSS styling (use CSS modules or styled-components)
- Implement responsive layout
- Add smooth animations (component placement, selection)
- Add hover effects and tooltips
- Create color scheme matching grid simulator aesthetic
- Add icons for components (can use react-icons or custom SVG)

**Optional Enhancements**:

- Mini-map showing full grid overview
- Animated power flow along lines (decorative only, no logic)
- Grid background with coordinate system

### Phase 0 Success Criteria

✅ Can place all component types on canvas
✅ Can draw transmission lines between nodes
✅ Can select and view component details
✅ Canvas supports pan and zoom
✅ UI feels responsive and polished
✅ All interaction modes work smoothly
✅ Mock data displays correctly in panels

**No simulation logic required** - everything uses static/mock data.

---

## Phase 1: Core Simulation Engine

**Goal**: Implement the physics and simulation engine, then connect it to the existing UI.

### 1.1 Simulation Architecture

**Deliverables**: Core simulation classes and interfaces

**Files to create**:

```
src/
  simulation/
    GridSimulation.ts          # Main simulation class
    engine.ts                  # Simulation loop/ticker
    types.ts                   # Simulation-specific types
```

**GridSimulation API** (from DesignDoc.md Section 11.3):

```typescript
class GridSimulation {
  // State queries
  getState(): GridState
  getComponents(): Component[]
  getPowerFlow(): PowerFlowData
  getMetrics(): GameMetrics

  // Player commands
  addPowerPlant(type: PlantType, location: Point, capacity: number): Result
  addTransmissionLine(from: NodeId, to: NodeId, path: Point[]): Result
  addSubstation(location: Point, voltageIn: number, voltageOut: number): Result
  addSwitchingStation(location: Point): Result
  setBreakerState(stationId: string, breakerId: string, closed: boolean): Result
  setElectricityPrice(pricePerMWh: number): void

  // Time control
  tick(deltaTime: number): void
  pause(): void
  resume(): void
  setSpeed(multiplier: number): void

  // Persistence (Phase 2)
  serialize(): SaveData
  static deserialize(data: SaveData): GridSimulation
}
```

### 1.2 Physics Engine

**Deliverables**: Power flow calculations

**Files to create**:

```
src/
  simulation/
    physics/
      powerFlow.ts             # Simplified AC power flow solver
      voltageCalc.ts           # Voltage drop calculations
      lossCalculations.ts      # I²R losses
      capacityCheck.ts         # Thermal limits and breaker logic
```

**Key Algorithms** (from DesignDoc.md Section 4):

1. **DC Power Flow**:
   - Build admittance matrix from grid topology
   - Solve linear system: P = B × θ (power = susceptance × angle)
   - Distribute power across parallel paths inversely proportional to impedance

2. **Voltage Drop**:
   - ΔV = I × R × distance
   - Voltage threshold: below 95% = reduced delivery
   - Requires substation placement to maintain voltage

3. **Line Losses**:
   - P_loss = I² × R × distance
   - Typical: 2-4% per 100km at high voltage
   - Lower voltage = higher losses for same power

4. **Capacity Limits**:
   - Check each line: currentLoad ≤ capacity (MVA)
   - If exceeded → trip breaker → cascade check on parallel paths

**Testing**: Use the physics validation test scenarios (DesignDoc.md Section 14.3)

### 1.3 Component Models

**Deliverables**: Simulation behavior for each component type

**Files to create**:

```
src/
  simulation/
    components/
      PowerPlant.ts            # Auto-dispatch logic
      City.ts                  # Demand calculation (time-of-day + seasonal)
      TransmissionLine.ts      # Resistance, capacity, breaker state
      Substation.ts            # Voltage transformation, losses
      SwitchingStation.ts      # Breaker control, routing
```

**Key Behaviors**:

1. **Power Plant** (V1: auto-dispatch):
   - Dispatch up to capacity to match total demand
   - No ramp rate limits in V1 (instant response)
   - Priority order: baseload (Nuclear) → intermediate (Coal/CCGT) → peaking (Hydro)

2. **City** (time-varying demand):
   - Base demand × time-of-day multiplier × seasonal multiplier
   - Demand profiles by city type (residential vs industrial)
   - Track power received vs demanded

3. **Transmission Line**:
   - Calculate resistance from distance: R = ρ × length / A
   - Track current load in MVA
   - Breaker logic: trip if currentLoad > capacity

4. **Substation**:
   - Transform voltage: voltageOut = voltageIn × ratio
   - Apply transformation losses: 1-2%
   - Track throughput capacity

### 1.4 Time Simulation

**Deliverables**: Real-time simulation loop

**Implementation**:

```typescript
// src/simulation/engine.ts
class SimulationEngine {
  private lastTickTime: number = 0
  private speedMultiplier: number = 1
  private isPaused: boolean = false

  tick(currentTime: number): void {
    if (this.isPaused) return

    const deltaMs = (currentTime - this.lastTickTime) * this.speedMultiplier
    const deltaMinutes = deltaMs / (1000 * 60)

    // Update simulation
    this.updateTime(deltaMinutes)
    this.updateDemand()
    this.dispatchGeneration()
    this.solvePowerFlow()
    this.checkCapacityLimits()
    this.updateBudget()
    this.updateHappiness()

    this.lastTickTime = currentTime
  }
}
```

**Time Scale**:

- Real-time with adjustable speed (1x, 2x, 5x, 10x)
- Simulation time advances in minutes
- Daily cycle: 24 hours = 1440 minutes
- Seasonal cycle: 4 seasons × 90 days

**Files to create**:

```
src/
  simulation/
    time/
      TimeManager.ts           # Time tracking and speed control
      DemandProfile.ts         # Time-of-day and seasonal curves
```

### 1.5 React Integration

**Deliverables**: Connect simulation to UI components

**Hook for simulation access**:

```typescript
// src/ui/hooks/useSimulation.ts
export function useSimulation() {
  const [simulation] = useState(() => new GridSimulation())
  const [gridState, setGridState] = useState<GridState>(simulation.getState())

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = performance.now()
      simulation.tick(currentTime)
      setGridState(simulation.getState())
    }, 16) // 60 FPS

    return () => clearInterval(interval)
  }, [simulation])

  return { simulation, gridState }
}
```

**Update UI components**:

- Replace mock data with `gridState` from simulation
- Wire up interaction handlers to simulation commands
- Update panels to show real-time data
- Add visual feedback for component states (active/stressed/failed)

### Phase 1 Success Criteria

✅ Power flows from plants to cities following physics
✅ Voltage drop calculated correctly over distance
✅ Line losses increase with distance and load
✅ Circuit breakers trip when capacity exceeded
✅ Time advances with controllable speed
✅ City demand varies by time of day
✅ UI displays real-time simulation data
✅ All interaction modes modify simulation state

---

## Phase 2: Full V1 Features

**Goal**: Complete game mechanics and make it playable.

### 2.1 City Spawning System

**Deliverables**: Progressive difficulty with city announcements

**Files to create**:

```
src/
  simulation/
    events/
      EventQueue.ts            # Time-based event scheduling
      CitySpawner.ts           # City announcement logic
```

**Spawn Logic** (from DesignDoc.md Section 9.2):

- Announce city 7 days (168 hours) before activation
- Show marker on map with countdown timer
- Player must connect before deadline
- Happiness penalty if not connected on time

**Difficulty Progression** (from DesignDoc.md Section 9.3):

- Early game: 1 small city every 10-15 days
- Mid game: 1 medium city every 5-7 days
- Late game: Multiple large cities per week

**UI Updates**:

- Add announcement notification system
- Show countdown timers on map
- Alert when deadline approaching

### 2.2 Economy System

**Deliverables**: Budget, revenue, and pricing

**Files to create**:

```
src/
  simulation/
    economy/
      BudgetManager.ts         # Track budget, revenue, expenses
      PricingSystem.ts         # Electricity pricing effects
```

**Budget Mechanics** (from DesignDoc.md Section 7):

- Starting budget: €50M
- Revenue: electricity price × MWh delivered
- Expenses: construction costs (one-time, instant)
- Bankruptcy: budget negative for 30 days → game over

**Pricing Effects**:

- Low price (€20-40/MWh): higher happiness gain, lower profit
- Medium price (€50-80/MWh): balanced
- High price (€100+/MWh): lower happiness gain, higher profit

**UI Updates**:

- Add electricity price slider/input
- Show budget trend graph (optional)
- Show construction cost preview before building
- Add bankruptcy warning alerts

### 2.3 Happiness System

**Deliverables**: Happiness meter with gain/loss mechanics

**Files to create**:

```
src/
  simulation/
    happiness/
      HappinessManager.ts      # Track happiness, calculate changes
```

**Happiness Mechanics** (from DesignDoc.md Section 8):

- Range: 0-100%
- Gains: steady power delivery (rate modified by price)
- Losses: blackouts (severity × duration), unconnected cities
- Game over at 0%

**UI Updates**:

- Prominent happiness meter display
- Visual feedback when happiness changes
- Alerts when happiness critical (<20%)

### 2.4 Geographic Obstacles

**Deliverables**: Terrain constraints affecting line routing

**Files to create**:

```
src/
  simulation/
    geography/
      ObstacleMap.ts           # Terrain obstacles (mountains, water, protected areas)
      PathValidator.ts         # Check if line path is valid
      CostCalculator.ts        # Apply terrain cost multipliers
```

**Obstacle Types** (from DesignDoc.md Section 5.2):

- Mountains: impassable, must route around
- Water bodies: submarine cables (4-6× cost)
- Protected areas: impassable
- Urban areas: underground (3-4× cost)

**UI Updates**:

- Render obstacles on map
- Show path validation feedback when drawing lines
- Display adjusted cost with terrain multipliers

### 2.5 Save/Load System

**Deliverables**: Persistence with IndexedDB

**Files to create**:

```
src/
  persistence/
    SaveManager.ts             # Save/load to IndexedDB
    serialization.ts           # Serialize/deserialize GridState
```

**Save Format** (from DesignDoc.md Section 11.5):

```typescript
interface SaveData {
  version: string
  timestamp: string
  gridState: GridState
  eventQueue: ScheduledEvent[]
  playerStats: PlayerStats
}
```

**Features**:

- Auto-save every 5 minutes
- Manual save/load via UI
- Multiple save slots (3-5)
- Export/import as JSON file

**UI Updates**:

- Add save/load menu
- Show save slot metadata (date, cities powered, etc.)
- Confirm before overwriting save

### 2.6 Tutorial Scenario

**Deliverables**: Starting scenario with basic guidance

**Tutorial Flow** (from DesignDoc.md Section 9.1):

1. Start with 1 power plant (CCGT default 600 MW) and 1 small city (30 MW) disconnected
2. Prompt player to draw transmission line
3. Show power flowing to city
4. Display revenue generation
5. Announce second city
6. Guide player through expansion

**Files to create**:

```
src/
  simulation/
    scenarios/
      TutorialScenario.ts      # Initial game state
      ScenarioLoader.ts        # Load predefined scenarios
```

**UI Updates**:

- Add tutorial tooltip/overlay system
- Highlight relevant UI elements
- Track tutorial progress
- Allow skipping tutorial

### 2.7 Dev Console (Critical)

**Deliverables**: Debug commands for testing

**Commands** (from DesignDoc.md Section 14.1):

```
/spawn-city <x> <y> <size>     # Spawn city at location
/add-budget <amount>            # Add money
/fast-forward <minutes>         # Skip time
/set-happiness <value>          # Set happiness level
/god-mode                       # Toggle failure immunity
/save-scenario <name>           # Save current state as test scenario
```

**Files to create**:

```
src/
  dev/
    DevConsole.tsx             # Console UI component
    commands.ts                # Command handlers
```

**UI**: Toggle with ` (backtick) key

### 2.8 UI Polish

**Deliverables**: Professional game experience

**Polish Tasks**:

- Smooth animations for component placement
- Animated power flow along lines
- Color transitions for component states
- Sound effects (optional)
- Particle effects for blackouts/failures (optional)
- Loading screen
- Game over screen with stats
- Main menu with new game / load game

### Phase 2 Success Criteria

✅ Cities spawn progressively with difficulty scaling
✅ Budget system works with revenue and bankruptcy
✅ Happiness system affects game over
✅ Can save and load games
✅ Tutorial teaches basic mechanics
✅ Geographic obstacles constrain routing
✅ Dev console enables fast testing
✅ Game feels polished and playable
✅ Complete game loop: start → play → game over

---

## Phase 3: Post-V1 Enhancements

**Goal**: Add advanced features and optimize performance.

### 3.1 Variable Renewables

**Deliverables**: Wind and solar with intermittent generation

**Features**:

- Weather system (wind speed, cloud cover)
- Generation forecasting
- Balancing challenges with intermittent sources

**Files to create**:

```
src/
  simulation/
    renewables/
      WeatherSystem.ts         # Weather patterns
      WindGeneration.ts        # Wind turbine output by weather
      SolarGeneration.ts       # Solar panel output by weather/time
```

### 3.2 Maintenance Costs

**Deliverables**: Ongoing operational expenses

**Features**:

- Maintenance costs per component (€/month)
- Equipment aging and degradation
- Repair/upgrade decisions

### 3.3 Advanced Analytics

**Deliverables**: Performance insights dashboard

**Features**:

- Historical graphs (demand, generation, revenue)
- Efficiency metrics (losses %, uptime %)
- Component utilization heatmap
- Cascading failure analysis

### 3.4 Performance Optimization

**Deliverables**: Support for large grids (50+ cities)

**Tasks**:

- Optimize power flow algorithm (sparse matrix solver)
- Canvas rendering optimization (culling, LOD)
- Web Worker for simulation (off main thread)
- Reduce re-renders in React components

---

## Key Technology Decisions

### Canvas Library: Konva (react-konva)

- **Pros**: React integration, moderate performance, easier learning curve
- **Cons**: May need to switch to PixiJS for very large grids
- **Switch threshold**: If rendering >100 components causes lag

### State Management: useState + Context (Phase 0-1)

- **Pros**: Simple, built-in, sufficient for initial development
- **Upgrade to Zustand/Redux**: If state management becomes complex in Phase 2

### Testing Strategy:

- **Unit tests**: Physics calculations, component logic
- **Integration tests**: Simulation scenarios (from DesignDoc.md Section 14.2)
- **E2E tests**: UI interactions (place component, draw line)
- **Target coverage**: 90% (per global CLAUDE.md guidelines)

### CI/CD:

- **GitHub Actions**: Run linter, tests, build on PR
- **Pre-commit hooks**: Linter + tests (Husky + lint-staged)
- **Deploy**: GitHub Pages or Vercel (static site)

---

## Development Tips

### Learning React (for Phase 0)

Since you mentioned basic React knowledge, here are key concepts to focus on:

1. **useState**: Managing component state

   ```typescript
   const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
   ```

2. **useEffect**: Side effects and subscriptions

   ```typescript
   useEffect(() => {
     // Subscribe to simulation updates
     const unsubscribe = simulation.subscribe(setGridState)
     return unsubscribe // Cleanup
   }, [simulation])
   ```

3. **Custom Hooks**: Reusable logic

   ```typescript
   function useInteractionMode() {
     const [mode, setMode] = useState<InteractionMode>('select')
     return { mode, setMode }
   }
   ```

4. **Context**: Share state across components (optional, can wait until needed)

### React + Canvas Tips

**Option 1: react-konva (Recommended)**

```typescript
import { Stage, Layer, Circle, Line } from 'react-konva'

function GridCanvas() {
  return (
    <Stage width={1200} height={800}>
      <Layer>
        <Circle x={100} y={100} radius={20} fill="blue" />
        <Line points={[100, 100, 200, 200]} stroke="black" />
      </Layer>
    </Stage>
  )
}
```

**Option 2: PixiJS (Advanced)**

- More imperative, less React-like
- Use if performance is critical

**Option 3: React Flow (Node-based)**

- Great for quick prototypes
- Less control over rendering

### Recommended Reading

- React docs: https://react.dev/learn
- react-konva docs: https://konvajs.org/docs/react/
- TypeScript handbook: https://www.typescriptlang.org/docs/handbook/

---

## Timeline Estimates

**Phase 0 (UI POC)**: 2-3 weeks (learning React + canvas)
**Phase 1 (Core Simulation)**: 3-4 weeks (physics + integration)
**Phase 2 (Full V1)**: 4-6 weeks (game mechanics + polish)
**Phase 3 (Enhancements)**: Ongoing

**Total to V1 completion**: ~2-3 months part-time

---

## Next Steps

1. ✅ Create this DevelopmentApproach.md document
2. ⏭️ Set up Phase 0.1: Project initialization with Vite + pnpm
3. ⏭️ Choose canvas library and create basic canvas with pan/zoom
4. ⏭️ Implement mock data models
5. ⏭️ Build component rendering

**Ready to start?** Begin with Phase 0.1 when you're ready to code!
