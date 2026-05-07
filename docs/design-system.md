# Design System Foundation

## Design tokens

All product interfaces must use semantic tokens only.

### Required color utility classes

- `bg-background`, `text-foreground`
- `bg-card`, `text-card-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-accent`, `text-accent-foreground`
- `bg-destructive`, `text-destructive-foreground`
- `border-border`, `border-input`, `ring-ring`

Use HSL CSS custom properties in `app/globals.css` as the source of truth for light and dark themes.

### Radius tokens

- `rounded-md`: controls tight interactive UI (inputs, buttons)
- `rounded-lg`: controls sections and grouped containers
- `rounded-xl`: controls cards and large surfaces

### Typography baseline

- Page titles: `text-2xl font-semibold tracking-tight`
- Section titles: `text-base font-semibold`
- Body text: `text-sm`
- Support text: `text-sm text-muted-foreground`

## Spacing rules

- Use `px-6 py-6` for default content area spacing.
- Upgrade to `lg:px-8` on desktop.
- Use `space-y-6` between major sections.
- Use `gap-4` for card grid spacing.
- Use `p-6` for standard card and form sections.

## Layout rules

- Always render inside App Shell: Sidebar + Topbar + content region.
- Sidebar is fixed on desktop and hidden on small screens unless a mobile nav pattern is explicitly introduced.
- Topbar remains sticky with subtle backdrop blur.
- Every page must include:
  - Page header (title + description + optional primary action/status)
  - Primary metric or task area
  - Empty state
  - Loading state
  - Error state

## Component usage

Use the `features/design-system/components/dashboard-shell.tsx` primitives:

- `AppShell` for root layout wrapping.
- `Sidebar` for navigation.
- `Topbar` for global actions/search.
- `PageHeader` for page framing.
- `MetricCard` for KPI summaries.
- `DataCard` for data groups and lists.
- `FormSection` for forms and settings blocks.
- `StatusBadge` for compact state labels (`ready`, `running`, `error`).
- `CommandSearchInput` for command/search affordance.
- `EmptyState` when no data exists.
- `LoadingState` while async content is pending.
- `ErrorState` when an operation fails.

## Forbidden UI patterns

- No hardcoded color utilities (e.g. `text-blue-500`, `bg-gray-100`) outside token definitions.
- No full-width content with zero horizontal padding.
- No pages that omit loading, empty, or error handling.
- No mixed radius styles in a single component group.
- No untyped, ad-hoc visual variants when a design-system primitive exists.
