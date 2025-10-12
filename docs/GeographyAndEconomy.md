# GridSim - Geography and Economy

This document covers geography constraints, time simulation, economy, happiness system, and scoring.

---

## 1. Geography & Constraints

### 1.1 European Context

The game simulates realistic European power grid scale and geography:

- **Country Scale**: 500-1000 km across
- **City Spacing**: Typically 50-200 km apart
- **Diverse Terrain**: Mountains, water bodies, plains affecting routing
- **Cross-Border Interconnections**: Common in European grid

**Map Type** (V1): Abstract/stylized map (not actual European geography)
**Future** (V2+): Real European geography map option

### 1.2 Geographic Obstacles

#### Mountains

- **Examples**: Alps, Pyrenees, Carpathians, Scandinavian ranges
- **Routing Constraint**: Impassable, cannot build through
- **Player Impact**: Forces longer routing around obstacles
- **Cost Multiplier**: 2-3× in mountainous terrain (when building nearby)

**Strategic Consideration**: Plan routes early to avoid expensive detours

#### Water Bodies

- **Examples**: Mediterranean, North Sea, Baltic Sea, major rivers
- **Routing Constraint**: Requires submarine cables
- **Cost Multiplier**: 4-6× (very expensive)
- **Additional Challenges**: Higher losses, limited capacity vs land lines
- **Strategic Impact**: Creates choke points in grid

**Submarine Cable Specs**:

- Same voltage levels as land lines (400 kV, 220 kV, 110 kV)
- Capacity: Same MVA ratings
- Losses: +50% compared to land lines of same length
- Construction time: Slower (Phase 2 feature)

#### Protected Areas

- **Examples**: National parks, nature reserves, UNESCO sites
- **Routing Constraint**: Impassable, cannot build through
- **Player Impact**: Must route around, similar to mountains
- **No Cost Multiplier**: When avoiding, but forces longer routes

**Visual**: Shown on map with distinct overlay (e.g., green striped areas)

#### Urban Areas

- **Examples**: Dense city centers, metropolitan areas
- **Routing Constraint**: Can build through but very expensive
- **Cost Multiplier**: 3-4× (underground routing required)
- **Regulatory Complexity**: Higher cost reflects permits, rights-of-way

**Strategic Consideration**: Route around cities when possible, go through only if significantly shorter

### 1.3 Line Routing Mechanics

**Player Control**: Manual drawing of transmission line routes

**Routing Rules**:

1. Click start node (plant, substation, or switching station)
2. Drag to draw path (can add waypoints by clicking)
3. Click end node to complete
4. Cannot cross through impassable obstacles
5. Cannot cross existing lines without adding junction (switching station)

**Validation**:

```typescript
function validateRoute(path: Point[], obstacles: Obstacle[]): RouteValidation {
  // Check obstacle intersections
  for (const obstacle of obstacles) {
    if (obstacle.type === 'mountain' || obstacle.type === 'protected') {
      if (pathIntersects(path, obstacle)) {
        return { valid: false, reason: 'Path crosses impassable obstacle' }
      }
    }
  }

  // Calculate cost with terrain multipliers
  const cost = calculateRouteCost(path, obstacles)

  return { valid: true, cost, distance: calculateDistance(path) }
}
```

**Distance Calculation**: Sum of segment lengths (Euclidean distance between waypoints)

**Cost Calculation**:

```typescript
function calculateRouteCost(path: Point[], terrain: TerrainMap): number {
  let totalCost = 0

  for (let i = 0; i < path.length - 1; i++) {
    const segment = { from: path[i], to: path[i + 1] }
    const distance = euclideanDistance(segment.from, segment.to)
    const multiplier = getTerrainMultiplier(segment, terrain)

    totalCost += distance * BASE_COST_PER_KM * multiplier
  }

  return totalCost
}
```

**Visual Feedback**:

- Green: Valid, affordable route
- Yellow: Valid, expensive route
- Red: Invalid route (crosses obstacle or unaffordable)
- Show estimated cost and distance while drawing

---

## 2. Time Simulation

### 2.1 Time Scale

**Real-Time Simulation** with player-controlled speed:

- **1x**: Real-time (1 second real = 1 minute game)
- **2x**: 2 minutes per real second
- **5x**: 5 minutes per real second
- **10x**: 10 minutes per real second

**Pause**: Player can pause anytime for planning

**Time Cycles**:

- **Day/Night**: 24-hour cycle (1440 minutes)
- **Seasonal**: Spring → Summer → Fall → Winter (90 days each = 360 day year)

**Display**: Show current time, date, season in UI

### 2.2 Daily Demand Curve

Cities have time-varying demand following realistic patterns.

**Typical Pattern** (applied as multiplier to base demand):

| Time        | Demand Multiplier | Description     |
| ----------- | ----------------- | --------------- |
| 00:00-06:00 | 0.60-0.70         | Nighttime low   |
| 06:00-09:00 | 0.70-0.90         | Morning ramp-up |
| 09:00-17:00 | 0.80-0.90         | Daytime plateau |
| 17:00-21:00 | 0.95-1.00         | Evening peak    |
| 21:00-24:00 | 0.80-0.70         | Evening decline |

**Implementation**:

```typescript
function getDemandMultiplier(timeOfDay: number, cityType: CityType): number {
  // timeOfDay in hours (0-24)

  if (timeOfDay >= 0 && timeOfDay < 6) {
    return interpolate(0.65, 0.7, timeOfDay / 6) // Nighttime
  } else if (timeOfDay >= 6 && timeOfDay < 9) {
    return interpolate(0.7, 0.9, (timeOfDay - 6) / 3) // Morning ramp
  } else if (timeOfDay >= 9 && timeOfDay < 17) {
    return 0.85 + cityTypeVariation(cityType) // Daytime
  } else if (timeOfDay >= 17 && timeOfDay < 21) {
    return interpolate(0.85, 1.0, (timeOfDay - 17) / 4) // Evening peak
  } else {
    return interpolate(1.0, 0.7, (timeOfDay - 21) / 3) // Evening decline
  }
}
```

**Variations by City Type**:

| City Type   | Profile             | Characteristics                            |
| ----------- | ------------------- | ------------------------------------------ |
| Residential | Strong evening peak | 1.0 multiplier at 19:00, 0.60 at 03:00     |
| Industrial  | Flatter 24/7        | 0.85 multiplier all day, minimal variation |
| Commercial  | Daytime focused     | 0.95 multiplier 09:00-17:00, 0.60 at night |

**Mixed Cities**: Blend of residential/commercial/industrial (weighted average)

### 2.3 Seasonal Variation

**Fixed Patterns** (no random weather in V1):

#### Summer (June-August)

- **Baseline Demand**: +10% (air conditioning)
- **Peak Demand Time**: Afternoon (14:00-16:00) when AC maxes out
- **Future (V2)**: Solar generation at maximum, wind typically lower

#### Winter (December-February)

- **Baseline Demand**: +15% in northern regions (heating)
- **Peak Demand Time**: Evening (18:00-20:00) when heating + lighting
- **Future (V2)**: Solar generation at minimum, wind typically higher

#### Spring/Fall (Shoulder Seasons)

- **Baseline Demand**: Normal (0% modifier)
- **Peak Demand Time**: Evening (standard residential peak)
- **Future (V2)**: Moderate renewable generation

**Implementation**:

```typescript
function getSeasonalMultiplier(season: Season, region: Region): number {
  switch (season) {
    case Season.Summer:
      return 1.1 // +10% for AC
    case Season.Winter:
      return region === 'north' ? 1.15 : 1.05 // +15% north, +5% south
    case Season.Spring:
    case Season.Fall:
      return 1.0 // No modifier
  }
}

function calculateCityDemand(city: City, time: DateTime): number {
  const timeMultiplier = getDemandMultiplier(time.hour, city.type)
  const seasonMultiplier = getSeasonalMultiplier(time.season, city.region)

  return city.baseDemand * timeMultiplier * seasonMultiplier
}
```

---

## 3. Economy & Resources

### 3.1 Budget System

**Starting Budget**: €50M

- Sufficient for initial expansion (1-2 small cities)
- Requires careful planning

**Income**: Revenue from power delivery

```
revenue = powerDelivered (MWh) × electricityPrice (€/MWh)
```

**Expenses**: Construction costs (one-time, instant in V1)

- Power plants: €100M-€6B (see ComponentReference.md)
- Transmission lines: €300k-€2M per km
- Substations: €8M-€80M
- Switching stations: €5M-€10M

**No Maintenance Costs in V1** (deferred to V2)

**Budget Updates**: Real-time as power delivered and infrastructure built

### 3.2 Bankruptcy

**Condition**: Budget remains negative after grace period

**Grace Period**: 30 days (simulated time)

- Allows temporary deficit for large investments
- Warning shown when budget goes negative
- Countdown timer starts

**Game Over Trigger**:

```typescript
function checkBankruptcy(budget: number, daysNegative: number): GameOverCheck {
  if (budget < 0) {
    if (daysNegative >= 30) {
      return { gameOver: true, reason: 'Bankruptcy (negative budget for 30 days)' }
    }
  }
  return { gameOver: false }
}
```

**Player Strategy**:

- Build happiness buffer during good times (low prices)
- Raise prices when finances tight
- Plan expensive builds after revenue stable

### 3.3 Electricity Pricing

**Player Control**: Set grid-wide €/MWh rate

**Typical Range**:

- **Low**: €20-40/MWh (subsidized, public service focus)
- **Medium**: €50-80/MWh (balanced)
- **High**: €100-150/MWh (profit-focused)

**Effects on Gameplay**:

| Price Level | Revenue            | Happiness Gain Rate     |
| ----------- | ------------------ | ----------------------- |
| €20-40/MWh  | Low profit margin  | Fast happiness gain     |
| €50-80/MWh  | Balanced           | Moderate happiness gain |
| €100+/MWh   | High profit margin | Slow happiness gain     |

**Formula**:

```typescript
function getHappinessGainRate(price: number): number {
  // Base rate at €50/MWh = 1.0
  // Lower price = higher gain rate
  // Higher price = lower gain rate

  const basePrice = 50
  const priceRatio = basePrice / price

  return Math.max(0.2, Math.min(2.0, priceRatio))
}
```

**Strategic Considerations**:

- **Early Game**: Low prices to build happiness buffer
- **Stable Grid**: Raise prices for profit and expansion
- **Crisis**: Drop prices to recover happiness quickly
- **Late Game**: Balance profit with happiness maintenance

**Future (V2)**: Cities may reject excessively high prices (demand elasticity)

### 3.4 Revenue Calculation

**Per City**:

```typescript
function calculateCityRevenue(city: City, price: number, deltaTime: number): number {
  // deltaTime in hours
  const powerDeliveredMWh = city.powerReceived * deltaTime
  return powerDeliveredMWh * price
}
```

**Total Revenue**:

```typescript
function calculateTotalRevenue(grid: Grid, price: number, deltaTime: number): number {
  let totalRevenue = 0

  for (const city of grid.cities) {
    if (city.connected) {
      totalRevenue += calculateCityRevenue(city, price, deltaTime)
    }
  }

  return totalRevenue
}
```

**Budget Update**:

```typescript
function updateBudget(grid: Grid, deltaTime: number): void {
  const revenue = calculateTotalRevenue(grid, grid.electricityPrice, deltaTime)
  grid.budget += revenue

  // Track if budget negative for bankruptcy check
  if (grid.budget < 0) {
    grid.daysNegative += deltaTime / 24
  } else {
    grid.daysNegative = 0
  }
}
```

---

## 4. Happiness System

### 4.1 Happiness Meter

**Range**: 0-100%

**Initialization**: Start at 50%

**Game Over Condition**: Happiness reaches 0%

**No Passive Decay**: Happiness only changes based on player performance

**Display**: Prominent meter in UI with color coding:

- Green: 60-100% (healthy)
- Yellow: 30-59% (warning)
- Red: 0-29% (critical)

### 4.2 Happiness Gains

**Steady Power Delivery**: Meeting city demand increases happiness slowly

```typescript
function calculateHappinessGain(grid: Grid, electricityPrice: number, deltaTime: number): number {
  let totalGain = 0

  for (const city of grid.cities) {
    if (city.connected && city.powerReceived >= city.currentDemand) {
      // Base gain rate modified by price
      const priceMultiplier = getHappinessGainRate(electricityPrice)
      const baseGain = 0.1 // 0.1% per hour per city (tunable)

      totalGain += baseGain * priceMultiplier * deltaTime
    }
  }

  return totalGain
}
```

**Typical Rates**:

- Low prices (€30/MWh): +0.15%/hour per powered city
- Medium prices (€60/MWh): +0.10%/hour per powered city
- High prices (€120/MWh): +0.05%/hour per powered city

**Strategic Implication**: More cities powered = faster happiness gain

### 4.3 Happiness Losses

#### Blackouts

**Severity Factors**:

1. **Percentage of Demand Unmet**: Partial vs complete blackout
2. **Duration**: How long blackout lasts
3. **Affected Population**: Larger cities = bigger impact

```typescript
function calculateBlackoutPenalty(city: City, shortfall: number, duration: number): number {
  const shortfallRatio = shortfall / city.currentDemand
  const populationWeight = city.population / 100000 // Scale by 100k people

  // Base penalty: -1% per hour for complete blackout of 100k people
  const basePenalty = -1.0

  return basePenalty * shortfallRatio * populationWeight * duration
}
```

**Example**:

- Large city (500k pop) with complete blackout for 1 hour: -5% happiness
- Small town (30k pop) with 50% blackout for 30 min: -0.075% happiness

**Partial Blackouts** (voltage drop):

- Less severe than complete blackout
- Penalty scales with shortfall percentage

#### Unconnected Cities

**Penalty**: Announced city not connected by deadline

**Immediate Penalty**: -5% happiness (city announcement deadline missed)

**Ongoing Penalty**: -0.5% per day while city remains unpowered

```typescript
function calculateUnconnectedPenalty(city: City, daysUnpowered: number): number {
  if (!city.connected && city.announced) {
    const deadlinePenalty = city.deadlineMissed ? -5.0 : 0
    const ongoingPenalty = daysUnpowered * -0.5

    return deadlinePenalty + ongoingPenalty
  }
  return 0
}
```

**Strategic Implication**: Connect cities on time to avoid steep penalty

### 4.4 Strategic Considerations

**Building Happiness Buffer**:

- Keep grid stable for extended periods
- Use low prices during stable times
- Accumulate happiness for future crises

**Crisis Response**:

- Prioritize restoring power to largest cities (biggest penalty reduction)
- Drop prices temporarily to accelerate recovery
- Accept lower profits during recovery period

**Balance Expansion Pace**:

- Don't expand too fast (risk of blackouts)
- Don't expand too slow (miss city deadlines, lose happiness)
- Build redundancy (N-1) before taking on more cities

---

## 5. Success Metrics & Scoring

### 5.1 Player Performance Metrics

**Displayed to Player** (live during game):

| Metric              | Description                                   |
| ------------------- | --------------------------------------------- |
| Cities Connected    | Number of cities powered / total cities       |
| Total Uptime        | Percentage of time cities received full power |
| Total MWh Delivered | Cumulative power delivered to all cities      |
| Grid Efficiency     | (100% - losses%) average                      |
| Peak Cities         | Maximum simultaneous cities powered           |
| Happiness           | Current happiness level (0-100%)              |
| Total Revenue       | Cumulative revenue earned                     |
| Blackout Incidents  | Count of breaker trips / blackouts            |

### 5.2 Score Calculation

**Final Score** (calculated at game over):

```
Score = (Cities Powered × 1000)
      + (Uptime % × 500)
      + (Efficiency % × 300)
      + (Total Revenue / €1M × 100)
      - (Blackouts × 200)
```

**Example**:

- 25 cities powered
- 95% uptime
- 92% efficiency
- €500M revenue
- 3 blackout incidents

```
Score = (25 × 1000) + (95 × 500) + (92 × 300) + (500 × 100) - (3 × 200)
      = 25000 + 47500 + 27600 + 50000 - 600
      = 149,500 points
```

**Leaderboard**: Track high scores (local storage in V1, online in V2)

### 5.3 Achievements (Future Feature)

**Milestones**:

- Connect 10 / 25 / 50 cities
- Maintain 99% uptime for 30 days
- Build a 10 GW grid (total capacity)
- Survive 1 year (4 seasons)
- Zero blackouts for 90 days
- Profitable at high happiness (both >80%)

**Display**: Achievement badges, progress tracking

---

## 6. Quick Reference Tables

### 6.1 Geographic Cost Multipliers

| Terrain     | Multiplier | Examples          |
| ----------- | ---------- | ----------------- |
| Normal      | 1×         | Plains, open land |
| Mountainous | 2-3×       | Alps, Pyrenees    |
| Submarine   | 4-6×       | Cross seas/rivers |
| Urban       | 3-4×       | Through cities    |

### 6.2 Time Simulation

| Cycle     | Duration | Description            |
| --------- | -------- | ---------------------- |
| Day/Night | 24 hours | Demand curve variation |
| Season    | 90 days  | Baseline demand shift  |
| Year      | 360 days | Full seasonal cycle    |

### 6.3 Budget & Pricing

| Price Range | Strategy       | Happiness Rate             | Profit |
| ----------- | -------------- | -------------------------- | ------ |
| €20-40/MWh  | Public service | Fast gain (+0.15%/hr/city) | Low    |
| €50-80/MWh  | Balanced       | Moderate (+0.10%/hr/city)  | Medium |
| €100+/MWh   | Profit-focused | Slow (+0.05%/hr/city)      | High   |

### 6.4 Happiness Impacts

| Event                          | Impact    | Notes                   |
| ------------------------------ | --------- | ----------------------- |
| City fully powered (low price) | +0.15%/hr | Per city                |
| Complete blackout (100k pop)   | -1%/hr    | Scales with population  |
| Missed city deadline           | -5%       | One-time penalty        |
| Unconnected city               | -0.5%/day | Ongoing until connected |

---

## Document References

- See **ComponentReference.md** for construction costs and component specs
- See **PhysicsSpec.md** for how power delivery affects happiness
- See **TechnicalSpec.md** for implementation of time and economy systems
- See **DesignDoc.md** for overall game design and progression
