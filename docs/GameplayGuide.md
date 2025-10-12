# Gameplay Guide

Strategic guidance for component selection and grid management across different game phases.

---

## Component Selection by Game Phase

### Early Game (Cities 1-5)

**Recommended Components**:

- **Generation**: 1x CCGT (600 MW) - €1B - Good flexibility for small loads
- **Transmission**: 110 kV transmission lines - Sufficient for short distances
- **Substations**: Minimal substations - Keep it simple
- **Strategy**: Focus on connecting small towns economically

**Budget Constraint**: €50M starting, prioritize cheap infrastructure

**Key Lessons**:

- Master basic connection patterns
- Understand 110kV line capacity (~300 MW)
- Learn snap-to-grid and collision detection

### Mid Game (Cities 6-15)

**Recommended Components**:

- **Generation**: Add Nuclear (1000 MW) - €5B - Stable baseload
- **Transmission**: Mix of 220 kV and 400 kV lines - Balance cost and capacity
- **Substations**: Strategic substations - Manage voltage over longer distances
- **Infrastructure**: First switching stations - Begin building redundancy
- **Pylons**: Start using pylons for long-distance transmission

**Budget Constraint**: Revenue growing, can afford larger investments

**Key Lessons**:

- First large city teaches multi-connection requirement (3-4 × 110kV lines)
- Learn voltage cascade architecture (400→220→110kV)
- Understand N-1 redundancy concepts

### Late Game (Cities 16+)

**Recommended Components**:

- **Generation**: Multiple large plants (Nuclear, Hydro) - Total 5-10 GW
- **Transmission**: Predominantly 400 kV backbone - Long-distance bulk transport
- **Substations**: Extensive substation network - Complex grid management
- **Infrastructure**: Switching station mesh - N-1 redundancy critical
- **Pylons**: Transmission corridors with multi-line capacity

**Budget Constraint**: High revenue, but also high costs for failures

**Key Lessons**:

- Major metros require 10-20 × 110kV connections
- Complex mesh topologies for reliability
- Strategic pylon placement for transmission corridors

---

## Quick Reference Tables

### Power Plant Comparison

| Type     | Capacity    | Cost       | Ramp Rate | Best For               |
| -------- | ----------- | ---------- | --------- | ---------------------- |
| Nuclear  | 900-1650 MW | €4-6B      | Slow      | Baseload 24/7          |
| Coal     | 500-1000 MW | €2-3B      | Medium    | Legacy baseload        |
| CCGT     | 400-800 MW  | €800M-1.2B | Fast      | Peaking, flexibility   |
| Hydro    | 100-2000 MW | €2-4B      | Instant   | Balancing, emergency   |
| Wind Off | 400-1200 MW | €1.5-2.5B  | N/A (V2)  | Coastal renewables     |
| Wind On  | 50-300 MW   | €150-250M  | N/A (V2)  | Distributed renewables |
| Solar    | 50-300 MW   | €100-200M  | N/A (V2)  | Daytime renewables     |

### Transmission Line Comparison

| Voltage | Capacity      | Cost/km   | Max Span | Use Case               |
| ------- | ------------- | --------- | -------- | ---------------------- |
| 400 kV  | 1000-2000 MVA | €1-2M     | 100 km   | Long-distance backbone |
| 220 kV  | 400-800 MVA   | €600k-1M  | 75 km    | Regional transmission  |
| 110 kV  | 100-300 MVA   | €300-500k | 50 km    | City connections       |

### City Demand by Size

| Size        | Demand       | Population | 110kV Lines | Complexity   |
| ----------- | ------------ | ---------- | ----------- | ------------ |
| Small Town  | 20-50 MW     | 20k-50k    | 1           | Simple       |
| Medium City | 100-200 MW   | 100k       | 1-2         | Moderate     |
| Large City  | 500-800 MW   | 500k       | 3-4         | Complex      |
| Major Metro | 2000-5000 MW | 1M+        | 10-20       | Very Complex |

### Infrastructure Costs

| Component         | Cost    | Function                  | When to Use                             |
| ----------------- | ------- | ------------------------- | --------------------------------------- |
| Pylon             | €0.5-1M | Structural support        | Lines >max span, transmission corridors |
| Switching Station | €5-10M  | Routing + Breaker control | Redundancy, fault isolation             |
| Zone Substation   | €20-40M | 220→110kV transformation  | Near every city/city cluster            |
| Grid Substation   | €50-80M | 400→220kV transformation  | Major junctions, bulk distribution      |

---

## Strategic Principles

### Voltage Management

1. **Always use proper cascade**: 400kV → 220kV → 110kV (never skip levels)
2. **Grid substations first**: Place at major junctions 100+ km from plants
3. **Zone substations near cities**: One per city or city cluster
4. **Line voltage is automatic**: Determined by source/target nodes

### City Connections

1. **110kV capacity limit**: Each line maxes at ~300 MW
2. **Plan for growth**: Small towns become medium cities
3. **Multi-connection early**: Build 2 lines even if 1 sufficient (redundancy)
4. **Large cities**: Always 3-4 × 110kV lines minimum

### Reliability (N-1 Contingency)

1. **Parallel paths**: Always build redundant routes for critical cities
2. **Switching stations**: Enable fault isolation and rerouting
3. **Don't overload**: Keep lines at 80-90% max capacity
4. **Breaker management**: Manually control power flow when needed

### Cost Optimization

1. **Pylons for corridors**: Reuse pylons for multiple lines (huge savings)
2. **Switching stations**: 10x cheaper than substations when no voltage change needed
3. **Direct routes**: Minimize line distance where possible
4. **Strategic substations**: Don't overbuild - one grid sub can serve multiple zone subs

---

## Common Mistakes to Avoid

### Mistake 1: Single 110kV Line to Large City

**Problem**: Large city (600 MW) connected with only one 110kV line (300 MW capacity)

**Result**: 50% power delivery, happiness penalty, revenue loss

**Fix**: Build multiple zone substations with 110kV lines (3-4 lines minimum)

### Mistake 2: Skipping Voltage Levels

**Problem**: Trying to connect 400kV plant directly to 110kV city

**Result**: Invalid connection, line won't work

**Fix**: Use proper cascade: Plant (400kV) → Grid Sub (400→220) → Zone Sub (220→110) → City

### Mistake 3: No Redundancy

**Problem**: Single line from plant to city

**Result**: One line failure = total blackout

**Fix**: Build parallel paths with switching stations for N-1 redundancy

### Mistake 4: Ignoring Distance Limits

**Problem**: 400kV line spanning 250km without pylons

**Result**: Phase 0 warning, Phase 1 blocked

**Fix**: Place pylons every ~80-90km on long-distance lines

### Mistake 5: Underestimating Major Metros

**Problem**: Major metro (4000 MW) with only 5 × 110kV lines (1500 MW capacity)

**Result**: Massive power shortfall, happiness crash, potential game over

**Fix**: Plan extensive distribution network (12-20 zone substations)

---

## Tutorial Progression

### Lesson 1: Basic Connection

- Connect small town (50 MW) with single 110kV line
- Learn snap-to-grid and component placement
- Understand basic power delivery

### Lesson 2: Voltage Cascade

- Build first grid substation (400→220kV)
- Build first zone substation (220→110kV)
- Connect city through proper voltage levels

### Lesson 3: Multi-Connection Requirement

- Large city (600 MW) spawns
- Single line delivers only 300 MW (failure)
- Build additional zone substations to meet demand

### Lesson 4: Long-Distance Transmission

- Plant located 200km from city
- Learn to place pylons for distance support
- Understand transmission corridors

### Lesson 5: Redundancy (N-1)

- Build parallel paths with switching station
- Trigger line failure simulation
- Watch power reroute through backup path

---

## Related Documents

- See [PowerPlants.md](./PowerPlants.md) for generation specifications
- See [Cities.md](./Cities.md) for demand requirements and multi-connection details
- See [TransmissionLines.md](./TransmissionLines.md) for line specifications
- See [Substations.md](./Substations.md) for voltage transformation strategy
- See [SwitchingStations.md](./SwitchingStations.md) for redundancy patterns
- See [Pylons.md](./Pylons.md) for long-distance transmission
- See [UISpecification.md](./UISpecification.md) for placement mechanics
