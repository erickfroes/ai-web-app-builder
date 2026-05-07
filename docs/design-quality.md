# Design Quality Rules

## Objective

Ensure generated apps look premium, coherent, and production-ready while remaining maintainable.

## Required UI Standards

- Use shadcn/ui component patterns.
- Use semantic Tailwind tokens only where applicable:
  - `bg-background`
  - `text-foreground`
  - `bg-primary`
  - `text-primary-foreground`
  - `border-border`
  - `bg-card`
- Avoid arbitrary hardcoded colors unless explicitly mapped via tokens.
- Support responsive layouts by default.

## Required UX States

Every page and key component should define:

- Primary action
- Empty state
- Loading state
- Error/fallback state
- Clear hierarchy (headline, supporting context, action area)

## Accessibility Baseline

- Semantic heading order.
- Keyboard-accessible interactive controls.
- Accessible form labels and validation feedback.
- Sufficient color contrast through tokenized theme.

## Content/Layout Heuristics

- Clear visual rhythm through spacing scale.
- Avoid overcrowded dashboards; preserve whitespace.
- Keep forms concise and grouped by task.
- Use reusable sections and consistent card/table patterns.

## Design Quality Validation (MVP)

- Route has explicit hierarchy blocks.
- Route has loading + empty states.
- Components map to approved primitives.
- Class usage passes token policy checks.
