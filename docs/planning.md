# Handoff: Personal Task Dashboard Planning

## Context
- **Project**: Personal Task Dashboard
- **Source**: Based on Fredrick's `TODO.md` and "Thoughts" second brain.
- **Goal**: Transition from a raw Markdown file to a visual, interactive dashboard.
- **Status**: Initial Planning Completed.

## Design System (via ui-ux-pro-max)
- **Style**: Flat Design (Minimalist, bold colors, clean lines).
- **Palette**: Monochrome (#FAFAFA, #18181B) with Blue Accent (#2563EB).
- **Typography**: Caveat (Headings) / Quicksand (Body).
- **Stack Recommendation**: Next.js, Tailwind CSS, shadcn/ui.

## Architectural Decisions (via project-planner)
- **Data Source**: `TODO.md` (Markdown).
- **Sync Logic**: Bi-directional sync between the UI and the Markdown file.
- **Key Components**:
    - Task Parser (MD -> JSON)
    - Kanban/List View Component
    - Progress Analytics Dashboard
    - GitHub/Local File System Sync Engine

## Next Steps
1. Define the exact Markdown syntax for metadata (e.g., `[ ] Task name #tag @date`).
2. Implement the Task Parser logic.
3. Scaffold the Next.js frontend with the defined design system.

## Reference Files
- `TODO.md` (Root of workspace)
- `design-system/MASTER.md` (To be created during implementation)
