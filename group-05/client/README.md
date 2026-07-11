# GTGS Client

React, TypeScript, Vite, Tailwind CSS, and TanStack Query frontend for the Gunadarma Thesis Guidance Scheduling System.

## Scripts

- `npm run dev --workspace client`
- `npm run typecheck --workspace client`
- `npm run lint --workspace client`
- `npm run build --workspace client`

## Environment

Set `VITE_API_URL` to the backend API base URL. The local default is:

```text
http://localhost:4000/api/v1
```

## App Surface

- Public landing page and login.
- Student and lecturer dashboard routes.
- Booking, availability, workspace, revisions, notifications, profile, and settings screens.
- Role guards for student-only and lecturer-only flows.

## Design System

The UI follows a "Warm Modern Academic" direction: Gunadarma blue (`--primary`) as the
institutional anchor, a warm gold accent (`--brand-gold`, exposed as the `warm`/`warm-foreground`
Tailwind color) reserved for celebratory/highlight moments (completed sessions, primary CTAs).

- **Tokens**: HSL CSS custom properties in `src/index.css` (`:root` for light, `.dark` for dark),
  mapped into Tailwind color names in `tailwind.config.js`. Add new colors as CSS variables first,
  then map them in `tailwind.config.js` -- never hardcode hex/oklch values in components.
- **Typography**: self-hosted variable fonts via `@fontsource-variable/inter` (body, `font-sans`)
  and `@fontsource-variable/plus-jakarta-sans` (headings, `font-display`), imported once in
  `src/main.tsx`. Custom type scale (`text-display`, `text-h1`-`text-h4`, `text-body`,
  `text-caption`) lives in `tailwind.config.js` alongside Tailwind's default scale.
- **Dark mode**: class-strategy (`darkMode: ["class"]`); `ThemeProvider`
  (`src/app/theme-provider.tsx`) toggles a `.dark` class on `<html>` and persists the choice
  (`light` / `dark` / `system`) to `localStorage` under `gtgs_theme`.
- **Primitives**: `src/components/ui/*` are the only place Tailwind's raw utility soup should live
  for shared elements (buttons, cards, badges, form controls, dialogs, toasts, calendar, etc.).
  Pages compose primitives; they shouldn't reinvent button/card/input styling inline.
- **Motion**: `framer-motion` is used deliberately and sparingly -- page-load/section reveals
  (`whileInView`, `viewport={{ once: true }}`), button tap feedback, and dialog/drawer/toast
  enter (and, for toast, exit) transitions. Every animated primitive respects
  `useReducedMotion()`/the `motion-reduce:` Tailwind variant.
- **Images**: source photos live in `src/assets/images/`; always import the optimized WebP/PNG
  variants (e.g. `bimbingan-1-1600.webp`, `logo-full-800.png`, `logo-mark-192.png`), never the
  multi-megabyte originals. Generate new variants with `sharp` (resize + re-encode) rather than
  shipping camera-resolution source files.
- **Calendar**: `src/components/ui/calendar.tsx` wraps FullCalendar; its visual theme lives in the
  `.fc` block in `src/index.css` as CSS variables mapped to the design tokens (not FullCalendar's
  own theme system) -- extend that block rather than restyling FullCalendar components directly.

## New Dependencies

- `@fontsource-variable/inter`, `@fontsource-variable/plus-jakarta-sans` -- self-hosted variable
  fonts (zero external font requests at runtime). Requires the ambient module declarations in
  `src/fontsource.d.ts` (these packages resolve to a bare `.css` entry point that Vite's built-in
  `*.css` ambient types don't cover for non-relative import specifiers).

`framer-motion`, `lucide-react`, `class-variance-authority`, and the Radix UI primitives were
already dependencies before the redesign and are unchanged.
