"use client";

import { useEffect, useMemo, useState } from "react";
import { Paperclip, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";

const DOC_TYPES = [
  { label: "Aadhaar Copy", value: "aadhaar_copy" },
  { label: "PAN Copy", value: "pan_copy" },
  { label: "Rent Agreement", value: "rent_agreement" },
  { label: "Other", value: "other" },
];

function DocRow({ index, onRemove, onUpdate, row }) {
  return (
    <div className="flex flex-wrap items-start gap-2 rounded-xl border border-border bg-bg/40 p-3">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        <select
          className="h-9 rounded-md border border-border bg-surface px-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
          onChange={(e) => onUpdate(index, "type", e.target.value)}
          value={row.type}
        >
          {DOC_TYPES.map((dt) => (
            <option key={dt.value} value={dt.value}>
              {dt.label}
            </option>
          ))}
        </select>
        <input
          className="h-9 min-w-30 flex-1 rounded-md border border-border bg-surface px-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary"
          onChange={(e) => onUpdate(index, "label", e.target.value)}
          placeholder="Label (optional)"
          type="text"
          value={row.label}
        />
        {row.file ? (
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-bg/55 px-3 text-sm">
            <Paperclip aria-hidden="true" className="shrink-0 text-muted" size={13} />
            <span className="flex-1 truncate text-text">{row.file.name}</span>
            <button
              aria-label="Remove file"
              className="shrink-0 text-muted transition-colors hover:text-danger"
              onClick={() => onUpdate(index, "file", null)}
              type="button"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-bg/40 px-3 text-sm text-muted transition-colors hover:border-primary/40 hover:text-primary">
            <Paperclip aria-hidden="true" size={13} />
            Choose file
            <input
              accept="application/pdf,image/jpeg,image/png"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpdate(index, "file", f);
              }}
              type="file"
            />
          </label>
        )}
      </div>
      <button
        aria-label="Remove document row"
        className="mt-0.5 text-muted transition-colors hover:text-danger"
        onClick={() => onRemove(index)}
        type="button"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

const emptyForm = {
  aadhaar: "",
  blockId: "",
  email: "",
  emergencyContact: "",
  endDate: "",
  fullName: "",
  monthlyRent: "",
  notes: "",
  pan: "",
  paymentDueDate: "",
  phone: "",
  propertyId: "",
  securityDeposit: "",
  startDate: "",
};

function getInitialForm(tenant) {
  if (!tenant) {
    return emptyForm;
  }

  return {
    aadhaar: tenant.aadhaar ?? "",
    blockId: tenant.blockId?._id ?? tenant.blockId ?? "",
    email: tenant.email ?? "",
    emergencyContact: tenant.emergencyContact ?? "",
    endDate: tenant.endDate ? tenant.endDate.slice(0, 10) : "",
    fullName: tenant.fullName ?? "",
    monthlyRent: tenant.monthlyRent ?? "",
    notes: tenant.notes ?? "",
    pan: tenant.pan ?? "",
    paymentDueDate: tenant.paymentDueDate ?? "",
    phone: tenant.phone ?? "",
    propertyId: tenant.blockId?.propertyId?._id ?? tenant.propertyId?._id ?? tenant.propertyId ?? "",
    securityDeposit: tenant.securityDeposit ?? "",
    startDate: tenant.startDate ? tenant.startDate.slice(0, 10) : "",
  };
}

export function TenantForm({ isSubmitting, onCancel, onSubmit, properties = [], propertiesLoaded = false, tenant }) {
  const [formData, setFormData] = useState(() => getInitialForm(tenant));
  const [errors, setErrors] = useState({});
  const [blocks, setBlocks] = useState([]);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [docRows, setDocRows] = useState([]);

  const submitLabel = useMemo(
    () => (tenant ? "Save Changes" : "Add Tenant"),
    [tenant],
  );

  // Fetch blocks when a property is selected
  useEffect(() => {
    if (!formData.propertyId) {
      setBlocks([]);
      setFormData((prev) => ({ ...prev, blockId: "" }));
      return;
    }

    let isActive = true;
    setBlocksLoading(true);

    api.get(`/properties/${formData.propertyId}/blocks`)
      .then((res) => {
        if (isActive) {
          setBlocks(res.data.blocks ?? []);
        }
      })
      .catch(() => {
        if (isActive) {
          setBlocks([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setBlocksLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.propertyId]);

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const nextErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!formData.propertyId) nextErrors.propertyId = "Property is required.";
    if (!formData.blockId) nextErrors.blockId = "Block is required.";
    if (!formData.monthlyRent || Number(formData.monthlyRent) <= 0)
      nextErrors.monthlyRent = "Monthly rent must be greater than zero.";
    if (formData.securityDeposit === "" || Number(formData.securityDeposit) < 0)
      nextErrors.securityDeposit = "Security deposit is required.";

    const dueDate = Number(formData.paymentDueDate);
    if (!formData.paymentDueDate || !Number.isInteger(dueDate) || dueDate < 1 || dueDate > 31)
      nextErrors.paymentDueDate = "Enter a whole day between 1 and 31.";

    if (!formData.startDate) nextErrors.startDate = "Start date is required.";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      nextErrors.email = "Enter a valid email address.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function addDocRow() {
    setDocRows((prev) => [...prev, { file: null, label: "", type: "rent_agreement" }]);
  }

  function updateDocRow(index, field, value) {
    setDocRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function removeDocRow(index) {
    setDocRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    const serverErrors = await onSubmit(
      {
        aadhaar: formData.aadhaar.trim() || null,
        blockId: formData.blockId,
        email: formData.email.trim() || null,
        emergencyContact: formData.emergencyContact.trim() || null,
        endDate: formData.endDate || null,
        fullName: formData.fullName.trim(),
        monthlyRent: Number(formData.monthlyRent),
        notes: formData.notes.trim() || null,
        pan: formData.pan.trim() || null,
        paymentDueDate: Number(formData.paymentDueDate),
        phone: formData.phone.trim(),
        securityDeposit: Number(formData.securityDeposit),
        startDate: formData.startDate,
      },
      // Pass queued docs (only those with a file selected) to the page's handleSave
      docRows.filter((row) => row.file),
    );

    if (serverErrors?.fieldErrors) {
      setErrors(serverErrors.fieldErrors);
    }
  }

  const availableBlocks = tenant
    ? blocks.filter((b) => b.isActive || String(b._id) === formData.blockId)
    : blocks.filter((b) => b.isActive && (b.activeTenantCount ?? 0) === 0);

  return (
    <form className="space-y-6 pb-4" onSubmit={handleSubmit}>
      {/* Personal Details */}
      <fieldset className="space-y-4">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Personal Details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            error={errors.fullName}
            label="Full Name"
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Rashid Khan"
            value={formData.fullName}
          />
          <Input
            error={errors.phone}
            label="Phone"
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+91 98765 43210"
            type="tel"
            value={formData.phone}
          />
          <Input
            error={errors.email}
            label="Email (Optional)"
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="rashid@email.com"
            type="email"
            value={formData.email}
          />
          <Input
            label="Emergency Contact (Optional)"
            onChange={(e) => updateField("emergencyContact", e.target.value)}
            placeholder="+91 99999 00000"
            type="tel"
            value={formData.emergencyContact}
          />
        </div>
      </fieldset>

      {/* Property & Block */}
      <fieldset className="space-y-4">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Property &amp; Block
        </legend>
        <Select
          error={errors.propertyId}
          helper={propertiesLoaded && properties.length === 0 ? "No properties found." : undefined}
          label="Property"
          onChange={(e) => {
            updateField("propertyId", e.target.value);
            updateField("blockId", "");
          }}
          value={formData.propertyId}
        >
          <option value="">Select a property</option>
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select
          disabled={!formData.propertyId || blocksLoading}
          error={errors.blockId}
          helper={
            formData.propertyId && !blocksLoading && availableBlocks.length === 0
              ? "No vacant blocks found. Go to Properties → Blocks tab to add blocks first."
              : undefined
          }
          label="Block / Unit"
          onChange={(e) => updateField("blockId", e.target.value)}
          value={formData.blockId}
        >
          <option value="">
            {blocksLoading ? "Loading blocks…" : "Select a block"}
          </option>
          {availableBlocks.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}{b.bpNumber ? ` — BP: ${b.bpNumber}` : ""}
            </option>
          ))}
        </Select>
      </fieldset>

      {/* Financials */}
      <fieldset className="space-y-4">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Financials
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            error={errors.monthlyRent}
            label="Monthly Rent (₹)"
            onChange={(e) => updateField("monthlyRent", e.target.value)}
            placeholder="25000"
            type="number"
            value={formData.monthlyRent}
          />
          <Input
            error={errors.securityDeposit}
            label="Security Deposit (₹)"
            onChange={(e) => updateField("securityDeposit", e.target.value)}
            placeholder="50000"
            type="number"
            value={formData.securityDeposit}
          />
          <Input
            error={errors.paymentDueDate}
            helper="Day of month when rent is due (1–31)"
            label="Payment Due Date"
            max={31}
            min={1}
            step={1}
            onChange={(e) => updateField("paymentDueDate", e.target.value)}
            placeholder="5"
            type="number"
            value={formData.paymentDueDate}
          />
        </div>
      </fieldset>

      {/* Lease Period */}
      <fieldset className="space-y-4">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Lease Period
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            error={errors.startDate}
            label="Start Date"
            onChange={(e) => updateField("startDate", e.target.value)}
            type="date"
            value={formData.startDate}
          />
          <Input
            label="End Date (Optional)"
            onChange={(e) => updateField("endDate", e.target.value)}
            type="date"
            value={formData.endDate}
          />
        </div>
      </fieldset>

      {/* ID Documents */}
      <fieldset className="space-y-4">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          ID Documents
          <span className="ml-2 normal-case tracking-normal font-normal text-muted/70">
            (stored encrypted)
          </span>
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            error={errors.aadhaar}
            label="Aadhaar Number"
            onChange={(e) => updateField("aadhaar", e.target.value)}
            placeholder="1234 5678 9012"
            value={formData.aadhaar}
          />
          <Input
            label="PAN Number (Optional)"
            onChange={(e) => updateField("pan", e.target.value)}
            placeholder="ABCDE1234F"
            value={formData.pan}
          />
        </div>
        {tenant?._id ? (
          <p className="text-xs text-muted">
            To upload or delete documents, switch to the Documents tab.
          </p>
        ) : null}
      </fieldset>

      {/* Documents (create mode only — edit mode uses Documents tab) */}
      {!tenant?._id ? (
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Documents
              <span className="ml-2 normal-case tracking-normal font-normal text-muted/70">
                (optional — PDF, JPG, PNG, max 10 MB each)
              </span>
            </legend>
            <Button
              onClick={addDocRow}
              size="sm"
              type="button"
              variant="secondary"
            >
              <Plus aria-hidden="true" size={13} />
              Add
            </Button>
          </div>
          {docRows.length === 0 ? (
            <p className="text-xs text-muted">
              No documents queued. Click Add to attach Aadhaar copy, PAN copy, rent agreements, etc.
            </p>
          ) : (
            <div className="space-y-2">
              {docRows.map((row, idx) => (
                <DocRow
                  key={idx}
                  index={idx}
                  onRemove={removeDocRow}
                  onUpdate={updateDocRow}
                  row={row}
                />
              ))}
            </div>
          )}
        </fieldset>
      ) : null}

      {/* Notes */}
      <Textarea
        label="Notes (Optional)"
        onChange={(e) => updateField("notes", e.target.value)}
        placeholder="Any additional notes about this tenant"
        rows={3}
        value={formData.notes}
      />

      <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button loading={isSubmitting} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

