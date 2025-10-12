# Remaining cleanup tasks (next steps) — GridSim docs

## Purpose

Record the remaining tidy-up edits and the recommended git commit to finalize documentation changes I applied earlier (V1 assumptions, canonical defaults, and propagated edits).

## Planned edits (high-priority first)

1. TransmissionLines.md
   - Scan the file and replace any hardcoded example numbers with references to ComponentReference.md canonical defaults where appropriate (e.g., cost/km, nominal capacities).
   - Confirm base_loss constants in PhysicsSpec.md (§8) match the "Base loss /100km" entries in ComponentReference.md.

2. Global unit consistency pass
   - Ensure all docs use the canonical tick unit convention: tick(deltaSeconds) in code examples and clearly annotate economy formulas that use hours (convert deltaSeconds → hours when needed).
   - Ensure "MVA" vs "MW" usage is consistent across docs and explicitly reference the V1 assumption (pf = 1.0) where both units appear.

3. Remove leftover editorial clutter
   - Remove any remaining automated "TODO LIST UPDATE REQUIRED" blocks (global search found none, but re-run search and remove if reintroduced).
   - Fix minor stylistic inconsistencies (parentheses, punctuation, small grammar edits).

4. Example canonicalization
   - Replace remaining inline examples that hardcode non-canonical values to reference ComponentReference.md defaults (e.g., any leftover "800 MW CCGT" mentions should instead reference "CCGT default 600 MW" or be left as a range with link to ComponentReference.md).
   - Update tutorial text to consistently point to ComponentReference.md for numeric examples.

5. Produce a final "docs-changelog.md" summarizing changes (automatically produced by this process) and include cross-links to the main files changed.

## Proposed git workflow (commands to run)

# stage changed docs

git add ComponentReference.md PhysicsSpec.md TechnicalSpec.md Cities.md DevelopmentApproach.md DesignDoc.md GameplayGuide.md PowerPlants.md

# create commit

git commit -m "docs: canonicalize V1 assumptions and defaults; clarify units (MVA/MW) and tick semantics"

# push (optional)

git push origin <branch-name>

## Notes

- I created this file in the repo root (REMAINING_CLEANUP_TASKS.md) to record the outstanding tasks and the suggested commit message.
- If you want me to apply the remaining edits automatically, I will proceed in the following order:
  1. Update TransmissionLines.md and run a consistency pass.
  2. Make the minor stylistic edits and produce docs-changelog.md.
  3. Stage and commit the changes using the commit message above.
- I will not run git commands until you confirm you want me to commit. If you confirm, I will run the staging + commit task.

Please confirm which action you'd like next:

- "Apply remaining edits and create commit" (I will implement edits and then run git add + commit)
- "Only run commit now" (I will stage the files I already changed and commit)
- "Cancel / make different changes" (tell me what to change)
