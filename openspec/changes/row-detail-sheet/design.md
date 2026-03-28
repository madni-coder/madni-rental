## Context

The application had a modal-based approach where clicking a row opened a read-only detail modal, with edit happening in a second separate modal. The user wants a single surface — a Radix Sheet that slides in from the right — where both reading and editing happen without any secondary modal overlay. The `radix-ui` package (v1.4.3) is already installed; a `sheet.jsx` shadcn primitive needs to be added. `DataTable` already has an `onRowClick` prop from prior work.

## Goals / Non-Goals

**Goals:**
- Introduce a `sheet.jsx` shadcn/ui primitive built on `@radix-ui/react-dialog` with `side="right"`
- Replace all planned `*DetailModal` components with `*DetailSheet` components
- Sheet shows a detail view by default; an "Edit" button switches to the edit form in-place (same sheet, no new modal)
- Delete opens the existing `ConfirmModal` from within the sheet
- Consistent sheet width, header, close button, and scroll behaviour across all four modules

**Non-Goals:**
- Changing any server endpoints
- Redesigning the existing edit forms themselves (reuse as-is, embedded in the sheet)
- Mobile/bottom-sheet variants

## Decisions

### Sheet primitive: shadcn scaffold vs manual
**Decision**: Generate `components/ui/sheet.jsx` using `pnpm dlx shadcn@latest add sheet` which outputs a pre-built shadcn Sheet built on `@radix-ui/react-dialog`.

**Rationale**: Consistent with the rest of the component library (dialog, badge, etc. all use shadcn primitives). Zero custom low-level Radix wiring needed, handles focus trapping, Escape, overlay, and animation out of the box.

**Alternative considered**: Write a custom Sheet using `@radix-ui/react-dialog` directly. Rejected — unnecessary duplication when shadcn already provides it.

### Sheet internal state: "view" vs "edit" mode
**Decision**: Each `*DetailSheet` component manages a local `mode` state (`'view' | 'edit'`). In `view` mode it shows all fields read-only; in `edit` mode it shows the existing form fields inline. The sheet stays open when switching modes.

**Rationale**: Avoids the flash/context-loss of closing a modal and opening another. The user stays oriented — same panel, same position, just editable fields appear.

**Alternative considered**: Keep separate Edit modal triggered from the sheet (old approach). Rejected — user explicitly wants all operations in the sheet.

### Reusing existing form state + handlers
**Decision**: Each `*DetailSheet` accepts the same `onEdit` submit handler and `formData`/`setFormData` patterns already wired in the page-level component, passed as props.

**Rationale**: Avoids duplicating form validation and API call logic. The page remains the single source of truth for form state; the sheet is purely the UI surface.

## Risks / Trade-offs

- **Sheet width on small screens** → Set `w-full sm:max-w-[480px]` so it full-screens on mobile rather than clipping.
- **Switching mode loses unsaved edits if sheet is closed** → Mitigation: Reset to `view` mode when sheet closes; no data loss because no partial submit.
- **ConfirmModal rendered inside Sheet** → The `ConfirmModal` uses a Radix Dialog; nested Dialogs are supported by Radix when the inner one uses a new `DialogPortal`. The existing `ConfirmModal` already renders in a portal so this is safe.
