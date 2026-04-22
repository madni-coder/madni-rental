"use client";

import { useMemo, useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const emptyForm = {
  aadhaar: "",
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
    email: tenant.email ?? "",
    emergencyContact: tenant.emergencyContact ?? "",
    endDate: tenant.endDate ? tenant.endDate.slice(0, 10) : "",
    fullName: tenant.fullName ?? "",
    monthlyRent: tenant.monthlyRent ?? "",
    notes: tenant.notes ?? "",
    pan: tenant.pan ?? "",
    paymentDueDate: tenant.paymentDueDate ?? "",
    phone: tenant.phone ?? "",
    propertyId: tenant.propertyId?._id ?? tenant.propertyId ?? "",
    securityDeposit: tenant.securityDeposit ?? "",
    startDate: tenant.startDate ? tenant.startDate.slice(0, 10) : "",
  };
}

export function TenantForm({ isSubmitting, onCancel, onSubmit, properties = [], propertiesLoaded = false, tenant }) {
  const [formData, setFormData] = useState(() => getInitialForm(tenant));
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const submitLabel = useMemo(
    () => (tenant ? "Save Changes" : "Add Tenant"),
    [tenant],
  );

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    if (!formData.propertyId) {
      nextErrors.propertyId = "Property is required.";
    }

    if (!formData.monthlyRent || Number(formData.monthlyRent) <= 0) {
      nextErrors.monthlyRent = "Monthly rent must be greater than zero.";
    }

    if (formData.securityDeposit === "" || Number(formData.securityDeposit) < 0) {
      nextErrors.securityDeposit = "Security deposit is required.";
    }

    const dueDate = Number(formData.paymentDueDate);

    if (!formData.paymentDueDate || !Number.isInteger(dueDate) || dueDate < 1 || dueDate > 31) {
      nextErrors.paymentDueDate = "Enter a whole day between 1 and 31.";
    }

    if (!formData.startDate) {
      nextErrors.startDate = "Start date is required.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      nextErrors.rentAgreement = "File must be smaller than 5 MB.";
    }

    if (selectedFile && selectedFile.type !== "application/pdf") {
      nextErrors.rentAgreement = "Only PDF files are allowed.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      aadhaar: formData.aadhaar.trim() || null,
      email: formData.email.trim() || null,
      emergencyContact: formData.emergencyContact.trim() || null,
      endDate: formData.endDate || null,
      fullName: formData.fullName.trim(),
      monthlyRent: Number(formData.monthlyRent),
      notes: formData.notes.trim() || null,
      pan: formData.pan.trim() || null,
      paymentDueDate: Number(formData.paymentDueDate),
      phone: formData.phone.trim(),
      propertyId: formData.propertyId,
      rentAgreementFile: selectedFile ?? null,
      securityDeposit: Number(formData.securityDeposit),
      startDate: formData.startDate,
    };

    const serverErrors = await onSubmit(payload);

    if (serverErrors?.fieldErrors) {
      setErrors(serverErrors.fieldErrors);
    }
  }

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

      {/* Property & Financial */}
      <fieldset className="space-y-4">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Property &amp; Financials
        </legend>
        <Select
          error={errors.propertyId}
          helper={
            propertiesLoaded && properties.length === 0
              ? "All properties are currently occupied."
              : undefined
          }
          label="Property"
          onChange={(e) => updateField("propertyId", e.target.value)}
          value={formData.propertyId}
        >
          <option value="">Select a property</option>
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </Select>
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
      </fieldset>

      {/* Rent Agreement */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium uppercase tracking-[0.24em] text-muted">
          Rent Agreement PDF (Optional)
        </label>
        {selectedFile ? (
          <div className="flex items-center gap-2 rounded-md border border-border bg-bg/55 px-3 py-2 text-sm">
            <Paperclip aria-hidden="true" className="shrink-0 text-muted" size={14} />
            <span className="flex-1 truncate text-text">{selectedFile.name}</span>
            <button
              aria-label="Remove file"
              className="text-muted transition-colors hover:text-danger"
              onClick={() => {
                setSelectedFile(null);
                setErrors((current) => { const next = { ...current }; delete next.rentAgreement; return next; });

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            className="flex w-full items-center gap-2 rounded-md border border-dashed border-border bg-bg/40 px-3 py-3 text-sm text-muted transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Paperclip aria-hidden="true" size={14} />
            {tenant?.rentAgreementUrl ? "Replace agreement PDF" : "Upload agreement PDF"}
          </button>
        )}
        <input
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setSelectedFile(file);
              setErrors((current) => { const next = { ...current }; delete next.rentAgreement; return next; });
            }
          }}
          ref={fileInputRef}
          type="file"
        />
        {errors.rentAgreement ? (
          <p className="text-xs text-danger">{errors.rentAgreement}</p>
        ) : null}
        {tenant?.rentAgreementUrl && !selectedFile ? (
          <a
            className="text-xs text-primary hover:underline"
            href={tenant.rentAgreementUrl}
            rel="noreferrer"
            target="_blank"
          >
            View existing agreement
          </a>
        ) : null}
      </div>

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
