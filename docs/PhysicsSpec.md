# GridSim - Physics Specification

This document details the electrical grid physics model and power flow calculations.

---

## 1. Overview

GridSim uses a simplified AC power flow model for V1, suitable for real-time gameplay while maintaining educational accuracy about grid behavior.

**Key Simplifications**:

- Simplified AC power flow (no reactive power or voltage magnitude calculations)
- No reactive power / power factor
- Instant generator response (no ramp rates in V1)
- Fixed seasonal patterns (no random weather)

**Physics Principles**:

- Kirchhoff's laws govern power flow
- Power losses increase with distance and current
- Voltage drops affect power delivery
- Capacity constraints cause failures

---

## 2. Power Flow Model

### 2.1 Simplified AC Power Flow

**Principles**:

- Power flows from generation to load
- Follows Kirchhoff's laws (power in = power out at nodes)
- Distributes across parallel paths inversely proportional to impedance
- Real-time calculation every simulation tick

**Mathematical Model**:

```
P = B × θ

Where:
P = Power injection at nodes (generation - load)
B = Susceptance matrix (from grid topology)
θ = Voltage angles at nodes
```

**Algorithm**:

1. Build admittance matrix from grid topology
2. Solve linear system for voltage angles
3. Calculate power flows on each line
4. Apply losses and voltage drops
5. Check capacity constraints

**Update Frequency**: Every simulation tick (target 10-60 Hz)

### 2.2 Network Topology

**Node Types**:

- **Generation Nodes**: Power plants (positive injection)
- **Load Nodes**: Cities (negative injection)
- **Junction Nodes**: Substations, switching stations (zero injection)

**Edges**:

- Transmission lines with impedance Z = R + jX
- For simplified model: Focus on reactance X (dominates in high voltage transmission)

**Graph Properties**:

- Directed graph (power flow direction)
- Weighted edges (impedance, capacity)
- Dynamic topology (breakers can open/close)

### 2.3 Power Dispatch (V1 Auto-Dispatch)

**Generation Dispatch Order**:

1. **Baseload** (Nuclear, Coal): Dispatch first up to capacity
2. **Intermediate** (CCGT): Dispatch next to meet remaining demand
3. **Peaking** (Hydro): Dispatch last for flexibility

**Dispatch Algorithm**:

```typescript
function dispatchGeneration(demand: number, plants: PowerPlant[]): void {
  let remainingDemand = demand

  // Sort plants by dispatch priority (baseload first)
  const sortedPlants = sortByPriority(plants)

  for (const plant of sortedPlants) {
    if (remainingDemand <= 0) {
      plant.currentOutput = 0
      continue
    }

    plant.currentOutput = Math.min(plant.capacity, remainingDemand)
    remainingDemand -= plant.currentOutput
  }
}
```

**Constraint**: Total generation ≥ total demand (no load shedding in V1)

---

## 3. Voltage Drop

### 3.1 Voltage Drop Formula

```
ΔV = I × R × distance

Where:
ΔV = Voltage drop (V)
I = Current (A)
R = Resistance per unit length (Ω/km)
distance = Line length (km)
```

**Simplified for Gameplay**:

```
V_delivered = V_nominal × (1 - k × distance × load / capacity)

Where:
k = voltage drop coefficient (tunable constant)
```

### 3.2 Voltage Thresholds

- **Nominal Voltage**: 100% (ideal delivery)
- **Warning Threshold**: 95% (reduced delivery begins)
- **Critical Threshold**: 90% (significant delivery reduction)
- **Failure Threshold**: 80% (city severely underpowered)

**Effect on Power Delivery**:

```
powerDelivered = powerDemanded × (V_delivered / V_nominal)

Example:
City demands 100 MW at 90% voltage → receives only 90 MW
```

**Consequences**:

- Lower revenue (paid only for delivered power)
- Happiness penalty (unmet demand)
- Visual feedback (yellow/red warning)

### 3.3 Mitigation Strategy

**Player Solutions**:

1. **Add Substations**: Step down voltage, reduces drop on remaining segments
2. **Higher Voltage Lines**: 400 kV drops less than 110 kV for same power
3. **Parallel Lines**: Split load across multiple paths
4. **Shorter Routes**: Build around obstacles efficiently

**Substation Effect**:

```
Without substation:
Plant (400 kV) ---200 km---> City (400 kV)  ❌ High voltage drop

With substation:
Plant (400 kV) ---100 km---> Substation ---100 km---> City (110 kV)  ✅ Lower drop per segment
```

---

## 4. Line Losses

### 4.1 I²R Losses

**Formula**:

```
P_loss = I² × R × distance

Where:
P_loss = Power loss (W)
I = Current (A)
R = Resistance per unit length (Ω/km)
distance = Line length (km)
```

**Simplified for Gameplay**:

```
loss_percentage = base_loss × (distance / 100) × (load / capacity)²

Where:
base_loss = 2-4% per 100 km at high voltage (tunable)
```

### 4.2 Voltage-Dependent Losses

**Key Principle**: Higher voltage = lower losses for same power

**Reason**: P = V × I, so for constant P:

- Higher V → lower I
- Lower I → lower I² losses

**Comparative Losses** (per 100 km):

- **400 kV**: 2-4% (most efficient for long distance)
- **220 kV**: 3-5%
- **110 kV**: 4-6% (less efficient, short distance only)

**Gameplay Implication**: Players should step up to 400 kV for long hauls, step down near cities

### 4.3 Loss Calculation

**Per Line Segment**:

```typescript
function calculateLineLoss(line: TransmissionLine): number {
  const utilizationRatio = line.currentLoad / line.capacity
  const distanceRatio = line.distance / 100 // per 100 km
  const baseLoss = getBaseLossForVoltage(line.voltage) // e.g., 0.03 for 3%

  return baseLoss * distanceRatio * utilizationRatio ** 2
}
```

**Total Grid Losses**:

```typescript
function calculateTotalLosses(grid: Grid): number {
  let totalLosses = 0

  // Line losses
  for (const line of grid.lines) {
    totalLosses += line.currentLoad * calculateLineLoss(line)
  }

  // Substation transformation losses (1-2% per transformation)
  for (const substation of grid.substations) {
    totalLosses += substation.currentLoad * 0.015 // 1.5% average
  }

  return totalLosses
}
```

**Budget Impact**: Losses reduce net power delivered → lower revenue

---

## 5. Capacity Limits

### 5.1 Thermal Capacity (Ampacity)

**Definition**: Maximum current a line can carry before overheating

**Units**: MVA (Mega Volt-Amperes)

**Capacity by Voltage Level**:

- **400 kV**: 1000-2000 MVA
- **220 kV**: 400-800 MVA
- **110 kV**: 100-300 MVA

**Constraint Check**:

```typescript
function checkCapacity(line: TransmissionLine): boolean {
  return line.currentLoad <= line.capacity
}
```

### 5.2 Overload Behavior

**Trigger Condition**:

```
currentLoad > capacity
```

**Immediate Response**:

1. Circuit breaker trips automatically
2. Line disconnects from grid
3. Power flow recalculates without this line
4. Load redistributes to parallel paths (if available)

**Cascading Check**:

```typescript
function checkCascadingFailure(grid: Grid, trippedLine: TransmissionLine): void {
  // Recalculate power flow without tripped line
  recalculatePowerFlow(grid)

  // Check all remaining lines
  for (const line of grid.lines) {
    if (line.breakerClosed && checkCapacity(line) === false) {
      tripBreaker(line)
      checkCascadingFailure(grid, line) // Recursive check
    }
  }
}
```

### 5.3 Transformer Capacity

**Substations** also have capacity limits:

```typescript
interface Substation {
  capacity: number // MVA
  currentLoad: number // MVA
}

function checkSubstationCapacity(substation: Substation): boolean {
  return substation.currentLoad <= substation.capacity
}
```

**Overload**: Same breaker trip behavior as transmission lines

---

## 6. Grid Protection

### 6.1 Circuit Breakers

**Purpose**: Protect equipment from damage due to overcurrent

**Locations**:

- Each transmission line has breakers at both ends
- Substations have breakers on all connections
- Switching stations have breakers on each connected line

**States**:

- **Closed**: Normal operation, power flows
- **Open**: Manual disconnect by player, no power flow
- **Tripped**: Automatic disconnect due to overload, requires manual reset

**Trip Logic**:

```typescript
function updateBreakers(grid: Grid): void {
  for (const line of grid.lines) {
    if (line.breakerClosed && line.currentLoad > line.capacity) {
      line.breakerTripped = true
      line.breakerClosed = false
      logEvent(`Breaker tripped on line ${line.id}`)
    }
  }
}
```

**Player Reset**:

```typescript
function resetBreaker(line: TransmissionLine): Result {
  if (!line.breakerTripped) {
    return { success: false, message: 'Breaker not tripped' }
  }

  // Check if overload condition resolved
  if (wouldOverload(line)) {
    return { success: false, message: 'Still overloaded, cannot reset' }
  }

  line.breakerTripped = false
  line.breakerClosed = true
  return { success: true, message: 'Breaker reset' }
}
```

### 6.2 Cascading Failures

**Mechanism**:

1. Line A carrying 1500 MVA (at 80% capacity)
2. Parallel Line B also carrying 1500 MVA (at 80% capacity)
3. Line A trips due to temporary overload
4. Line A's load redistributes → Line B now carries 3000 MVA
5. Line B exceeds capacity → Line B trips
6. All downstream cities lose power (blackout)

**Teaching Moment**: Importance of N-1 contingency (grid survives any single failure)

**N-1 Contingency Planning**:

```
Good design:
Plant --- Line A (60% util) ---> City
      \                        /
       -- Line B (60% util) ---

If Line A fails: Line B takes 100% load ✅ Still operational


Bad design:
Plant --- Line A (80% util) ---> City
      \                        /
       -- Line B (80% util) ---

If Line A fails: Line B takes 160% load ❌ Cascading failure
```

**Simulation**:

```typescript
function simulateCascade(grid: Grid, initialFailure: TransmissionLine): CascadeResult {
  const failedLines: TransmissionLine[] = [initialFailure]
  let cascadeComplete = false

  while (!cascadeComplete) {
    recalculatePowerFlow(grid)
    const newFailures = checkAllCapacities(grid)

    if (newFailures.length === 0) {
      cascadeComplete = true
    } else {
      failedLines.push(...newFailures)
    }
  }

  return {
    totalFailures: failedLines.length,
    affectedCities: findAffectedCities(grid, failedLines),
    blackoutMW: calculateBlackoutLoad(grid, failedLines),
  }
}
```

---

## 7. Physics Validation

### 7.1 Kirchhoff's Current Law (KCL)

**Principle**: Sum of currents at a node = 0 (power in = power out)

**Validation Test**:

```typescript
function validateKCL(grid: Grid): ValidationResult {
  for (const node of grid.nodes) {
    const powerIn = sumInflowingPower(node)
    const powerOut = sumOutflowingPower(node)
    const generation = node.generation || 0
    const load = node.load || 0

    const balance = powerIn + generation - powerOut - load

    if (Math.abs(balance) > TOLERANCE) {
      return {
        valid: false,
        message: `KCL violated at node ${node.id}: balance = ${balance}`,
      }
    }
  }

  return { valid: true, message: 'KCL satisfied at all nodes' }
}
```

**Tolerance**: Allow small numerical errors (e.g., <0.1 MW)

### 7.2 Voltage Drop Validation

**Test**: Voltage drop should match formula V = IR

```typescript
function validateVoltageDrop(line: TransmissionLine): ValidationResult {
  const calculatedDrop = line.current * line.resistance * line.distance
  const actualDrop = line.voltageFrom - line.voltageTo

  const error = Math.abs(calculatedDrop - actualDrop)

  if (error > TOLERANCE) {
    return {
      valid: false,
      message: `Voltage drop mismatch: calculated ${calculatedDrop}, actual ${actualDrop}`,
    }
  }

  return { valid: true }
}
```

### 7.3 Line Losses Validation

**Test**: Losses should scale correctly with distance and current

```typescript
function validateLineLosses(line: TransmissionLine): ValidationResult {
  // Test 1: Losses increase with distance
  const loss100km = calculateLineLoss({ ...line, distance: 100 })
  const loss200km = calculateLineLoss({ ...line, distance: 200 })

  if (loss200km < 1.5 * loss100km) {
    return { valid: false, message: "Losses don't scale with distance" }
  }

  // Test 2: Losses increase quadratically with load
  const loss50percent = calculateLineLoss({ ...line, currentLoad: line.capacity * 0.5 })
  const loss100percent = calculateLineLoss({ ...line, currentLoad: line.capacity })

  if (loss100percent < 3 * loss50percent) {
    return { valid: false, message: "Losses don't scale quadratically with load" }
  }

  return { valid: true }
}
```

### 7.4 Cascading Failure Validation

**Test**: Verify cascading logic propagates correctly

**Test Scenario** (from DesignDoc.md 14.2):

```typescript
function testCascadingFailure(): void {
  // Setup: 2 parallel paths, each at 80% capacity
  const grid = createTestGrid({
    plant: { capacity: 2000, output: 2000 },
    city: { demand: 2000 },
    paths: [
      { capacity: 1250, load: 1000 }, // Path A: 80% utilized
      { capacity: 1250, load: 1000 }, // Path B: 80% utilized
    ],
  })

  // Trip Path A
  tripBreaker(grid.paths[0])

  // Verify Path B fails due to overload
  simulateStep(grid)

  assert(grid.paths[1].breakerTripped === true, 'Path B should trip')
  assert(grid.city.powerReceived === 0, 'City should be blacked out')
}
```

### 7.5 Breaker Trip Logic Validation

**Test**: Breakers trip at correct threshold

```typescript
function testBreakerTrip(): void {
  const line = createTestLine({ capacity: 1000 })

  // Test: Just under capacity
  line.currentLoad = 999
  updateBreakers([line])
  assert(line.breakerTripped === false, 'Should not trip at 99.9%')

  // Test: At capacity
  line.currentLoad = 1000
  updateBreakers([line])
  assert(line.breakerTripped === false, 'Should not trip at 100%')

  // Test: Over capacity
  line.currentLoad = 1001
  updateBreakers([line])
  assert(line.breakerTripped === true, 'Should trip at 100.1%')
}
```

---

## 8. Tunable Constants

These constants can be adjusted for gameplay balance:

### 8.1 Voltage Drop

```typescript
const VOLTAGE_DROP_COEFFICIENT = 0.0001 // per km per (MVA/capacity)
const VOLTAGE_WARNING_THRESHOLD = 0.95 // 95%
const VOLTAGE_CRITICAL_THRESHOLD = 0.9 // 90%
```

### 8.2 Line Losses

```typescript
const BASE_LOSS_400KV = 0.03 // 3% per 100 km
const BASE_LOSS_220KV = 0.04 // 4% per 100 km
const BASE_LOSS_110KV = 0.05 // 5% per 100 km
```

### 8.3 Substation Losses

```typescript
const TRANSFORMER_LOSS_PERCENTAGE = 0.015 // 1.5%
```

### 8.4 Capacity Margins

```typescript
const CAPACITY_WARNING_THRESHOLD = 0.8 // 80% utilization
const CAPACITY_TRIP_THRESHOLD = 1.0 // 100% utilization
```

---

## 9. Performance Considerations

### 9.1 Power Flow Solver Optimization

**For Small Grids** (<20 nodes):

- Direct matrix inversion (LU decomposition)
- Fast enough for real-time

**For Large Grids** (50+ nodes):

- Sparse matrix solvers (conjugate gradient)
- Iterative methods with convergence tolerance
- Consider Web Worker for off-main-thread computation

### 9.2 Update Frequency

**Simulation Tick Rate**: 10-60 Hz (adjustable)

- Higher rates: More responsive, higher CPU
- Lower rates: Less responsive, lower CPU

**Rendering Rate**: 60 FPS (decoupled from simulation)

**Separation**:

```typescript
// Simulation loop (variable rate)
setInterval(() => simulation.tick(), 1000 / SIMULATION_HZ)

// Render loop (60 FPS)
requestAnimationFrame(render)
```

---

## 10. Future Physics Enhancements (V2+)

### 10.1 AC Power Flow

- Reactive power (Q)
- Power factor
- Voltage magnitude control
- More realistic but computationally expensive

### 10.2 Generator Ramp Rates

- Nuclear: hours to adjust
- Coal: 30-60 min
- CCGT: 10-15 min
- Hydro: instant

### 10.3 Variable Renewables

- Wind/solar generation varies with weather
- Forecasting and uncertainty
- Balancing challenges

### 10.4 Equipment Aging

- Resistance increases over time
- Capacity degrades
- Maintenance required

---

## Document References

- See **ComponentReference.md** for component specifications and capacities
- See **TechnicalSpec.md** for implementation details and data models
- See **DesignDoc.md** for how physics integrates with gameplay
- See **DevelopmentApproach.md** for testing scenarios
