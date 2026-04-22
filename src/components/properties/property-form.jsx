"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const emptyForm = {
  address: "",
  amenities: [],
  areaSqFt: "",
  floors: "",
  name: "",
  notes: "",
  plannedRent: "",
  type: "",
};

function getInitialForm(property) {
  if (!property) {
    return emptyForm;
  }

  return {
    address: property.address ?? "",
    amenities: property.amenities ?? [],
    areaSqFt: property.areaSqFt ?? "",
    floors: property.floors ?? "",
    name: property.name ?? "",
    notes: property.notes ?? "",
    plannedRent: property.plannedRent ?? "",
    type: property.type ?? "",
  };
}

export function PropertyForm({ isSubmitting, onCancel, onSubmit, property }) {
  const [formData, setFormData] = useState(() => getInitialForm(property));
  const [amenityInput, setAmenityInput] = useState("");
  const [errors, setErrors] = useState({});

  const submitLabel = useMemo(
    () => (property ? "Save Changes" : "Create Property"),
    [property],
  );

  function updateField(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function addAmenity(rawValue) {
    const value = rawValue.trim();

    if (!value) {
      return;
    }

    if (formData.amenities.includes(value)) {
      setAmenityInput("");
      return;
    }

    setFormData((current) => ({
      ...current,
      amenities: [...current.amenities, value],
    }));
    setAmenityInput("");
  }

  function removeAmenity(value) {
    setFormData((current) => ({
      ...current,
      amenities: current.amenities.filter((item) => item !== value),
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Property name is required.";
    }

    if (!formData.type) {
      nextErrors.type = "Select a property type.";
    }

    if (!formData.address.trim()) {
      nextErrors.address = "Address is required.";
    }

    if (!formData.plannedRent || Number(formData.plannedRent) <= 0) {
      nextErrors.plannedRent = "Planned rent must be greater than zero.";
    }

    if (formData.floors !== "" && Number.isNaN(Number(formData.floors))) {
      nextErrors.floors = "Floors must be a valid number.";
    }

    if (formData.areaSqFt !== "" && Number.isNaN(Number(formData.areaSqFt))) {
      nextErrors.areaSqFt = "Area must be a valid number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    addAmenity(amenityInput);

    const latestForm = {
      ...formData,
      amenities: amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())
        ? [...formData.amenities, amenityInput.trim()]
        : formData.amenities,
    };

    if (!validate()) {
      return;
    }

    const serverErrors = await onSubmit({
      address: latestForm.address.trim(),
      amenities: latestForm.amenities,
      areaSqFt: latestForm.areaSqFt === "" ? null : Number(latestForm.areaSqFt),
      floors: latestForm.floors === "" ? null : Number(latestForm.floors),
      name: latestForm.name.trim(),
      notes: latestForm.notes.trim(),
      plannedRent: Number(latestForm.plannedRent),
      type: latestForm.type,
    });

    if (serverErrors?.fieldErrors) {
      setErrors(serverErrors.fieldErrors);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          error={errors.name}
          label="Property Name"
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Sunset Residency"
          value={formData.name}
        />
        <Select
          error={errors.type}
          label="Property Type"
          onChange={(event) => updateField("type", event.target.value)}
          value={formData.type}
        >
          <option value="">Select type</option>
          <option value="apartment">Apartment</option>
          <option value="commercial">Commercial</option>
          <option value="house">House</option>
        </Select>
        <Input
          error={errors.floors}
          label="Floors"
          onChange={(event) => updateField("floors", event.target.value)}
          placeholder="3"
          type="number"
          value={formData.floors}
        />
        <Input
          error={errors.areaSqFt}
          label="Area (sq ft)"
          onChange={(event) => updateField("areaSqFt", event.target.value)}
          placeholder="1200"
          type="number"
          value={formData.areaSqFt}
        />
      </div>

      <Input
        error={errors.plannedRent}
        label="Planned Rent"
        onChange={(event) => updateField("plannedRent", event.target.value)}
        placeholder="45000"
        type="number"
        value={formData.plannedRent}
      />

      <Textarea
        error={errors.address}
        label="Address"
        onChange={(event) => updateField("address", event.target.value)}
        placeholder="Street, block, city"
        rows={3}
        value={formData.address}
      />

      <div className="space-y-2">
        <label className="block text-xs font-medium uppercase tracking-[0.24em] text-muted">
          Amenities
        </label>
        <div className="flex gap-2">
          <Input
            onChange={(event) => setAmenityInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addAmenity(amenityInput);
              }
            }}
            placeholder="Add and press Enter"
            value={amenityInput}
          />
          <Button
            onClick={() => addAmenity(amenityInput)}
            title="Add amenity"
            type="button"
            variant="secondary"
          >
            <Plus aria-hidden="true" size={16} />
            Add
          </Button>
        </div>
        {formData.amenities.length ? (
          <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-bg/45 p-3">
            {formData.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {amenity}
                <button
                  aria-label={`Remove ${amenity}`}
                  className="rounded-full text-primary/80 transition-colors hover:text-text"
                  onClick={() => removeAmenity(amenity)}
                  type="button"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <Textarea
        label="Notes"
        onChange={(event) => updateField("notes", event.target.value)}
        placeholder="Optional internal notes"
        rows={4}
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