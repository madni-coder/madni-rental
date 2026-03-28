'use client';

import { useEffect, useState } from 'react';
import { Building2, Pencil, Trash2, RefreshCw, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ConfirmModal from '@/components/ui/ConfirmModal';
import FormField from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import api from '@/lib/axios';
import { toast } from 'sonner';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'house', label: 'House' },
];

function typeLabel(type) {
  return PROPERTY_TYPES.find((t) => t.value === type)?.label ?? type;
}

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <div className="text-sm text-foreground">{children ?? '—'}</div>
    </div>
  );
}

const EMPTY_FORM = {
  name: '',
  type: '',
  floors: '',
  areaSqFt: '',
  plannedRent: '',
  address: '',
  amenities: '',
  notes: '',
};

function buildFormData(property) {
  return {
    name: property.name ?? '',
    type: property.type ?? '',
    floors: property.floors ?? '',
    areaSqFt: property.areaSqFt ?? '',
    plannedRent: property.plannedRent ?? '',
    address: property.address ?? '',
    amenities: (property.amenities || []).join(', '),
    notes: property.notes ?? '',
  };
}

export default function PropertyDetailSheet({
  propertyId,
  isOpen,
  openInEditMode = false,
  onClose,
  onRefresh,
}) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // view | edit | create
  const [mode, setMode] = useState('view');

  // Edit form state
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  // Delete confirmation
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────
  async function fetchProperty() {
    if (!propertyId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/properties/${propertyId}`);
      setProperty(data);
      setFormData(buildFormData(data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load property details.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen && propertyId) {
      fetchProperty();
      setMode(openInEditMode ? 'edit' : 'view');
      setFormErrors({});
    } else if (isOpen && !propertyId) {
      setMode('create');
      setFormData(EMPTY_FORM);
      setFormErrors({});
      setProperty(null);
      setLoading(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, propertyId, openInEditMode]);

  function handleClose() {
    setMode('view');
    setFormErrors({});
    setShowDelete(false);
    onClose();
  }

  // ── Edit form helpers ────────────────────────────────────────────
  function handleFormChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.plannedRent || isNaN(Number(formData.plannedRent)))
      errors.plannedRent = 'Planned rent must be a number';
    if (!formData.address?.trim()) errors.address = 'Address is required';
    return errors;
  }

  async function handleSave() {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setFormLoading(true);
    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      floors: formData.floors !== '' ? Number(formData.floors) : undefined,
      areaSqFt: formData.areaSqFt !== '' ? Number(formData.areaSqFt) : undefined,
      plannedRent: Number(formData.plannedRent),
      address: formData.address.trim(),
      amenities: formData.amenities
        ? formData.amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
      notes: formData.notes?.trim() || undefined,
    };

    try {
      if (mode === 'create') {
        await api.post('/api/properties', payload);
        toast.success('Property created');
        handleClose();
        onRefresh();
      } else {
        const { data } = await api.put(`/api/properties/${propertyId}`, payload);
        setProperty(data);
        setFormData(buildFormData(data));
        setMode('view');
        toast.success('Property updated');
        onRefresh();
      }
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        serverErrors.forEach((e) => { mapped[e.path] = e.msg; });
        setFormErrors(mapped);
      } else {
        toast.error(mode === 'create' ? 'Failed to create property' : 'Failed to update property', {
          description: err.response?.data?.message || 'Please try again.',
        });
      }
    } finally {
      setFormLoading(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────
  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await api.delete(`/api/properties/${propertyId}`);
      toast.success('Property deleted');
      setShowDelete(false);
      handleClose();
      onRefresh();
    } catch (err) {
      toast.error('Cannot delete property', {
        description: err.response?.data?.message || 'Please try again.',
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent
          side="right"
          showCloseButton={false}
          aria-describedby={undefined}
          className="w-full sm:max-w-[480px] flex flex-col gap-0 p-0"
        >
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border gap-0">
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-primary" aria-hidden="true" />
              <SheetTitle className="text-base font-semibold">
                {mode === 'create' ? 'Add Property' : mode === 'edit' ? 'Edit Property' : 'Property Details'}
              </SheetTitle>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={handleClose} aria-label="Close">
              <X size={16} />
            </Button>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {loading ? (
              <div className="grid gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchProperty}>
                  <RefreshCw size={14} aria-hidden="true" />
                  Retry
                </Button>
              </div>
            ) : mode === 'view' && property ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Name">
                    <span className="font-medium">{property.name}</span>
                  </DetailRow>
                  <DetailRow label="Type">
                    <Badge variant="secondary">{typeLabel(property.type)}</Badge>
                  </DetailRow>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Planned Rent">
                    <span className="font-medium">₹{property.plannedRent?.toLocaleString()}</span>
                  </DetailRow>
                  <DetailRow label="Area (sq ft)">
                    {property.areaSqFt ? property.areaSqFt.toLocaleString() : null}
                  </DetailRow>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Floors">{property.floors ?? null}</DetailRow>
                  <DetailRow label="Address">{property.address}</DetailRow>
                </div>

                {property.amenities?.length > 0 && (
                  <DetailRow label="Amenities">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {property.amenities.map((a) => (
                        <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                  </DetailRow>
                )}

                {property.notes && (
                  <DetailRow label="Notes">
                    <p className="text-muted-foreground whitespace-pre-wrap">{property.notes}</p>
                  </DetailRow>
                )}
              </div>
            ) : (mode === 'edit' || mode === 'create') ? (
              <div className="grid gap-4">
                <FormField label="Property Name" error={formErrors.name} required>
                  <Input
                    placeholder="e.g. Sunrise Apartment 2B"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="bg-background border-border"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Type" error={formErrors.type} required>
                    <Select value={formData.type} onValueChange={(v) => handleFormChange('type', v)}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {PROPERTY_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Planned Rent (₹)" error={formErrors.plannedRent} required>
                    <Input
                      type="number"
                      placeholder="e.g. 15000"
                      value={formData.plannedRent}
                      onChange={(e) => handleFormChange('plannedRent', e.target.value)}
                      min="0"
                      className="bg-background border-border"
                    />
                  </FormField>
                </div>

                <FormField label="Address" error={formErrors.address} required>
                  <Input
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    className="bg-background border-border"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Floors" error={formErrors.floors}>
                    <Input
                      type="number"
                      placeholder="e.g. 2"
                      value={formData.floors}
                      onChange={(e) => handleFormChange('floors', e.target.value)}
                      min="0"
                      className="bg-background border-border"
                    />
                  </FormField>

                  <FormField label="Area (sq ft)" error={formErrors.areaSqFt}>
                    <Input
                      type="number"
                      placeholder="e.g. 850"
                      value={formData.areaSqFt}
                      onChange={(e) => handleFormChange('areaSqFt', e.target.value)}
                      min="0"
                      className="bg-background border-border"
                    />
                  </FormField>
                </div>

                <FormField label="Amenities" helper="Comma-separated list, e.g. Parking, Water, Lift">
                  <Input
                    placeholder="Parking, Water, Lift"
                    value={formData.amenities}
                    onChange={(e) => handleFormChange('amenities', e.target.value)}
                    className="bg-background border-border"
                  />
                </FormField>

                <FormField label="Notes">
                  <Textarea
                    placeholder="Any additional notes…"
                    value={formData.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    rows={3}
                    className="bg-background border-border resize-none"
                  />
                </FormField>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          {!loading && !error && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
              {mode === 'view' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:text-destructive"
                    onClick={() => setShowDelete(true)}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Delete
                  </Button>
                  <Button size="sm" onClick={() => setMode('edit')}>
                    <Pencil size={14} aria-hidden="true" />
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (mode === 'create') {
                        handleClose();
                      } else {
                        setMode('view');
                        setFormErrors({});
                        setFormData(buildFormData(property));
                      }
                    }}
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} loading={formLoading}>
                    {mode === 'create' ? 'Create Property' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation — rendered outside Sheet to avoid nested portal issues */}
      <ConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Property"
        message={property ? `Are you sure you want to delete "${property.name}"? This action cannot be undone.` : ''}
        confirmLabel="Delete Property"
        loading={deleteLoading}
      />
    </>
  );
}
