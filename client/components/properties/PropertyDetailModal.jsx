'use client';

import { useEffect, useState } from 'react';
import { Building2, Pencil, Trash2, RefreshCw } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/axios';

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
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

export default function PropertyDetailModal({ propertyId, onClose, onEdit, onDelete }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProperty() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/properties/${propertyId}`);
      setProperty(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load property details.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (propertyId) fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  return (
    <Modal
      isOpen={!!propertyId}
      onClose={onClose}
      title="Property Details"
      icon={Building2}
      size="md"
      footer={
        !loading && !error && property ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDelete(property); onClose(); }}
              className="hover:text-destructive"
            >
              <Trash2 size={14} aria-hidden="true" />
              Delete
            </Button>
            <Button
              size="sm"
              onClick={(e) => { e.stopPropagation(); onEdit(property); onClose(); }}
            >
              <Pencil size={14} aria-hidden="true" />
              Edit
            </Button>
          </>
        ) : null
      }
    >
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
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchProperty}>
            <RefreshCw size={14} aria-hidden="true" />
            Retry
          </Button>
        </div>
      ) : property ? (
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
              {property.areaSqFt ? property.areaSqFt.toLocaleString() : '—'}
            </DetailRow>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailRow label="Floors">
              {property.floors ?? '—'}
            </DetailRow>
            <DetailRow label="Address">
              {property.address}
            </DetailRow>
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
      ) : null}
    </Modal>
  );
}
