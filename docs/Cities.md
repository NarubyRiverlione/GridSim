# Cities (Load Centers)

Cities consume power and generate revenue. Demand varies by time of day and season.

**Critical**: Cities **always connect at 110kV**. Each 110kV transmission line has a nominal capacity of 300 MVA (see ComponentReference.md). Under the V1 modeling assumption (power factor = 1.0) treat 300 MVA == 300 MW for capacity and load calculations. Large cities requiring more than 300 MW must have multiple 110kV connections.

---

## City Sizes

### Small Town

- **Demand**: 20-50 MW
- **Population**: ~20,000-50,000
- **Typical Examples**: Rural towns, small municipalities
- **Demand Profile**: Residential-focused (strong evening peak)
- **Revenue Potential**: Low but steady
- **Connection Complexity**: Simple, short transmission lines
- **Required 110kV Lines**: 1 line sufficient

### Medium City

- **Demand**: 100-200 MW
- **Population**: ~100,000
- **Typical Examples**: Regional centers, mid-size cities
- **Demand Profile**: Mixed residential/commercial (daytime + evening peaks)
- **Revenue Potential**: Medium
- **Connection Complexity**: Moderate, may require substation
- **Required 110kV Lines**: 1-2 lines (2 recommended for redundancy)

### Large City

- **Demand**: 500-800 MW
- **Population**: ~500,000
- **Typical Examples**: Major provincial cities
- **Demand Profile**: Diverse mix (flatter profile with peaks)
- **Revenue Potential**: High
- **Connection Complexity**: Requires multiple substations, redundant paths
- **Required 110kV Lines**: 3-4 lines (N-1 redundancy)

### Major Metro

- **Demand**: 2000-5000 MW
- **Population**: 1M+ (London, Paris, Madrid scale)
- **Typical Examples**: Capital cities, major metropolitan areas
- **Demand Profile**: Very diverse (24/7 industrial + residential peaks)
- **Revenue Potential**: Very high
- **Connection Complexity**: Complex grid topology, multiple plants needed
- **Required 110kV Lines**: 10-20 lines (extensive distribution network)

---

## Demand Characteristics

### Daily Cycle

- **00:00-06:00**: Low demand (60-70% of peak)
- **06:00-09:00**: Morning ramp-up
- **09:00-17:00**: Daytime plateau (80-90% of peak)
- **17:00-21:00**: Evening peak (100% demand)
- **21:00-24:00**: Evening decline

### Seasonal Variation

- **Summer**: Higher baseline (air conditioning)
- **Winter**: Higher baseline in northern regions (heating)
- **Spring/Fall**: Moderate baseline

### Profiles by City Type

- **Residential**: Strong evening peak
- **Industrial**: Flatter 24/7 profile
- **Commercial**: Daytime focused

---

## Connection Requirements (110kV Capacity Constraints)

### Why Multiple Connections Are Required

Cities **always connect at 110kV**. However, each 110kV transmission line has a **capacity limit of ~300 MW**. Large cities with demand exceeding 300 MW **require multiple 110kV connections**.

**Reasons for Multiple Connections:**

1. **Capacity Constraint**: Single 110kV line maxes out at ~300 MW
2. **Redundancy (N-1)**: If one line fails, others continue delivery
3. **Load Balancing**: Distributes load across multiple zone substations
4. **Geographic Spread**: Large cities need multiple distribution entry points

### Connection Requirements by City Size

| City Size   | Demand       | Min 110kV Lines | Recommended Lines | Reason                         |
| ----------- | ------------ | --------------- | ----------------- | ------------------------------ |
| Small Town  | 20-50 MW     | 1               | 1                 | Single line sufficient         |
| Medium City | 100-200 MW   | 1               | 2                 | Redundancy recommended         |
| Large City  | 500-800 MW   | 2-3             | 3-4               | Capacity + N-1 contingency     |
| Major Metro | 2000-5000 MW | 7-17            | 10-20             | Extensive distribution network |

---

## Example Architectures

### Small Town (50 MW demand)

```
Zone Substation → 110kV line (50 MW / 300 MW capacity) → Small Town ✅
Simple, single connection sufficient
```

### Medium City (150 MW demand)

```
Option A (minimum):
Zone Sub → 110kV line (150 MW / 300 MW capacity) → Medium City ⚠️
Works, but no redundancy

Option B (recommended):
Zone Sub A → 110kV line A (75 MW) ┐
                                   ├→ Medium City ✅
Zone Sub B → 110kV line B (75 MW) ┘
N-1 safe: Each line can handle full city load if other fails
```

### Large City (Berlin, 800 MW demand)

```
Insufficient (partial blackout):
Zone Sub → 110kV line (300 MW delivered / 800 MW demanded) ❌
Result: 62% delivery, happiness penalty, reduced revenue

Minimum (no redundancy):
Zone Sub A → 110kV (270 MW) ┐
Zone Sub B → 110kV (270 MW) ├→ Berlin (810 MW total) ⚠️
Zone Sub C → 110kV (270 MW) ┘
Works but single failure causes blackout

Recommended (N-1 redundancy):
Zone Sub A → 110kV (200 MW) ┐
Zone Sub B → 110kV (200 MW) ├→ Berlin (800 MW / 1200 MW available) ✅
Zone Sub C → 110kV (200 MW) │
Zone Sub D → 110kV (200 MW) ┘
Survives any single line failure
```

### Major Metro (London, 4000 MW demand)

```
Requires extensive distribution network:

Grid Sub 1 → Zone Sub 1 → 110kV ┐
           → Zone Sub 2 → 110kV ├→ Metro North (1000 MW)
           → Zone Sub 3 → 110kV ┘

Grid Sub 2 → Zone Sub 4 → 110kV ┐
           → Zone Sub 5 → 110kV ├→ Metro East (1000 MW)
           → Zone Sub 6 → 110kV ┘

Grid Sub 3 → Zone Sub 7 → 110kV ┐
           → Zone Sub 8 → 110kV ├→ Metro South (1000 MW)
           → Zone Sub 9 → 110kV ┘

Grid Sub 4 → Zone Sub 10 → 110kV ┐
           → Zone Sub 11 → 110kV ├→ Metro West (1000 MW)
           → Zone Sub 12 → 110kV ┘

Total: 12 zone substations × ~330 MW each = ~4000 MW
Plus additional lines for redundancy (16-20 total recommended)
```

---

## Partial Delivery Mechanics

**If insufficient 110kV connections exist:**

- **Power Delivered**: Sum of all connected 110kV line capacities (accounting for losses)
- **Shortfall**: Demand - Delivered power
- **Revenue Impact**: Player only paid for delivered power
- **Happiness Impact**: Penalty proportional to shortfall percentage
- **Visual Feedback**: City shows warning/critical state with delivery percentage

**Example:**

```
City demands 600 MW
Connected: 2 × 110kV lines (max 600 MW theoretical)
After losses: 550 MW actually delivered

Result:
- Delivery: 92% (550/600)
- Revenue: 92% of normal
- Happiness: -8% penalty
- Display: "Berlin: 550/600 MW (92%)" with yellow warning
```

---

## Strategic Implications

### Early Game

- Small towns with single 110kV connections are economical
- Focus on getting cities connected, not redundancy

### Mid Game

- First large city (600+ MW) teaches multi-connection requirement
- Player must build multiple zone substations
- Introduces grid complexity and cost

### Late Game

- Major metros require extensive distribution networks
- 10-20 zone substations per metro
- Grid becomes complex web of connections
- N-1 redundancy critical for high-value cities

---

## Tutorial Teaching Moment

**Phase 1 Tutorial Scenario:**

1. Player successfully connects small town (50 MW) with single 110kV line ✅
2. Large city (600 MW) spawns with 7-day warning
3. Player connects single 110kV line (thinking it's sufficient)
4. City receives only 300 MW (50% delivery) ❌
5. Happiness drops, revenue cut in half
6. **Tutorial popup**: "Large cities need multiple 110kV connections! Each line can carry max 300 MW. Add more zone substations."
7. Player adds 2nd zone substation with 110kV line
8. City now receives full 600 MW ✅
9. Lesson learned: Plan distribution infrastructure based on city size

---

## Quick Reference

| Size        | Demand       | Population | 110kV Lines | Complexity   |
| ----------- | ------------ | ---------- | ----------- | ------------ |
| Small Town  | 20-50 MW     | 20k-50k    | 1           | Simple       |
| Medium City | 100-200 MW   | 100k       | 1-2         | Moderate     |
| Large City  | 500-800 MW   | 500k       | 3-4         | Complex      |
| Major Metro | 2000-5000 MW | 1M+        | 10-20       | Very Complex |

---

## Related Documents

- See [PowerPlants.md](./PowerPlants.md) for generation capacity
- See [TransmissionLines.md](./TransmissionLines.md) for 110kV line specifications
- See [Substations.md](./Substations.md) for zone substation (220→110kV) requirements
- See [GameplayGuide.md](./GameplayGuide.md) for city connection strategy
