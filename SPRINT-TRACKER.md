# kaiw.io Dashboard Sprint Tracker

## Sprint System
- **Batch size:** 5 agents at a time
- **Sprint duration:** 15 min work + 5 min planning
- **Goal:** Iterative improvements to each dashboard (layout, readability, accuracy, data quality)
- **Screenshots:** Before/after with Playwright to track progress
- **Commit/push:** End of each sprint

## Batch Rotation
| Batch | Agents | Focus |
|-------|--------|-------|
| 1 | Freq, Badger, Aria, Greta, Homepage | Visual polish, readability |
| 2 | Renzo(!), Kaia, Thea, Reno, Quanta | Cleanup + data accuracy |
| 3 | Maverick, Marty + revisit worst | Final pass |

## Sprint Log

### Sprint 1 — Batch 1
- **Started:** (in progress)
- **Agents:** Freq, Badger, Aria, Greta, Homepage
- **Status:** 🟡 Running

## Key Issues (from Michael)
1. **Renzo dashboard** — messy, hard to read → priority in Batch 2
2. **Homepage (Hub.jsx)** — 2x wide agents look narrow on large screens, needs life after login
3. **General** — layout density, data accuracy, visual hierarchy

## File Map
| Agent | JSX | CSS |
|-------|-----|-----|
| Homepage | src/pages/Hub.jsx | src/pages/Hub.css |
| Freq | src/agents/FreqDashboard.jsx | src/agents/css/freqDashboard.css |
| Badger | src/agents/BadgerDashboard.jsx | src/agents/css/badgerDashboard.css |
| Aria | src/agents/AriaDashboard.jsx | src/agents/css/ariaDashboard.css |
| Greta | src/agents/GretaDashboard.jsx | src/agents/css/gretaDashboard.css |
| Marty | src/agents/MartyDashboard.jsx | src/agents/css/martyDashboard.css |
| Renzo | src/agents/RenzoDashboard.jsx | src/agents/css/renzoDashboard.css |
| Kaia | src/agents/KaiaDashboard.jsx | src/agents/css/kaiaDashboard.css |
| Thea | src/agents/TheaDashboard.jsx | src/agents/css/theaDashboard.css |
| Reno | src/agents/RenoDashboard.jsx | src/agents/css/renoDashboard.css |
| Quanta | src/agents/QuantaDashboard.jsx | src/agents/css/quantaDashboard.css |
| Maverick | src/agents/MaverickDashboard.jsx | src/agents/css/maverickDashboard.css |
