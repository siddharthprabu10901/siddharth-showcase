# Implementation overview

## Two applications, one public showcase

The repository contains two independent React applications managed through npm workspaces. The portfolio introduces the work; Flowdesk demonstrates an enterprise-style interaction workflow. Their production builds are assembled into a single static site. Each application can also run independently during development.

## Flowdesk

`domain.ts` defines the expense model and pure functions for validation, filtering, summaries, CSV export and status transitions. `useExpenses.ts` holds expense state and browser persistence. `ExpenseForm`, `ExpenseDetail` and `Modal` separate input, review and dialog behavior from the dashboard.

The allowed states are `Pending → Approved → Reimbursed` or `Pending → Rejected`. A rejection requires a reason. Changes produce new records and arrays, and append timestamped activity entries. Search/filter/sort results and summaries derive from the expense array rather than separate counters.

Saved JSON is versioned and checked before it is rendered. Unreadable records fall back to fictional sample data with a warning; failed writes leave the app usable for the current session. This local demonstration history is not a protected server audit log.

## Portfolio

Profile and case-study content live in `profile.ts`. The interface uses state for navigation, the selected case study and contact feedback. Native dialogs provide keyboard behavior; effects clean up timers, restore focus and restore page scrolling.

## Validation and limits

The inherited Flowdesk suite contains 38 unit cases and eight Playwright executions across desktop/mobile Chromium profiles. The showcase workflow runs these checks before building and deploying. Passing status for this repository is recorded by its own GitHub Actions runs.

The static architecture deliberately has no authentication, server authorization, database, synchronization, file uploads or actual transactions. A real multi-user expense service would require those capabilities and server-side validation and audit controls.
