'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Pencil } from 'lucide-react';
import PropertyDetailSheet from '@/components/properties/PropertyDetailSheet';
import { toast } from 'sonner';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/DataTable';
import FilterToolbar from '@/components/ui/FilterToolbar';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'house', label: 'House' },
];

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Types' },
  ...PROPERTY_TYPES,
];

function typeLabel(type) {
  return PROPERTY_TYPES.find((t) => t.value === type)?.label ?? type;
}

export default function PropertiesPage() {
  const { dataVersion } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Create sheet state
  const [createOpen, setCreateOpen] = useState(false);

  // Detail sheet state
  const [detailId, setDetailId] = useState(null);
  const [detailOpenEdit, setDetailOpenEdit] = useState(false);

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
  }, [fetchProperties, dataVersion]);

  // ── Form helpers ──────────────────────────────────────────────────
  function openCreate() {
    setCreateOpen(true);
  }

  function openEditSheet(property) {
    setDetailId(property._id);
    setDetailOpenEdit(true);
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
            onClick={(e) => { e.stopPropagation(); openEditSheet(row); }}
            aria-label="Edit property"
          >
            <Pencil size={14} aria-hidden="true" />
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
        onRowClick={(row) => setDetailId(row._id)}
      />

      {/* Add Property Sheet */}
      <PropertyDetailSheet
        propertyId={null}
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onRefresh={fetchProperties}
      />

      {/* Property Detail / Edit Sheet */}
      <PropertyDetailSheet
        propertyId={detailId}
        isOpen={!!detailId}
        openInEditMode={detailOpenEdit}
        onClose={() => { setDetailId(null); setDetailOpenEdit(false); }}
        onRefresh={fetchProperties}
      />
    </div>
  );
}
