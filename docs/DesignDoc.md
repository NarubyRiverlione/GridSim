# European Grid Simulator - Product Requirements Document

## Version 1.0 - Core Game Loop

---

## 1. Product Overview

### 1.1 Vision

A realistic electrical grid management simulation game where players balance power generation, transmission infrastructure, and growing demand across a European-style geography. Players must strategically expand their grid to power new cities while managing budget constraints and maintaining grid stability.

### 1.2 Core Experience

Players start with a single power plant and city, then progressively connect new cities as they appear. Success requires understanding power flow physics, managing transmission capacity, and making strategic infrastructure investments. The game teaches real grid management principles through engaging gameplay.

### 1.3 Target Platform

Browser-based web application (TypeScript/React) running entirely client-side with local persistence.

---

## 2. Core Mechanics

### 2.1 Gameplay Loop

1. **Announcement Phase**: New city announced with location and expected demand
2. **Planning Phase**: Player designs transmission infrastructure to connect city
3. **Construction Phase**: Player builds plants, lines, substations, and switching stations
4. **Operation Phase**: Grid delivers power, generates revenue, affects happiness
5. **Monitoring Phase**: Player monitors grid health, capacity utilization, voltage levels
6. **Crisis Response**: Handle overloads, blackouts, and grid failures
7. **Repeat**: Next city announced, difficulty increases

### 2.2 Win Conditions

- Endless survival mode
- Score based on: number of cities powered, grid uptime, delivery efficiency
- Leaderboard potential (future feature)

### 2.3 Failure Conditions

- **Bankruptcy**: Budget remains negative after grace period (30 days)
- **Happiness Collapse**: Happiness meter reaches zero due to repeated blackouts/brownouts

---

## 3. Gameplay Progression

### 3.1 Starting Scenario

**Initial State**:

- 1 power plant (e.g., 800 MW CCGT)
- 1 small city (30 MW demand)
- NOT connected
- Starting budget: €50M

**Tutorial Objective**:

- Connect plant to city (first transmission line)
- Understand power flow basics
- See revenue generation
- Learn capacity monitoring

### 3.2 City Announcement System

**Announcement**:

- New city appears on map with marker
- Shows: location, expected demand (MW), city type
- Lead time: 7 days (168 hours) warning
- Multiple cities can be announced simultaneously

**Player Response Window**:

- Must plan and build infrastructure during lead time
- Can pause to plan builds
- UI shows countdown timer

**Consequences**:

- Connected on time: city powers up, generates revenue
- Not connected: happiness penalty, no revenue
- Can connect late, but ongoing happiness penalty until connected

### 3.3 Difficulty Scaling

**Early Game** (Cities 1-5):

- Small towns, short distances
- Single generation source adequate
- Simple linear grid topology
- Learn basic mechanics

**Mid Game** (Cities 6-15):

- Medium cities, varied locations
- Need multiple plants or larger capacity
- Geographic obstacles force routing decisions
- Introduction to redundancy needs
- Peak demand approaching plant capacity

**Late Game** (Cities 16+):

- Large cities and metros
- Complex interconnected grid
- Cascading failure risks
- Tight budget management
- Must optimize existing infrastructure
- Seasonal demand swings challenge capacity

**Spawn Rate**:

- Gradually accelerates
- Early: 1 city every 10-15 days
- Mid: 1 city every 5-7 days
- Late: Multiple cities per week

---

## 4. User Interface Requirements

### 4.1 Map View

**Primary View**: Grid topology map showing:

- Power plants (by type, with capacity)
- Cities (by size, with demand)
- Transmission lines (with utilization %)
- Substations and switching stations
- Geographic obstacles (mountains, water, protected areas)
- Announced future city locations

**Visual Feedback**:

- Color coding: green (healthy), yellow (stressed), red (overloaded/failed)
- Line thickness indicates voltage level
- Animated power flow direction (optional polish)
- Utilization percentage on hover

### 4.2 Interaction Modes

**Mode-Based Toolbar**:

- Select/Pan mode (default)
- Add Power Plant mode
- Add Transmission Line mode (draw between nodes)
- Add Substation mode
- Add Switching Station mode

**Line Drawing**:

- Click start node, click end node
- Shows estimated: cost, distance, voltage drop
- Visual feedback on valid/invalid placement
- Manual routing around obstacles (player draws path)

**Breaker Control**:

- Click switching station or substation
- Panel shows connected line segments
- Toggle breakers open/closed
- Shows status: closed, open, tripped

### 4.3 Information Panels

**Grid Status**:

- Total generation capacity vs current demand
- Grid-wide utilization %
- Number of cities powered / total cities
- Current budget
- Happiness meter
- Current electricity price

**Component Details** (on selection):

- Power plant: capacity, current output, cost
- City: demand, power received, shortfall
- Line: capacity, utilization, voltage at endpoints, losses
- Substation: capacity, throughput, voltage transformation

**Alerts/Warnings**:

- Line approaching capacity (>80%)
- Voltage drop affecting city delivery
- Budget warning (low funds)
- City announcement countdown
- Tripped breakers requiring attention

### 4.4 Time Controls

- Play/Pause button
- Speed selector (1x, 2x, 5x, 10x)
- Current time/date display
- Season indicator

### 4.5 Build Menu

- Power plant selection (with specs and costs)
- Infrastructure options (lines, substations, switching stations)
- Preview cost before placing
- Budget check (disable if can't afford)

---

## 5. Out of Scope for V1

### 5.1 Deferred Features

- Variable renewable generation (wind/solar intermittency)
- Weather events affecting demand/generation
- Maintenance costs and equipment aging
- Multiplayer or competitive modes
- Actual geographic map (use abstract/stylized map)
- Energy storage systems (batteries, pumped hydro)
- Demand response programs
- Carbon emissions tracking
- Detailed financial modeling (loans, interest)
- Market dynamics (electricity market simulation)
- Multiple price zones
- Reactive power / power factor
- Full AC power flow with reactive power and voltage control (use simplified AC model)

### 5.2 Known Simplifications

- Auto-dispatch generation (no manual plant control)
- Fixed seasonal patterns (no random weather)
- Grid-wide electricity price (no per-city pricing)
- Simplified voltage drop model
- No equipment degradation or failures beyond overload
- Linear construction time (instant build for V1)
- No regulatory/permitting delays

---

## 6. Future Roadmap (Post-V1)

### 6.1 V2 Features

- Variable renewable generation with forecasting
- Weather system (clouds, wind speed)
- Energy storage systems
- Manual generation dispatch
- Maintenance costs and equipment lifecycle
- Advanced analytics dashboard

### 6.2 V3+ Concepts

- Multiplayer cooperative grid management
- Competitive mode (efficiency racing)
- Real European geography map
- Historical scenarios (energy crisis events)
- Policy/regulation layer
- Carbon emissions and climate goals
- Electricity market simulation

---

## 7. Open Questions for Development

### 7.1 Balancing

- Exact revenue per MWh (affects economy difficulty)
- City spawn rate progression curve
- Construction cost scaling
- Happiness gain/loss rates
- Grace period duration for bankruptcy

### 7.2 UX Details

- Voltage drop warning threshold (automatic or player discovery?)
- Breaker reset UI flow
- Line routing assistance (pathfinding suggestions?)
- Tutorial pacing and content
- Tooltip/help system depth

**Resolution Approach**: Implement, playtest, iterate based on feel and player feedback.

---

## Document References

For detailed specifications, see:

- **ComponentReference.md** - All component types, capacities, and construction costs
- **PhysicsSpec.md** - Power flow calculations, voltage drop, line losses, and grid protection
- **GeographyAndEconomy.md** - Geographic constraints, time simulation, economy, happiness system, and scoring
- **TechnicalSpec.md** - Technology stack, code structure, data models, and implementation details
- **DevelopmentApproach.md** - Phase-by-phase development plan with detailed deliverables
- **CLAUDE.md** - Guidance for AI assistants working on this codebase

---

## Document History

- **Version 1.0** (2025-10-12): Initial PRD for V1 scope
