# Dashboard Sprint Instructions

## Dev Server
- Running at http://localhost:5174 (Vite)
- Auth bypassed (VITE_SKIP_AUTH=true)

## Screenshot Command
```bash
npx playwright screenshot --wait-for-timeout 2000 --full-page --viewport-size="1440,900" "http://localhost:5174/<route>" "screenshots/<filename>.png"
```

## Rules
1. Only edit YOUR assigned files (dashboard JSX + its CSS)
2. Do NOT edit App.jsx, Layout.jsx, or other agents' files
3. Take a screenshot BEFORE and AFTER your changes
4. Use real/realistic data — no "Loading..." placeholders
5. Dark theme — consistent with existing design
6. Responsive: must look good at 1440px AND 768px
7. Do NOT commit — coordinator will handle git
8. Do NOT install new npm packages
9. Available libraries: react, react-router-dom, framer-motion, lucide-react, recharts

## Design Language
- Dark background (#0a0a0f or similar)
- Cards with subtle borders, rounded corners
- Accent colors per agent (check existing code)
- Clear visual hierarchy: big numbers for KPIs, smaller for labels
- High contrast text on dark backgrounds
