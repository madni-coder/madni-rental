## 1. Cleanup — Remove Modal Artifacts

- [x] 1.1 Delete `client/components/properties/PropertyDetailModal.jsx` (replaced by sheet)
- [x] 1.2 Remove `PropertyDetailModal` import and usage from `client/app/(dashboard)/properties/page.jsx`
- [x] 1.3 Revert `e.stopPropagation()` calls on property table row action buttons (will be re-added in sheet wiring step)

## 2. Sheet Primitive

- [x] 2.1 Run `pnpm dlx shadcn@latest add sheet` inside `client/` to generate `client/components/ui/sheet.jsx`
- [x] 2.2 Verify `sheet.jsx` exports: `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetFooter`, `SheetClose`, `SheetDescription`
- [x] 2.3 Confirm the generated sheet uses `side="right"` by default (or set it as the default prop)

## 3. Property Detail Sheet

- [x] 3.1 Create `client/components/properties/PropertyDetailSheet.jsx` — accepts `propertyId`, `isOpen`, `onClose`, `onRefresh` props; fetches `GET /api/properties/:id` on open; shows skeleton while loading; shows error + Retry on failure
- [x] 3.2 Build view mode: render all fields (Name, Type badge, Floors, Area, Planned Rent ₹, Address, Amenities tags, Notes) with an Edit button and Delete button in the sheet footer
- [x] 3.3 Build edit mode: embed the existing property form fields inline in the sheet; include Save and Cancel buttons; on save call `PUT /api/properties/:id`, show toast, call `onRefresh()`, return to view mode
- [x] 3.4 Wire Delete button: open `ConfirmModal` from within the sheet; on confirm call `DELETE /api/properties/:id`, close sheet, call `onRefresh()`
- [x] 3.5 Update `client/app/(dashboard)/properties/page.jsx` — add `detailId` state; add `onRowClick={(row) => setDetailId(row._id)}` to `DataTable`; add `e.stopPropagation()` to edit/delete icon buttons in the actions column; render `<PropertyDetailSheet>` with correct props

## 4. Tenant Detail Sheet

- [ ] 4.1 Create `client/components/tenants/TenantDetailSheet.jsx` — fetches `GET /api/tenants/:id`; skeleton/error states
- [ ] 4.2 Build view mode: all tenant fields with Aadhaar and PAN masked as `••••••••`; Edit and Deactivate buttons in footer
- [ ] 4.3 Build edit mode: inline edit form (all fields except Aadhaar/PAN), Save/Cancel; on save call `PUT /api/tenants/:id`, toast, refresh, return to view
- [ ] 4.4 Wire Deactivate: `ConfirmModal` → `PATCH /api/tenants/:id/deactivate` → close sheet + refresh (Deactivate only visible when `isActive === true`)
- [ ] 4.5 Update `client/app/(dashboard)/tenants/page.jsx` — wire `onRowClick`, `e.stopPropagation()` on action buttons, render `<TenantDetailSheet>`

## 5. Bill Detail Sheet

- [ ] 5.1 Create `client/components/bills/BillDetailSheet.jsx` — fetches `GET /api/bills/:id`; skeleton/error states
- [ ] 5.2 Build view: Tenant Name, Property Name, Month/Year, Total Amount ₹, Due Amount ₹, Due Date, Status badge; Record Payment and Cancel Bill buttons (visible for pending/partial only)
- [ ] 5.3 Wire Record Payment: open existing `RecordPaymentModal` from within the sheet; on success refresh sheet data
- [ ] 5.4 Wire Cancel Bill: `ConfirmModal` → `PATCH /api/bills/:id/cancel` → refresh sheet data
- [ ] 5.5 Update `client/app/(dashboard)/bills/page.jsx` — wire `onRowClick`, `e.stopPropagation()` on action buttons, render `<BillDetailSheet>`

## 6. Expense Detail Sheet

- [ ] 6.1 Create `client/components/expenses/ExpenseDetailSheet.jsx` — fetches `GET /api/expenses/:id`; skeleton/error states
- [ ] 6.2 Build view mode: Property Name, Category, Amount ₹, Date, Notes; Edit and Delete buttons in footer
- [ ] 6.3 Build edit mode: inline edit form, Save/Cancel; on save call `PUT /api/expenses/:id`, toast, refresh, return to view
- [ ] 6.4 Wire Delete: `ConfirmModal` → `DELETE /api/expenses/:id` → close sheet + refresh
- [ ] 6.5 Update `client/app/(dashboard)/expenses/page.jsx` — wire `onRowClick`, `e.stopPropagation()` on action buttons, render `<ExpenseDetailSheet>`

## 7. Polish

- [ ] 7.1 Ensure `DataTable` `onRowClick` is still wired correctly (already added in prior work) — verify `cursor-pointer` class appears on rows when `onRowClick` is provided
- [ ] 7.2 Verify sheet width across all four modules: `w-full sm:max-w-[480px]`
- [ ] 7.3 Verify that closing the sheet (X button, Escape, backdrop) always resets mode back to `view` and clears `detailId`
