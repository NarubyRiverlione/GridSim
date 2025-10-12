# Transmission Lines

Lines transport power between nodes. Voltage level affects capacity, losses, and cost.

**Critical Design Rule**: Line voltage is **always auto-determined** by source/target nodes. Player cannot choose voltage - it's physically determined by the network topology.

---

## Voltage Levels

### 400 kV - Main Transmission Backbone

- **Purpose**: Long-distance bulk power transmission
- **Capacity**: 1000-2000 MVA
- **Construction Cost**: €1-2M/km
- **Typical Use**: Connect major plants to grid, span regions
- **Losses**: ~2-4% per 100 km
- **Maximum Span**: 100 km (requires pylons for longer distances)
- **Visual**: Thickest line rendering (4px, red/dark color)
- **Source/Target**: Power plants (400kV) ↔ Grid substations (400kV input)

### 220 kV - Regional Transmission

- **Purpose**: Regional power distribution
- **Capacity**: 400-800 MVA
- **Construction Cost**: €600k-1M/km
- **Typical Use**: Connect substations, medium-distance transport
- **Losses**: ~3-5% per 100 km
- **Maximum Span**: 75 km (requires pylons for longer distances)
- **Visual**: Medium thickness line rendering (3px, blue color)
- **Source/Target**: Grid substations (220kV output) ↔ Zone substations (220kV input)

### 110 kV - Sub-transmission / Distribution

- **Capacity**: 100-300 MVA (**~300 MW per line limit**)
- **Construction Cost**: €300-500k/km
- **Typical Use**: Feed cities, local distribution
- **Losses**: ~4-6% per 100 km
- **Maximum Span**: 50 km (requires pylons for longer distances)
- **Visual**: Thin line rendering (2px, green color)
- **Source/Target**: Zone substations (110kV output) ↔ Cities (110kV input)
- **Critical**: Each 110kV line limited to ~300 MW - large cities need multiple connections

### 33/20 kV - Distribution to Cities (Not in V1)

- **Purpose**: Final delivery to cities (implied, not built by player in V1)
- **Note**: Cities automatically connect to nearest 110kV line or substation

---

## Physical Characteristics

- **Resistance**: Increases linearly with distance (I²R losses)
- **Thermal Capacity**: Limits in MVA (ampacity)
- **Voltage Drop**: Increases with distance and load
- **Impedance**: Combination of resistance + reactance

---

## Failure Behavior

- **Overload**: When currentLoad > capacity
- **Circuit Breaker**: Automatically trips to protect line
- **Consequence**: Blackout to all downstream components
- **Cascading Risk**: Load redistributes to parallel paths, may overload them too
- **Player Action**: Must reset breaker manually after resolving issue

---

## Cost Multipliers (Terrain)

| Terrain Type      | Multiplier | Notes                       |
| ----------------- | ---------- | --------------------------- |
| Normal            | 1x         | Open land, flat terrain     |
| Mountainous       | 2-3x       | Alps, Pyrenees, Carpathians |
| Submarine Cable   | 4-6x       | Cross water bodies          |
| Urban Underground | 3-4x       | Dense city routing          |

---

## Distance Constraints and Pylons

**Maximum Line Spans Without Intermediate Support:**

- **400 kV lines**: 100 km maximum span between supports
- **220 kV lines**: 75 km maximum span between supports
- **110 kV lines**: 50 km maximum span between supports

**When distances exceed these limits:**

- Lines must route through pylons or other infrastructure (substations, switching stations)
- Phase 1: System auto-places pylons when drawing long lines
- Phase 1: Player can manually adjust pylon positions within distance constraints
- Phase 0: Visual warning shown (yellow/orange line color) but not enforced

---

## Quick Reference

| Voltage | Capacity      | Cost/km   | Max Span | Losses/100km | Use Case               |
| ------- | ------------- | --------- | -------- | ------------ | ---------------------- |
| 400 kV  | 1000-2000 MVA | €1-2M     | 100 km   | 2-4%         | Long-distance backbone |
| 220 kV  | 400-800 MVA   | €600k-1M  | 75 km    | 3-5%         | Regional transmission  |
| 110 kV  | 100-300 MVA   | €300-500k | 50 km    | 4-6%         | City connections       |

---

## Related Documents

- See [PowerPlants.md](./PowerPlants.md) for 400kV generation sources
- See [Cities.md](./Cities.md) for 110kV capacity constraints (300 MW per line)
- See [Substations.md](./Substations.md) for voltage transformation between levels
- See [Pylons.md](./Pylons.md) for long-distance transmission support
- See [GameplayGuide.md](./GameplayGuide.md) for line selection strategy
