## ADDED Requirements

### Requirement: Interactive Element States

Every interactive element in the application MUST visually communicate its current state (default, hover, focus, active, disabled, loading, error) so users always know what is clickable and what is happening.

#### Scenario: Hover state is visually distinct from default

Given any interactive element (button, nav item, table row, icon button),
When the user's pointer enters the element,
Then the element SHALL change visual appearance within `150ms` — typically a background color change, text color brightening, or underline — with `transition-all duration-150`.
No interactive element SHALL remain visually identical on hover as in its default state.

#### Scenario: Focus ring is visible for keyboard navigation

Given any interactive element receives keyboard focus (Tab key),
Then a focus ring SHALL be visible: `ring-2 ring-primary/40 ring-offset-2 ring-offset-bg outline-none`.
This applies to buttons, inputs, selects, links, and any element with `tabIndex`.
Focus rings SHALL NOT be suppressed globally via `outline: none` without the ring replacement.

#### Scenario: Active / pressed state gives tactile feedback

Given the user clicks or taps any button,
While the mouse/touch is held down,
Then the button SHALL visually depress: `scale-[0.98] brightness-90` via `active:` Tailwind variant.

#### Scenario: Disabled state prevents interaction and communicates unavailability

Given any element has the `disabled` attribute or `disabled` prop,
Then it SHALL render with `opacity-40 cursor-not-allowed pointer-events-none`.
The element SHALL NOT respond to click or keyboard events.
There SHALL be a `title` or `data-tooltip` explaining why it is disabled (e.g., "Cannot delete property with active tenants").

#### Scenario: Loading state communicates in-progress action

Given an action (form submit, data fetch, API call) is in progress,
Then:
- Submit/action buttons SHALL replace their label with `<Loader2 size={16} className="animate-spin" />` + the original label, and disable pointer events.
- Full-page or section-level loading SHALL display a loading skeleton (shimmer rows) rather than a spinner overlay.
- Skeleton cells use `bg-border/30 animate-pulse rounded h-4` at realistic widths.

#### Scenario: Error state for form validation

Given a form is submitted with invalid or missing required fields,
Then each failing input SHALL display `border-danger ring-2 ring-danger/20`.
An error message SHALL appear below each failing field: `text-xs text-danger flex items-center gap-1 mt-1` with `<AlertCircle size={12} />` icon.
The first failing field SHALL receive focus automatically.

---

### Requirement: Form Interaction Flow

All forms in modals and pages MUST follow a consistent interaction pattern for submission, validation, and feedback.

#### Scenario: Form submit triggers loading state immediately

Given the user clicks the primary "Save" / "Create" / "Record" button in a form,
When the click handler fires,
Then BEFORE the API call completes, the button SHALL immediately enter the loading state (spinner + disabled).
This prevents double-submit.

#### Scenario: Successful form submission closes modal and shows success toast

Given an API call completes successfully,
Then:
1. The modal SHALL close with its exit animation (`200ms`).
2. A Success toaster SHALL appear: title "Saved successfully" (or contextual), message describing the created/updated record.
3. The data table SHALL refresh to show the new/updated record.

#### Scenario: Failed form submission shows error toast and keeps modal open

Given an API call returns an error (4xx or 5xx),
Then:
1. The modal SHALL remain open.
2. The submit button SHALL exit its loading state and return to normal.
3. An Error toaster SHALL appear with: title "Action failed", message from the server error response (or a generic message if unavailable).
4. If the error is a validation error (422), the relevant input fields SHALL highlight in error state.

#### Scenario: Cancel / close discards unsaved changes

Given the user has entered data into a form modal and then clicks Cancel or the X button,
Then the modal SHALL close and all form state SHALL be reset (inputs cleared).
No confirmation is required for discarding unsaved changes in this app (simple CRUD).

---

### Requirement: Table Row Interaction States

Data table rows MUST respond to hover and provide clear affordance for available actions.

#### Scenario: Table row hover reveals action buttons

Given a data table row in its default state,
Then action buttons (edit, delete, view) in the actions column MAY be `opacity-0` by default.
On row hover, action buttons SHALL transition to `opacity-100` within `100ms`.
Alternatively, action buttons are always visible — the implementation choice is consistent across all tables.

#### Scenario: Table row click navigates or opens detail

Given a table row represents a navigable entity (tenant, property),
When the user clicks on the row body (not an action button),
Then the app SHALL navigate to the detail page OR open the detail modal, depending on the page spec.

---

### Requirement: Modal Interaction States

Modals MUST have clear visual states for opening, displaying, and closing.

#### Scenario: Backdrop click handling

Given an open modal with unsaved form data,
When the user clicks the backdrop overlay,
Then the modal SHALL close (no unsaved-changes guard required per app scope).

#### Scenario: Multiple rapid open/close cycles

Given the user opens and closes modals rapidly,
Then no visual artifacts (partial overlays, z-index stacking errors) SHALL remain after each close cycle.
Each modal close MUST fully unmount or hide the modal DOM element.

---

### Requirement: Navigation Interaction States

The sidebar navigation MUST clearly indicate the current page and respond to hover.

#### Scenario: Active nav item is always clearly distinguishable

Given the user is on the Tenants page,
Then the Tenants nav item SHALL be visually active: `bg-primary/15 text-primary` with icon `text-primary`.
All other nav items SHALL be in their default `text-muted` state.
The active state SHALL update immediately on navigation — no delay.

#### Scenario: Nav hover state provides clear affordance

Given the user's cursor moves over an inactive nav item,
Then it SHALL change to `bg-border/30 text-text` within `200ms`.

---

### Requirement: Toaster Interaction States

Toaster notifications MUST support manual dismissal in addition to auto-dismiss.

#### Scenario: User dismisses toast manually

Given a toast is visible and the user clicks the `<X size={14} />` dismiss button,
Then the toast SHALL immediately begin its exit animation (`translate-x-full opacity-0` over `150ms`) and be removed from the DOM.

#### Scenario: Hovering a toast pauses auto-dismiss timer

Given an active toast is being auto-dismissed (4s timer running),
When the user hovers over the toast,
Then the countdown timer SHALL pause and the progress bar SHALL freeze.
When the cursor leaves,
Then the timer SHALL resume from where it paused.

---

### Requirement: Upload Zone Interaction States

The file upload zone MUST clearly communicate drag-over, upload progress, success, and error states.

#### Scenario: Drag-over state provides clear visual affordance

Given the user drags a file over the upload zone,
When the drag enters the zone boundary,
Then the zone SHALL immediately (no delay) switch to the drag-over visual state: `border-primary bg-primary/5` with `text-primary` icon.

#### Scenario: Invalid file type shows error state immediately

Given the user drops a file that is not a PDF or exceeds 5 MB,
Then the zone SHALL switch to error state: `border-danger bg-danger/5` and show an error message below the zone within `100ms`.
No upload API call SHALL be made for invalid files.

#### Scenario: Removing uploaded file resets to default state

Given an uploaded file pill is displayed in the zone,
When the user clicks the `<X size={12} />` remove button on the file pill,
Then the zone SHALL reset to its default empty state immediately.
