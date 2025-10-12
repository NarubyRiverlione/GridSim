# GridSim Documentation

This directory contains all project documentation split into focused, topic-specific files.

## Why Documentation is Split

### Reason 1: AI Context Efficiency

- **Problem**: AI assistants have limited context windows (~200k tokens)
- **Solution**: Modular docs allow reading ONLY what's needed for current task
- **Example**: Implementing voltage drop? Read PhysicsSpec.md only (~2k tokens), not all 30k tokens
- **Benefit**: Leaves more context for actual code and conversation

### Reason 2: Human Readability

- **Problem**: Original DesignDoc.md was 865 lines covering physics, components, economy, and implementation
- **Solution**: Each doc focuses on one domain (physics, components, economy, etc.)
- **Benefit**: Find information quickly without scrolling through unrelated sections

### Reason 3: Separation of Concerns

- **Problem**: Design decisions, technical specs, and reference data were intermingled
- **Solution**: Clear separation:
  - Design docs (what & why)
  - Technical specs (how to implement)
  - Reference docs (quick lookup of values)
- **Benefit**: Update one aspect without affecting others

### Reason 4: Maintainability

- **Problem**: Changes to physics formulas shouldn't require reading/editing game design sections
- **Solution**: Independent files can be updated in isolation
- **Benefit**: Reduces risk of conflicting edits, easier to track changes

### Reason 5: Progressive Detail

- **Problem**: Sometimes need overview, sometimes need deep details
- **Solution**: Start with DesignDoc.md (high-level), drill into specific docs as needed
- **Benefit**: Don't overwhelm with details when just exploring the project

## Documentation Files

### Core Design

- **DesignDoc.md** - High-level game design, mechanics, progression, UI requirements, and scope
  - Use for: Understanding overall vision, gameplay loop, and what's in/out of scope
  - Size: ~8k characters (small, quick read)

### Reference Documentation

- **ComponentReference.md** - Complete specifications of all grid components
  - Use for: Looking up power plant capacities, costs, transmission line specs, city demand ranges
  - Size: ~13k characters
  - Includes: Quick reference tables for fast lookup

- **PhysicsSpec.md** - Detailed physics model and calculations
  - Use for: Implementing power flow solver, voltage drop, line losses, cascading failures
  - Size: ~16k characters
  - Includes: Formulas, algorithms, validation tests, tunable constants

- **GeographyAndEconomy.md** - Geographic constraints, time simulation, economy, happiness, scoring
  - Use for: Implementing terrain obstacles, time cycles, budget system, happiness mechanics
  - Size: ~17k characters
  - Includes: Formulas for demand curves, pricing effects, scoring calculation

### Implementation Guidance

- **TechnicalSpec.md** - Technology stack, architecture, data models, API design
  - Use for: Setting up project, understanding code structure, implementing core classes
  - Size: ~11k characters
  - Includes: Complete TypeScript interfaces, simulation API, persistence format

- **DevelopmentApproach.md** - Phase-by-phase development plan
  - Use for: Understanding what to build and in what order
  - Size: ~23k characters
  - Includes: Detailed deliverables for each phase, technology decisions, timeline estimates

### Quick Reference

- **../CLAUDE.md** - Quick reference guide for AI assistants (kept in root for visibility)
  - Use for: Getting oriented without reading full docs
  - Size: ~8k characters
  - Includes: Overview, key concepts, important constants, links to detailed docs

## Total Documentation Size

- **All docs combined**: ~90k characters ≈ 25-30k tokens
- **Typical usage per task**: 1-2 docs ≈ 5-10k tokens
- **Context efficiency**: 80-90% savings by reading only relevant docs

## How to Use This Documentation

### For Humans

1. Start with **DesignDoc.md** - understand the vision
2. Refer to **ComponentReference.md** and **PhysicsSpec.md** for specific details
3. Use **DevelopmentApproach.md** when ready to start building
4. Keep **TechnicalSpec.md** handy during implementation

### For AI Assistants

1. Read **../CLAUDE.md** first - get oriented (~3k tokens)
2. Based on task, read 1-2 specific docs:
   - UI work? → ComponentReference.md + DevelopmentApproach.md Phase 0
   - Physics work? → PhysicsSpec.md + TechnicalSpec.md (data models)
   - Economy work? → GeographyAndEconomy.md + TechnicalSpec.md
   - Architecture work? → TechnicalSpec.md + DevelopmentApproach.md
3. Total context per task: ~6-12k tokens (efficient!)

### For Quick Lookups

- Power plant costs? → ComponentReference.md section 6.1
- Physics formulas? → PhysicsSpec.md sections 3-4
- Data models? → TechnicalSpec.md section 4
- Development phases? → DevelopmentApproach.md or CLAUDE.md

## Document Cross-References

All documents reference each other where relevant:

- DesignDoc.md → Points to detailed specs
- PhysicsSpec.md ↔ ComponentReference.md (physics affects components)
- GeographyAndEconomy.md ↔ PhysicsSpec.md (voltage drop affects economy)
- TechnicalSpec.md → All docs (implementation references everything)

## Maintenance Guidelines

**When updating documentation:**

1. **Single Concern**: Each doc should focus on its domain
   - Physics changes? → Update PhysicsSpec.md only
   - New component? → Update ComponentReference.md + TechnicalSpec.md (data model)
   - Game balance? → Update GeographyAndEconomy.md

2. **Keep Cross-References**: If you change something referenced elsewhere, update the reference
   - Example: Change voltage drop formula in PhysicsSpec.md → mention in CLAUDE.md if it's important

3. **Update CLAUDE.md**: If major architectural changes occur
   - Changes to project structure
   - Changes to core concepts
   - Changes to development phases

4. **Avoid Duplication**: Don't copy/paste between docs
   - Use cross-references instead
   - Keep single source of truth for each concept

## Version History

- **2025-10-12**: Initial documentation split
  - Split monolithic DesignDoc.md (865 lines) into 6 focused documents
  - Motivation: Improve AI context efficiency and human readability
  - Result: Better separation of concerns, easier maintenance
