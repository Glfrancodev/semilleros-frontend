# Copilot Instructions for TailAdmin React Dashboard

## Project Overview

- **Frameworks:** React 19, TypeScript, Tailwind CSS
- **Purpose:** Admin dashboard template with reusable UI components, charts, tables, authentication, and dark mode support.
- **Structure:**
  - `src/components/` – UI elements (charts, tables, forms, alerts, etc.)
  - `src/features/` – Feature modules (e.g., `auth`, `admin`), each with `components/`, `pages/`, `routes/`, and `services/`
  - `src/context/` – React context providers (Auth, Sidebar, Theme)
  - `src/layout/` – App layout, header, sidebar
  - `src/routes/` – Top-level route definitions
  - `src/services/api.ts` – API integration point

## Key Patterns & Conventions

- **Component Organization:**
  - Use feature-based folders under `src/features/` for modularity.
  - Common UI elements are in `src/components/common/` and `src/components/ui/`.
- **Styling:**
  - All styling is via Tailwind CSS utility classes. Avoid custom CSS unless necessary.
- **State Management:**
  - Use React Context for global state (see `src/context/`).
- **Routing:**
  - React Router is used. Route definitions are in `src/features/*/routes/` and `src/routes/`.
- **Forms:**
  - Form elements and logic are in `src/components/form/` and subfolders.
- **Charts:**
  - Chart components use ApexCharts, located in `src/components/charts/`.

## Developer Workflows

- **Install dependencies:**
  - `npm install` (use `--legacy-peer-deps` if needed)
- **Start dev server:**
  - `npm run dev`
- **Build for production:**
  - `npm run build`
- **Lint:**
  - `npm run lint`
- **Type-check:**
  - `npm run type-check`

## Integration & Data Flow

- **API Calls:**
  - Centralized in `src/services/api.ts`.
  - Features/services may wrap or extend this for domain logic.
- **Authentication:**
  - Managed in `src/features/auth/` (see `context/` and `services/`).
- **Theme & Sidebar:**
  - Controlled via React Context (`src/context/ThemeContext.tsx`, `SidebarContext.tsx`).

## Project-Specific Notes

- **No custom CSS:** All UI is Tailwind-based.
- **Dark mode:** Supported via context and Tailwind dark classes.
- **Component Reuse:** Prefer extracting to `common/` or `ui/` if used in multiple features.
- **Upgrades:**
  - React 19 and Tailwind v4 are used; check changelogs for breaking changes.

## References

- See `README.md` for more details, changelogs, and links to docs.
- Example feature: `src/features/auth/` for authentication flows and patterns.

---

For questions about unclear patterns or missing documentation, ask for clarification or check the [TailAdmin docs](https://tailadmin.com/docs).
