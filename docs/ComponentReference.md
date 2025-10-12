# GridSim - Component Reference

This document provides detailed specifications for all grid components and their costs.

---

## 1. Power Plants

All plants auto-dispatch to match demand up to their maximum capacity in V1.

### 1.1 Nuclear

- **Capacity**: 900-1650 MW
- **Type**: Baseload
- **Ramp Rate**: Slow (hours)
- **Construction Cost**: €4-6B (1000 MW)
- **Operating Characteristics**: Cannot quickly adjust output, best for constant baseload
- **V1 Behavior**: Auto-dispatch up to capacity
- **Typical Use**: Provide stable baseload power 24/7

### 1.2 Coal (Legacy)

- **Capacity**: 500-1000 MW
- **Type**: Baseload/intermediate
- **Ramp Rate**: Medium (30-60 min)
- **Construction Cost**: €2-3B (800 MW)
- **Operating Characteristics**: Being phased out, moderate flexibility
- **V1 Behavior**: Auto-dispatch up to capacity
- **Typical Use**: Supplement baseload, being replaced by cleaner sources

### 1.3 CCGT (Combined Cycle Gas Turbine)

- **Capacity**: 400-800 MW
- **Type**: Peaking/intermediate
- **Ramp Rate**: Fast (10-15 min)
- **Construction Cost**: €800M-1.2B (600 MW)
- **Operating Characteristics**: Good for load following, flexible
- **V1 Behavior**: Auto-dispatch up to capacity
- **Typical Use**: Handle demand fluctuations, peak load

### 1.4 Hydro

- **Capacity**: 100-2000 MW
- **Type**: Dispatchable/peaking
- **Ramp Rate**: Instant
- **Construction Cost**: €2-4B (500 MW, location dependent)
- **Operating Characteristics**: Perfect for balancing, limited by water availability
- **V1 Behavior**: Auto-dispatch up to capacity
- **Typical Use**: Rapid response to demand changes, emergency reserves
- **Geographic Constraint**: Requires suitable water resources

### 1.5 Wind Offshore

- **Capacity**: 400-1200 MW (farms)
- **Type**: Variable (V2 feature - intermittent generation)
- **Construction Cost**: €1.5-2.5B (800 MW farm)
- **Location Constraint**: Coastal areas
- **V1 Behavior**: Auto-dispatch up to capacity (no variability yet)
- **V2 Enhancement**: Weather-dependent generation
- **Typical Use**: Renewable energy source, high capacity factor

### 1.6 Wind Onshore

- **Capacity**: 50-300 MW (farms)
- **Type**: Variable (V2 feature - intermittent generation)
- **Construction Cost**: €150-250M (100 MW farm)
- **Location Constraint**: Open terrain
- **V1 Behavior**: Auto-dispatch up to capacity (no variability yet)
- **V2 Enhancement**: Weather-dependent generation
- **Typical Use**: Distributed renewable energy, lower cost than offshore

### 1.7 Solar

- **Capacity**: 50-300 MW (farms)
- **Type**: Variable (V2 feature - intermittent generation)
- **Construction Cost**: €100-200M (100 MW farm)
- **Location Preference**: Southern Europe (higher solar irradiance)
- **V1 Behavior**: Auto-dispatch up to capacity (no variability yet)
- **V2 Enhancement**: Day/night cycle, weather-dependent generation
- **Typical Use**: Daytime renewable energy, peaks with demand

---

## 2. Cities (Load Centers)

Cities consume power and generate revenue. Demand varies by time of day and season.

### 2.1 Small Town

- **Demand**: 20-50 MW
- **Population**: ~20,000-50,000
- **Typical Examples**: Rural towns, small municipalities
- **Demand Profile**: Residential-focused (strong evening peak)
- **Revenue Potential**: Low but steady
- **Connection Complexity**: Simple, short transmission lines

### 2.2 Medium City

- **Demand**: 100-200 MW
- **Population**: ~100,000
- **Typical Examples**: Regional centers, mid-size cities
- **Demand Profile**: Mixed residential/commercial (daytime + evening peaks)
- **Revenue Potential**: Medium
- **Connection Complexity**: Moderate, may require substation

### 2.3 Large City

- **Demand**: 500-800 MW
- **Population**: ~500,000
- **Typical Examples**: Major provincial cities
- **Demand Profile**: Diverse mix (flatter profile with peaks)
- **Revenue Potential**: High
- **Connection Complexity**: Requires multiple substations, redundant paths

### 2.4 Major Metro

- **Demand**: 2000-5000 MW
- **Population**: 1M+ (London, Paris, Madrid scale)
- **Typical Examples**: Capital cities, major metropolitan areas
- **Demand Profile**: Very diverse (24/7 industrial + residential peaks)
- **Revenue Potential**: Very high
- **Connection Complexity**: Complex grid topology, multiple plants needed

### 2.5 Demand Characteristics

**Daily Cycle**:

- 00:00-06:00: Low demand (60-70% of peak)
- 06:00-09:00: Morning ramp-up
- 09:00-17:00: Daytime plateau (80-90% of peak)
- 17:00-21:00: Evening peak (100% demand)
- 21:00-24:00: Evening decline

**Seasonal Variation**:

- **Summer**: Higher baseline (air conditioning)
- **Winter**: Higher baseline in northern regions (heating)
- **Spring/Fall**: Moderate baseline

**Profiles by City Type**:

- **Residential**: Strong evening peak
- **Industrial**: Flatter 24/7 profile
- **Commercial**: Daytime focused

---

## 3. Transmission Lines

Lines transport power between nodes. Voltage level affects capacity, losses, and cost.

### 3.1 Voltage Levels

#### 400 kV - Main Transmission Backbone

- **Purpose**: Long-distance bulk power transmission
- **Capacity**: 1000-2000 MVA
- **Construction Cost**: €1-2M/km
- **Typical Use**: Connect major plants to grid, span regions
- **Losses**: ~2-4% per 100 km
- **Visual**: Thickest line rendering

#### 220 kV - Regional Transmission

- **Purpose**: Regional power distribution
- **Capacity**: 400-800 MVA
- **Construction Cost**: €600k-1M/km
- **Typical Use**: Connect substations, medium-distance transport
- **Losses**: ~3-5% per 100 km
- **Visual**: Medium thickness line rendering

#### 110 kV - Sub-transmission

- **Capacity**: 100-300 MVA
- **Construction Cost**: €300-500k/km
- **Typical Use**: Feed cities, local distribution
- **Losses**: ~4-6% per 100 km
- **Visual**: Thin line rendering

#### 33/20 kV - Distribution to Cities

- **Purpose**: Final delivery to cities (implied, not built by player in V1)
- **Note**: Cities automatically connect to nearest 110kV line or substation

### 3.2 Physical Characteristics

- **Resistance**: Increases linearly with distance (I²R losses)
- **Thermal Capacity**: Limits in MVA (ampacity)
- **Voltage Drop**: Increases with distance and load
- **Impedance**: Combination of resistance + reactance

### 3.3 Failure Behavior

- **Overload**: When currentLoad > capacity
- **Circuit Breaker**: Automatically trips to protect line
- **Consequence**: Blackout to all downstream components
- **Cascading Risk**: Load redistributes to parallel paths, may overload them too
- **Player Action**: Must reset breaker manually after resolving issue

---

## 4. Substations

Transform voltage between transmission levels. Essential for voltage management over long distances.

### 4.1 Voltage Transformation Ratios

#### 400/220 kV Substation

- **Purpose**: Step down from main transmission to regional
- **Capacity**: Variable (choose when building)
- **Transformer Capacity Limit**: MVA
- **Losses**: 1-2% per transformation
- **Construction Cost**: €50-80M
- **Typical Location**: Major grid junctions, near large cities

#### 220/110 kV Substation

- **Purpose**: Step down from regional to sub-transmission
- **Capacity**: Variable (choose when building)
- **Transformer Capacity Limit**: MVA
- **Losses**: 1-2% per transformation
- **Construction Cost**: €20-40M
- **Typical Location**: City outskirts, regional distribution points

#### 110/33 kV Substation

- **Purpose**: Step down to distribution voltage for cities
- **Capacity**: Variable (choose when building)
- **Transformer Capacity Limit**: MVA
- **Losses**: 1-2% per transformation
- **Construction Cost**: €8-15M
- **Typical Location**: City connection points

### 4.2 Placement Strategy

**When to Place Substations**:

- Voltage drop over distance reduces power delivery to cities
- Threshold: Below 95% voltage = reduced delivery
- Long transmission distances (>100 km at 400 kV)
- Before connecting to lower voltage network

**Benefits**:

- Maintains voltage levels across grid
- Reduces losses on lower voltage segments
- Enables proper grid segmentation

---

## 5. Switching Stations

Enable complex grid topologies through passive routing and breaker control.

### 5.1 Characteristics

- **Purpose**: Connect multiple transmission line segments and route power
- **Voltage Transformation**: None (passive routing at same voltage)
- **Construction Cost**: €5-10M (simple routing junction)
- **Breaker Control**: Player can manually open/close breakers
- **Protection**: Automatically trips breakers on overload
- **Cost vs Substation**: ~10x cheaper

### 5.2 Use Cases

#### Line Intersections/Junctions

- Connect 3+ line segments at a point
- Enable complex grid topologies
- Split power flows

#### Grid Redundancy (N-1 Contingency)

- Create parallel paths between nodes
- If one line fails, power reroutes through others
- Critical for grid reliability

#### Fault Isolation

- Disconnect problem segments without affecting entire grid
- Manual breaker control allows surgical grid management
- Essential for maintenance and crisis response

#### Complex Grid Topologies

- Mesh networks instead of simple trees
- Multiple paths from generation to load
- More resilient but requires careful capacity planning

### 5.3 Breaker States

- **Closed**: Power flows through breaker normally
- **Open**: Manual disconnect, no power flow
- **Tripped**: Automatic disconnect due to overload, requires manual reset

---

## 6. Construction Costs Summary

### 6.1 Power Plants

| Type          | Capacity    | Cost                       |
| ------------- | ----------- | -------------------------- |
| Nuclear       | 1000 MW     | €4-6B                      |
| Coal          | 800 MW      | €2-3B                      |
| CCGT          | 600 MW      | €800M-1.2B                 |
| Hydro         | 500 MW      | €2-4B (location dependent) |
| Wind Offshore | 800 MW farm | €1.5-2.5B                  |
| Wind Onshore  | 100 MW farm | €150-250M                  |
| Solar         | 100 MW farm | €100-200M                  |

### 6.2 Transmission Lines (per km)

| Voltage | Capacity      | Cost per km |
| ------- | ------------- | ----------- |
| 400 kV  | 1000-2000 MVA | €1-2M       |
| 220 kV  | 400-800 MVA   | €600k-1M    |
| 110 kV  | 100-300 MVA   | €300-500k   |

### 6.3 Cost Multipliers (Terrain)

| Terrain Type      | Multiplier | Notes                       |
| ----------------- | ---------- | --------------------------- |
| Normal            | 1x         | Open land, flat terrain     |
| Mountainous       | 2-3x       | Alps, Pyrenees, Carpathians |
| Submarine Cable   | 4-6x       | Cross water bodies          |
| Urban Underground | 3-4x       | Dense city routing          |

### 6.4 Substations

| Type       | Cost    | Typical Capacity |
| ---------- | ------- | ---------------- |
| 400/220 kV | €50-80M | High MVA         |
| 220/110 kV | €20-40M | Medium MVA       |
| 110/33 kV  | €8-15M  | Low MVA          |

### 6.5 Switching Stations

| Type              | Cost   | Notes                   |
| ----------------- | ------ | ----------------------- |
| Switching Station | €5-10M | Simple routing junction |

---

## 7. Component Selection Guidelines

### 7.1 Early Game (Cities 1-5)

**Recommended Components**:

- 1x CCGT (600 MW) - €1B - Good flexibility for small loads
- 110 kV transmission lines - Sufficient for short distances
- Minimal substations - Keep it simple

**Budget Constraint**: €50M starting, prioritize cheap infrastructure

### 7.2 Mid Game (Cities 6-15)

**Recommended Components**:

- Add Nuclear (1000 MW) - €5B - Stable baseload
- Mix of 220 kV and 400 kV lines - Balance cost and capacity
- Strategic substations - Manage voltage over longer distances
- First switching stations - Begin building redundancy

**Budget Constraint**: Revenue growing, can afford larger investments

### 7.3 Late Game (Cities 16+)

**Recommended Components**:

- Multiple large plants (Nuclear, Hydro) - Total 5-10 GW
- Predominantly 400 kV backbone - Long-distance bulk transport
- Extensive substation network - Complex grid management
- Switching station mesh - N-1 redundancy critical

**Budget Constraint**: High revenue, but also high costs for failures

---

## 8. Quick Reference Tables

### 8.1 Power Plant Comparison

| Type     | Capacity    | Cost       | Ramp Rate | Best For               |
| -------- | ----------- | ---------- | --------- | ---------------------- |
| Nuclear  | 900-1650 MW | €4-6B      | Slow      | Baseload 24/7          |
| Coal     | 500-1000 MW | €2-3B      | Medium    | Legacy baseload        |
| CCGT     | 400-800 MW  | €800M-1.2B | Fast      | Peaking, flexibility   |
| Hydro    | 100-2000 MW | €2-4B      | Instant   | Balancing, emergency   |
| Wind Off | 400-1200 MW | €1.5-2.5B  | N/A (V2)  | Coastal renewables     |
| Wind On  | 50-300 MW   | €150-250M  | N/A (V2)  | Distributed renewables |
| Solar    | 50-300 MW   | €100-200M  | N/A (V2)  | Daytime renewables     |

### 8.2 Transmission Line Comparison

| Voltage | Capacity      | Cost/km   | Use Case               |
| ------- | ------------- | --------- | ---------------------- |
| 400 kV  | 1000-2000 MVA | €1-2M     | Long-distance backbone |
| 220 kV  | 400-800 MVA   | €600k-1M  | Regional transmission  |
| 110 kV  | 100-300 MVA   | €300-500k | City connections       |

### 8.3 City Demand by Size

| Size        | Demand       | Population | Complexity   |
| ----------- | ------------ | ---------- | ------------ |
| Small Town  | 20-50 MW     | 20k-50k    | Simple       |
| Medium City | 100-200 MW   | 100k       | Moderate     |
| Large City  | 500-800 MW   | 500k       | Complex      |
| Major Metro | 2000-5000 MW | 1M+        | Very Complex |

---

## Document References

- See **PhysicsSpec.md** for power flow calculations affecting components
- See **TechnicalSpec.md** for data models and implementation
- See **GeographyAndEconomy.md** for economic details and terrain effects
- See **DesignDoc.md** for high-level component integration in gameplay
