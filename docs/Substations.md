# Substations

Transform voltage between transmission levels. Essential for voltage management over long distances.

GridSim uses **two types of substations** that form the voltage cascade from generation to cities.

---

## Grid Substation (400/220 kV)

**Purpose**: Step down from transmission backbone (400kV) to sub-transmission (220kV)

- **Input Voltage**: 400 kV (fixed)
- **Output Voltage**: 220 kV (fixed)
- **Transformer Capacity**: Variable (choose when building)
- **Transformer Capacity Limit**: MVA
- **Losses**: 1-2% per transformation
- **Construction Cost**: €50-80M
- **Typical Location**: Major grid junctions, bulk power distribution points
- **Role**: Primary voltage step-down for long-distance transmission
- **Connections**:
  - **Input**: From 400kV power plants or 400kV transmission lines
  - **Output**: To 220kV transmission lines feeding zone substations

---

## Zone/Distribution Substation (220/110 kV)

**Purpose**: Step down from sub-transmission (220kV) to distribution voltage (110kV) for city delivery

- **Input Voltage**: 220 kV (fixed)
- **Output Voltage**: 110 kV (fixed)
- **Transformer Capacity**: Variable (choose when building)
- **Transformer Capacity Limit**: MVA
- **Losses**: 1-2% per transformation
- **Construction Cost**: €20-40M
- **Typical Location**: City outskirts, final step before city delivery
- **Role**: Final voltage step-down before city connections
- **Connections**:
  - **Input**: From 220kV lines (from grid substations)
  - **Output**: To 110kV lines feeding cities

---

## Voltage Cascade Architecture

**Three-Tier Voltage System:**

```
Tier 1: Transmission (400 kV)
Power Plant (400kV) → 400kV lines → Grid Substation input

Tier 2: Sub-Transmission (220 kV)
Grid Substation output → 220kV lines → Zone Substation input

Tier 3: Distribution (110 kV)
Zone Substation output → 110kV lines → City
```

**Critical Rules:**

1. **No voltage level skipping**: Cannot connect 400kV plant directly to city
2. **Must use both substation types**: Grid (400→220) + Zone (220→110)
3. **Voltage auto-determined**: Line voltage is always determined by source/target nodes
4. **No voltage choice**: Player cannot choose line voltage - it's physically determined

**Example Grid Architecture:**

```
Nuclear Plant (400kV output)
    ↓ 400kV line (100 km)
Grid Substation (400→220kV, 1000 MVA capacity)
    ↓ 220kV line (50 km)
Zone Substation A (220→110kV, 400 MVA)
    ↓ 110kV line (20 km, max 300 MW)
City A (200 MW demand) ✅

Grid Substation (same as above)
    ↓ 220kV line (30 km)
Zone Substation B (220→110kV, 400 MVA)
    ↓ 110kV line (15 km, max 300 MW)
City B (250 MW demand) ✅
```

---

## Placement Strategy

### When to Place Grid Substations (400→220kV)

- After long-distance 400kV transmission from power plants
- Before splitting power to multiple regional zones
- At major grid connection points (100+ km from generation)
- **Cost**: High (€50-80M), use strategically for bulk power distribution

### When to Place Zone Substations (220→110kV)

- Near cities requiring power delivery
- One zone substation per city or group of nearby cities
- Before final 110kV delivery lines
- **Cost**: Medium (€20-40M), needed for every city or city cluster

### Benefits

- Maintains voltage levels across long distances
- Reduces losses on final delivery segments
- Enables proper grid segmentation by voltage level
- Matches real-world electrical grid architecture

---

## Quick Reference

| Type     | Input  | Output | Cost    | Typical Capacity | Use Case                  |
| -------- | ------ | ------ | ------- | ---------------- | ------------------------- |
| Grid Sub | 400 kV | 220 kV | €50-80M | High MVA         | Bulk power distribution   |
| Zone Sub | 220 kV | 110 kV | €20-40M | Medium MVA       | City delivery preparation |

---

## Related Documents

- See [PowerPlants.md](./PowerPlants.md) for 400kV generation sources
- See [Cities.md](./Cities.md) for 110kV delivery requirements
- See [TransmissionLines.md](./TransmissionLines.md) for voltage level specifications
- See [SwitchingStations.md](./SwitchingStations.md) for routing without voltage transformation
- See [GameplayGuide.md](./GameplayGuide.md) for substation placement strategy
