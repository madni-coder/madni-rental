'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/DataTable';
import FilterToolbar from '@/components/ui/FilterToolbar';
import Modal from '@/components/ui/Modal';
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

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'house', label: 'House' },
];

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Types' },
  ...PROPERTY_TYPES,
];

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

function typeLabel(type) {
  return PROPERTY_TYPES.find((t) => t.value === type)?.label ?? type;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create mode
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (typeFilter !== 'all') params.type = typeFilter;
      const { data } = await api.get('/api/properties', { params });
      setProperties(data);
    } catch (err) {
      toast.error('Failed to load properties', {
        description: err.response?.data?.message || 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ── Form helpers ──────────────────────────────────────────────────
  function openCreate() {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setFormOpen(true);
  }

  function openEdit(property) {
    setEditTarget(property);
    setFormData({
      name: property.name,
      type: property.type,
      floors: property.floors ?? '',
      areaSqFt: property.areaSqFt ?? '',
      plannedRent: property.plannedRent,
      address: property.address,
      amenities: (property.amenities || []).join(', '),
      notes: property.notes || '',
    });
    setFormErrors({});
    setFormOpen(true);
  }

  function handleFormChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validateForm() {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.plannedRent || isNaN(Number(formData.plannedRent))) {
      errors.plannedRent = 'Planned rent must be a number';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    return errors;
  }

  async function handleFormSubmit() {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

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
      notes: formData.notes.trim() || undefined,
    };

    try {
      if (editTarget) {
        await api.put(`/api/properties/${editTarget._id}`, payload);
        toast.success('Property updated');
      } else {
        await api.post('/api/properties', payload);
        toast.success('Property created');
      }
      setFormOpen(false);
      fetchProperties();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        serverErrors.forEach((e) => { mapped[e.path] = e.msg; });
        setFormErrors(mapped);
      } else {
        toast.error('Failed to save property', {
          description: err.response?.data?.message || 'Please try again.',
        });
      }
    } finally {
      setFormLoading(false);
    }
  }

  // ── Delete helpers ────────────────────────────────────────────────
  function openDelete(property) {
    setDeleteTarget(property);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/properties/${deleteTarget._id}`);
      toast.success('Property deleted');
      setDeleteTarget(null);
      fetchProperties();
    } catch (err) {
      toast.error('Cannot delete property', {
        description: err.response?.data?.message || 'Please try again.',
      });
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Table columns ─────────────────────────────────────────────────
  const columns = [
    {
      key: 'name',
      label: 'Name',
      skeletonWidth: '60%',
      render: (row) => (
        <span className="font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      skeletonWidth: '40%',
      render: (row) => (
        <Badge variant="secondary">{typeLabel(row.type)}</Badge>
      ),
    },
    {
      key: 'areaSqFt',
      label: 'Area (sq ft)',
      skeletonWidth: '30%',
      render: (row) => row.areaSqFt ? row.areaSqFt.toLocaleString() : '—',
    },
    {
      key: 'plannedRent',
      label: 'Planned Rent',
      skeletonWidth: '35%',
      render: (row) => (
        <span className="font-medium">₹{row.plannedRent.toLocaleString()}</span>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      skeletonWidth: '70%',
      render: (row) => (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {row.address}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      skeletonWidth: '10%',
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openEdit(row)}
            aria-label="Edit property"
          >
            <Pencil size={14} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hover:text-destructive"
            onClick={() => openDelete(row)}
            aria-label="Delete property"
          >
            <Trash2 size={14} aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Properties"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus size={16} aria-hidden="true" />
            Add Property
          </Button>
        }
      />

      <FilterToolbar
        search={search}
        onSearch={setSearch}
        filters={[
          {
            key: 'type',
            value: typeFilter,
            onChange: setTypeFilter,
            placeholder: 'All Types',
            options: TYPE_FILTER_OPTIONS,
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={properties}
        loading={loading}
        emptyMessage="No properties yet. Add your first property to get started."
      />

      {/* Add / Edit Property Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editTarget ? 'Edit Property' : 'Add Property'}
        icon={Building2}
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setFormOpen(false)} disabled={formLoading}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleFormSubmit} loading={formLoading}>
              {editTarget ? 'Save Changes' : 'Create Property'}
            </Button>
          </>
        }
      >
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
              <Select
                value={formData.type}
                onValueChange={(v) => handleFormChange('type', v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
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

          <FormField
            label="Amenities"
            helper="Comma-separated list, e.g. Parking, Water, Lift"
          >
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
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Property"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Property"
        loading={deleteLoading}
      />
    </div>
  );
}
