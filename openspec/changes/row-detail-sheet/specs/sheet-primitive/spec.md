## ADDED Requirements

### Requirement: Sheet primitive component exists
The system SHALL provide a `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetFooter`, and `SheetClose` set of components in `client/components/ui/sheet.jsx` built on `@radix-ui/react-dialog` with `side="right"` animation.

#### Scenario: Sheet renders from right side
- **WHEN** a Sheet is opened with `open={true}`
- **THEN** the panel slides in from the right edge of the viewport

#### Scenario: Sheet closes on Escape key
- **WHEN** user presses Escape while the sheet is open
- **THEN** the sheet closes and the `onOpenChange(false)` callback fires

#### Scenario: Sheet closes on backdrop click
- **WHEN** user clicks the semi-transparent overlay behind the sheet
- **THEN** the sheet closes

#### Scenario: Sheet has a visible close button
- **WHEN** the sheet is open
- **THEN** an X icon close button is visible in the top-right corner of the sheet header
