# GridSim - Technical Specification

This document covers the technical architecture, implementation details, and development approach.

---

## 1. Technology Stack

- **Frontend**: TypeScript + React
- **Rendering**: **React Flow** (chosen for Phase 0)
  - Node-based graph library, perfect fit for grid topology
  - Built-in pan/zoom, node dragging, edge routing
  - Rapid prototyping, excellent React integration
  - Can migrate to Konva/PixiJS later if more visual control needed
- **Architecture**: Client-side only, runs entirely in browser
- **Persistence**: IndexedDB for save games
- **Package Manager**: pnpm
- **Testing**: Vitest
- **Linting**: ESLint with TypeScript strict rules
- **Formatting**: Prettier

---

## 2. Code Structure

```
src/
  simulation/
    engine.ts          # Core simulation loop
    grid.ts            # Grid state & power flow
    components/
      powerPlant.ts
      city.ts
      transmissionLine.ts
      substation.ts
      switchingStation.ts
    physics.ts         # Power flow calculations
    events.ts          # Time-based events, city spawning
    types.ts           # Shared TypeScript types

  ui/
    components/        # React components
    hooks/             # useSimulation hook
    canvas/            # Map rendering

  persistence/
    saveManager.ts     # Save/load from IndexedDB
```

---

## 3. Simulation API

### GridSimulation Class

The main simulation class provides a clean API for the UI to interact with the simulation engine.

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

  // Persistence
  serialize(): SaveData
  static deserialize(data: SaveData): GridSimulation
}
```

---

## 4. Data Models

### GridState

```typescript
interface GridState {
  currentTime: DateTime
  season: Season
  budget: number
  happiness: number
  electricityPrice: number
  components: {
    plants: PowerPlant[]
    cities: City[]
    lines: TransmissionLine[]
    substations: Substation[]
    switchingStations: SwitchingStation[]
  }
  metrics: GameMetrics
}
```

### PowerPlant

```typescript
interface PowerPlant {
  id: string
  type: PlantType
  location: Point
  capacity: number // MW
  currentOutput: number // MW
  rampRate: number // MW per minute
  buildCost: number
}
```

### City

```typescript
interface City {
  id: string
  name: string
  location: Point
  size: CitySize
  baseDemand: number // MW
  currentDemand: number // MW (varies with time)
  powerReceived: number // MW (may be less than demand)
  demandProfile: DemandProfile
  connected: boolean
}
```

### TransmissionLine

```typescript
interface TransmissionLine {
  id: string
  from: NodeId
  to: NodeId
  path: Point[] // routing around obstacles
  voltage: number // kV
  capacity: number // MVA
  currentLoad: number // MVA
  resistance: number // based on distance
  distance: number // km
  breakerClosed: boolean
  breakerTripped: boolean
}
```

### Substation

```typescript
interface Substation {
  id: string
  location: Point
  voltageIn: number // kV
  voltageOut: number // kV
  capacity: number // MVA
  currentLoad: number // MVA
  losses: number // % per transformation
  breakers: Breaker[]
}
```

### SwitchingStation

```typescript
interface SwitchingStation {
  id: string
  location: Point
  breakers: Breaker[]
  connectedLines: string[] // line IDs
}
```

---

## 5. Persistence Format

### SaveData

```typescript
interface SaveData {
  version: string
  timestamp: string
  gridState: GridState
  eventQueue: ScheduledEvent[]
  playerStats: {
    citiesPowered: number
    totalUptime: number
    totalRevenue: number
    blackoutCount: number
  }
}
```

### Save Options

- Auto-save to IndexedDB every 5 minutes
- Manual save/load via UI
- Multiple save slots
- Export/import as JSON file for backup/sharing

---

## 6. Development Phases

### Phase 0 (UI POC)

- Vite + React + TypeScript project setup
- Canvas library integration
- Component rendering with mock data
- Interaction modes (select, place, draw lines)
- Information panels
- Visual polish

**See DevelopmentApproach.md for detailed Phase 0 plan.**

### Phase 1 (Core Loop)

- Simulation engine with power flow
- Basic UI (map, components, time control)
- Save/load system (critical for testing)
- Tutorial scenario

### Phase 2 (Full V1)

- All component types
- City spawning system
- Economy and happiness
- Geographic obstacles
- Full UI polish

### Phase 3 (Post-V1)

- Variable renewables (wind/solar)
- Maintenance costs
- Advanced grid analytics
- Performance optimization

---

## 7. Testing & Development Approach

### 7.1 Critical Dev Tools

**Must Have from Day 1**:

- Save/load system (test scenarios without replay)
- Dev console commands:
  - Spawn city at location
  - Add budget
  - Fast-forward time
  - Set happiness
  - Toggle god mode (no failures)

### 7.2 Test Scenarios

**Scenario Library**:

1. Tutorial: 1 plant, 1 city disconnected
2. Capacity test: Grid at 95% utilization
3. Cascading failure: Redundant paths, trip one line
4. Voltage drop: City far from plant, no substation
5. Budget crisis: Low funds, new city announced
6. Complex topology: Multiple plants, switching stations

### 7.3 Testing Strategy

- **Unit tests**: Physics calculations, component logic
- **Integration tests**: Simulation scenarios
- **E2E tests**: UI interactions (place component, draw line)
- **Target coverage**: 90%

### 7.4 CI/CD

- **GitHub Actions**: Run linter, tests, build on PR
- **Pre-commit hooks**: Linter + tests (Husky + lint-staged)
- **Deploy**: GitHub Pages or Vercel (static site)

---

## 8. Open Technical Questions

### Canvas Library Selection

**Decision: React Flow** (chosen 2025-10-12)

**Rationale:**

- Grid simulator is fundamentally a **node-based graph** (plants → lines → cities)
- **Rapid prototyping**: Working prototype in hours vs days
- **Built-in features**: Pan/zoom, node dragging, edge routing, minimap
- **React-native**: Stays in React paradigm (good for learning)
- **Good enough performance**: Handles 50 cities + 100 lines easily
- **Easy pivot**: Can migrate to Konva/PixiJS in Phase 1 if needed

**Alternatives Considered:**

- **Konva (react-konva)**: More visual control, but more manual work for pan/zoom/interactions
- **PixiJS**: Best performance, but overkill for Phase 0 POC, steeper learning curve

**Migration Path:**

- If React Flow visuals sufficient → Keep it
- If need more visual polish → Migrate to Konva
- If need high performance (>50 cities) → Migrate to PixiJS

### Power Flow Algorithm Optimization

- Use sparse matrix solvers for large grids
- Consider Web Worker for simulation (off main thread)
- Optimize re-renders in React components

### Save File Size Management

- Compress JSON before storing
- Limit history depth
- Consider binary format for very large grids

### Rendering Performance

- Canvas culling (only render visible components)
- Level of detail (LOD) for zoomed out views
- Batch rendering updates
- Target: 60 FPS with 50+ components

**Resolution Approach**: Implement, profile, iterate based on performance metrics.

---

## 9. State Management

### Phase 0-1: useState + Context

- **Pros**: Simple, built-in, sufficient for initial development
- **Cons**: May not scale well with complex state

### Phase 2+: Consider Zustand or Redux

- If state management becomes complex
- If performance optimization needed
- If time-travel debugging desired

---

## 10. React Integration

### useSimulation Hook

```typescript
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

### Component Updates

- Replace mock data with `gridState` from simulation
- Wire up interaction handlers to simulation commands
- Update panels to show real-time data
- Add visual feedback for component states

---

## 11. Performance Considerations

### Simulation Loop

- Target: 60 FPS rendering, 10-60 Hz simulation updates
- Decouple rendering from simulation ticks
- Use requestAnimationFrame for rendering
- Use fixed timestep for physics

### Canvas Rendering

- Use canvas layers (static background, dynamic components)
- Implement dirty rect optimization
- Batch similar rendering operations
- Consider OffscreenCanvas for background processing

### Memory Management

- Limit event history
- Pool frequently created objects
- Clean up event listeners
- Profile memory usage regularly

---

## 12. Development Tools

### Dev Console Commands

```
/spawn-city <x> <y> <size>     # Spawn city at location
/add-budget <amount>            # Add money
/fast-forward <minutes>         # Skip time
/set-happiness <value>          # Set happiness level
/god-mode                       # Toggle failure immunity
/save-scenario <name>           # Save current state as test scenario
/load-scenario <name>           # Load test scenario
/reset                          # Reset to initial state
/debug-physics                  # Show physics debug overlay
```

### Debug Overlays

- Power flow visualization (arrows showing direction/magnitude)
- Voltage levels at each node (color-coded)
- Line utilization heatmap
- Grid graph topology view
- Performance metrics (FPS, tick time, component count)

---

## 13. Deployment

### Build Process

```bash
pnpm build              # Production build
pnpm preview            # Preview production build locally
```

### Hosting Options

- **GitHub Pages**: Free, simple static hosting
- **Vercel**: Zero-config deployment, preview deployments
- **Netlify**: Similar to Vercel, good CI/CD integration

### Environment Variables

- Version number
- Build timestamp
- Feature flags (enable/disable experimental features)

---

## 14. Accessibility

### Keyboard Navigation

- Tab through interactive elements
- Arrow keys for canvas pan
- +/- for zoom
- Space for play/pause
- Esc to cancel current action

### Screen Reader Support

- ARIA labels for all buttons
- Status announcements for important events
- Describe component states

### Visual Accessibility

- High contrast mode option
- Colorblind-friendly color schemes
- Adjustable font sizes
- Zoom support

---

## 15. Browser Compatibility

### Minimum Requirements

- Modern browser with ES2024 support
- Canvas 2D API
- IndexedDB
- LocalStorage (fallback for saves)

### Target Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement

- Detect feature support
- Provide fallbacks where possible
- Graceful degradation for older browsers

---

## Document References

- See **ComponentReference.md** for detailed component specifications
- See **PhysicsSpec.md** for physics formulas and calculations
- See **GeographyAndEconomy.md** for game mechanics
- See **DesignDoc.md** for high-level game design
- See **DevelopmentApproach.md** for phase-by-phase implementation plan
