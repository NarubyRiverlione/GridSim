# GridSim - Component Reference (Index)

This document serves as an index to the detailed component specifications. Each component type has its own dedicated document for easier navigation and maintenance.

Canonical Defaults (V1)

- The table below defines canonical default values used across the documentation and the reference implementation for V1. Use these values as the single source of truth for examples, tutorials, and balancing. For physics formulas and solver behavior see PhysicsSpec.md.

| Component / Item        | Canonical Default (V1) | Notes / Source |
| ----------------------- | ---------------------- | -------------- |
| CCGT (default)          | 600 MW, €1.0B          | PowerPlants.md |
| Nuclear (default)       | 1000 MW, €5.0B         | PowerPlants.md |
| Coal (default)          | 800 MW, €2.5B          | PowerPlants.md |
| Hydro (default)         | 500 MW, €3.0B          | PowerPlants.md |
| Wind Offshore (default) | 800 MW, €2.0B          | PowerPlants.md |
| Wind Onshore (default)  | 100 MW, €200M          | PowerPlants.md |
| Solar (default)         | 100 MW, €150M          | PowerPlants.md |

| Voltage / Line (default) | Capacity (nominal) | Cost / km (nominal) | Max span (no pylons) | Base loss /100km     |
| ------------------------ | ------------------ | ------------------- | -------------------- | -------------------- |
| 400 kV                   | 1500 MVA           | €1.5M/km            | 100 km               | 3% (BASE_LOSS_400KV) |
| 220 kV                   | 600 MVA            | €800k/km            | 75 km                | 4% (BASE_LOSS_220KV) |
| 110 kV                   | 300 MVA            | €400k/km            | 50 km                | 5% (BASE_LOSS_110KV) |

| Substation Type | Typical Capacity (nominal) | Construction Cost (nominal) |
| --------------- | -------------------------- | --------------------------- |
| Grid Substation | 1000 MVA                   | €65M                        |
| Zone Substation | 400 MVA                    | €30M                        |

| Other Infrastructure | Nominal Cost | Notes                            |
| -------------------- | ------------ | -------------------------------- |
| Switching Station    | €7M          | Breaker control, routing         |
| Pylon (default)      | €0.75M       | Supports up to 4 lines (Phase 1) |

Notes:

- V1 modeling assumption: power factor = 1.0 (pf = 1.0) → MVA == MW for capacity/load/loss calculations (see PhysicsSpec.md and TechnicalSpec.md).
- These canonical defaults should be referenced by other docs (tutorials, examples) rather than hardcoding alternative numbers inline.
- For tunable gameplay constants (losses, voltage-drop coefficient), consult PhysicsSpec.md §8.
- If you change a canonical value, update ComponentReference.md and then update all docs that reference it.

---

## Component Documents

### [Power Plants](./PowerPlants.md)

All power generation sources with capacity, costs, and operational characteristics.

- Nuclear, Coal, CCGT, Hydro, Wind (Offshore/Onshore), Solar
- Output voltage: 400kV (all types)
- Auto-dispatch in V1, variable generation in V2

**Key Info**: Nuclear (€4-6B, 1000MW), CCGT (€800M-1.2B, 600MW), Wind/Solar (renewable, V2 variability)

### [Cities](./Cities.md)

Load centers with power demand specifications and connection requirements.

- Small Town (20-50 MW), Medium City (100-200 MW), Large City (500-800 MW), Major Metro (2000-5000 MW)
- **Critical**: Cities connect at 110kV only
- **110kV capacity limit**: ~300 MW per line
- **Multi-connection requirement**: Large cities need 3-4 lines, metros need 10-20 lines

**Key Info**: Demand profiles (daily + seasonal), partial delivery mechanics, tutorial scenarios

### [Transmission Lines](./TransmissionLines.md)

Power transmission infrastructure with voltage levels and capacity specifications.

- 400kV (1000-2000 MVA, €1-2M/km, 100km max span)
- 220kV (400-800 MVA, €600k-1M/km, 75km max span)
- 110kV (100-300 MVA, €300-500k/km, 50km max span)
- **Critical**: Line voltage auto-determined by endpoints (no user choice)

**Key Info**: Distance constraints, losses (2-6% per 100km), terrain cost multipliers, failure behavior

### [Substations](./Substations.md)

Voltage transformation infrastructure forming the voltage cascade.

- **Grid Substation** (400→220kV, €50-80M): Bulk power distribution
- **Zone Substation** (220→110kV, €20-40M): City delivery preparation
- **Critical**: Must use both types (no voltage level skipping)

**Key Info**: Three-tier voltage cascade, placement strategy, transformation losses (1-2%)

### [Switching Stations](./SwitchingStations.md)

Routing and breaker control infrastructure for complex topologies.

- Cost: €5-10M (no voltage transformation)
- Function: Connect multiple line segments, breaker control, fault isolation
- Use cases: N-1 redundancy, mesh networks, manual grid management

**Key Info**: Breaker states (closed/open/tripped), 10x cheaper than substations, comparison to other infrastructure

### [Pylons](./Pylons.md)

Structural support for long-distance transmission lines.

- Cost: €0.5-1M per pylon
- Capacity: 4 lines default (upgradeable to 6-8 in Phase 2)
- Function: Passive support only (no electrical function)
- **Critical**: Required when lines exceed max span distances

**Key Info**: Multi-line capacity sharing (cost savings), transmission corridors, routing around obstacles

---

## Supporting Documents

### [UI Specification](./UISpecification.md)

Phase 0 UI mechanics for component placement and interaction.

- Snap-to-grid (50px grid)
- Collision detection (node overlap prevention)
- Component bounding boxes
- Interaction modes (select/pan, add component, add line)
- Phase 0 vs Phase 1 enforcement

### [Gameplay Guide](./GameplayGuide.md)

Strategic guidance for grid management across different game phases.

- Component selection by game phase (early/mid/late)
- Quick reference tables (costs, capacities, use cases)
- Strategic principles (voltage management, redundancy, cost optimization)
- Common mistakes to avoid
- Tutorial progression

---

## Quick Reference - Construction Costs

| Component         | Cost         | Function                      |
| ----------------- | ------------ | ----------------------------- |
| Nuclear Plant     | €4-6B        | Baseload generation (1000 MW) |
| CCGT Plant        | €800M-1.2B   | Peaking generation (600 MW)   |
| 400kV Line        | €1-2M/km     | Long-distance transmission    |
| 220kV Line        | €600k-1M/km  | Regional transmission         |
| 110kV Line        | €300-500k/km | City distribution             |
| Grid Substation   | €50-80M      | 400→220kV transformation      |
| Zone Substation   | €20-40M      | 220→110kV transformation      |
| Switching Station | €5-10M       | Routing + breaker control     |
| Pylon             | €0.5-1M      | Structural support (4 lines)  |

---

## Quick Reference - City Connections

| City Size   | Demand       | Required 110kV Lines | Why                            |
| ----------- | ------------ | -------------------- | ------------------------------ |
| Small Town  | 20-50 MW     | 1                    | Single line sufficient         |
| Medium City | 100-200 MW   | 1-2                  | Redundancy recommended         |
| Large City  | 500-800 MW   | 3-4                  | Capacity + N-1 contingency     |
| Major Metro | 2000-5000 MW | 10-20                | Extensive distribution network |

**Critical Rule**: Each 110kV line limited to ~300 MW capacity

---

## Voltage Architecture

**Three-Tier Deterministic System:**

```
Tier 1: Transmission (400kV)
Power Plant (400kV) → 400kV lines → Grid Substation (400kV input)

Tier 2: Sub-Transmission (220kV)
Grid Substation (220kV output) → 220kV lines → Zone Substation (220kV input)

Tier 3: Distribution (110kV)
Zone Substation (110kV output) → 110kV lines → City (110kV input)
```

**Critical Rules:**

1. No voltage level skipping
2. Line voltage auto-determined (no user choice)
3. Must use both substation types (Grid + Zone)

---

## Document History

**Version 2.0** (2025-01-XX): Split into separate documents by component type

- Created PowerPlants.md, Cities.md, TransmissionLines.md, Substations.md
- Created SwitchingStations.md, Pylons.md, UISpecification.md, GameplayGuide.md
- ComponentReference.md converted to index file

**Version 1.0** (Initial): Single comprehensive document (940 lines)

- All components, costs, and mechanics in one file
- Became too large for easy navigation

---

## Related Documents

- See [DesignDoc.md](./DesignDoc.md) for high-level game design and mechanics
- See [PhysicsSpec.md](./PhysicsSpec.md) for power flow calculations and grid physics
- See [GeographyAndEconomy.md](./GeographyAndEconomy.md) for geographic constraints and economy
- See [TechnicalSpec.md](./TechnicalSpec.md) for technical implementation details
- See [DevelopmentApproach.md](./DevelopmentApproach.md) for phased development plan
- See [CLAUDE.md](../CLAUDE.md) for AI assistant guidance
