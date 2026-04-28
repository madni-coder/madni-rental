"use client";

import { useDeferredValue, useEffect, useState } from "react";
import {
  Building2,
  Eye,
  Home,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { BlockManager } from "@/components/properties/block-manager";
import { PropertyForm } from "@/components/properties/property-form";
import { TaxPaymentManager } from "@/components/properties/tax-payment-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
// import { formatCurrency } from "@/lib/utils";

const propertyTypeLabel = {
  apartment: "Apartment",
  commercial: "Commercial",
  house: "House",
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const deferredSearch = useDeferredValue(search);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [viewTab, setViewTab] = useState("details");
  const [deletingProperty, setDeletingProperty] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function fetchProperties() {
      setIsLoading(true);

      try {
        const response = await api.get("/properties", {
          params: {
            search: deferredSearch || undefined,
            status: status === "all" ? undefined : status,
          },
        });

        if (isActive) {
          setProperties(response.data.properties ?? []);
        }
      } catch (error) {
        if (isActive) {
          toast.error(error?.response?.data?.message ?? "Failed to load properties.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchProperties();

    return () => {
      isActive = false;
    };
  }, [deferredSearch, status]);

  async function handleSave(payload) {
    setIsSaving(true);

    try {
      if (editingProperty?._id) {
        const response = await api.put(`/properties/${editingProperty._id}`, payload);
        toast.success("Property updated.");
        const updated = response.data.property;
        setProperties((prev) =>
          prev.map((p) =>
            p._id === updated._id
              ? { ...updated, activeTenantCount: p.activeTenantCount, currentTenant: p.currentTenant, status: p.status }
              : p,
          ),
        );
      } else {
        const response = await api.post("/properties", payload);
        toast.success("Property created.");
        const created = response.data.property;
        setProperties((prev) => [
          { ...created, activeTenantCount: 0, currentTenant: null, status: "inactive" },
          ...prev,
        ]);
      }

      setIsSheetOpen(false);
      setEditingProperty(null);
    } catch (error) {
      const fieldErrors = error?.response?.data?.errors;

      if (fieldErrors) {
        return { fieldErrors };
      }

      toast.error(error?.response?.data?.message ?? "Failed to save property.");
    } finally {
      setIsSaving(false);
    }

    return null;
  }

  async function handleDelete() {
    if (!deletingProperty?._id) {
      return;
    }

    setIsDeleting(true);

    try {
      await api.delete(`/properties/${deletingProperty._id}`);
      toast.success("Property deleted.");
      setProperties((prev) => prev.filter((p) => p._id !== deletingProperty._id));
      setDeletingProperty(null);
    } catch (error) {
      toast.error(
        error?.response?.status === 409
          ? "Cannot delete property with active tenants."
          : error?.response?.data?.message ?? "Failed to delete property.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section>
      <PageHeader
        action={
          <Button
            onClick={() => {
              setEditingProperty(null);
              setIsSheetOpen(true);
            }}
          >
            <Plus aria-hidden="true" size={16} />
            Add Property
          </Button>
        }
        title="Properties"
      />

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface/90 p-4 shadow-(--shadow-card) sm:flex-row sm:items-center">
        <Input
          className="max-w-full sm:max-w-xs"
          icon={<Search aria-hidden="true" size={16} />}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search by name or address"
          value={search}
        />
        <Select
          className="sm:w-44"
          onChange={(event) => setStatus(event.target.value)}
          value={status}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface/92 shadow-(--shadow-card)">
        {isLoading ? (
          <div className="space-y-3 p-5">
            <div className="h-11 animate-pulse rounded-xl bg-border/35" />
            <div className="h-11 animate-pulse rounded-xl bg-border/20" />
            <div className="h-11 animate-pulse rounded-xl bg-border/20" />
            <div className="h-11 animate-pulse rounded-xl bg-border/20" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-18 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-border bg-bg/70 text-primary">
              <Building2 aria-hidden="true" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-text">No properties yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              Start by creating your first property record. The list will show rent,
              occupancy, and status in one place.
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                setEditingProperty(null);
                setIsSheetOpen(true);
              }}
            >
              <Plus aria-hidden="true" size={16} />
              Add the first property
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Current Tenant</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell>
                      <div className="font-medium text-text">{property.name}</div>
                      <div className="mt-1 text-xs text-muted">
                        {property.areaSqFt ? `${property.areaSqFt} sq ft` : "Area not added"}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-muted">
                      {property.address}
                    </TableCell>
                    <TableCell>{propertyTypeLabel[property.type] ?? property.type}</TableCell>
                    <TableCell>
                      {property.currentTenant ? (
                        <div>
                          <div className="font-medium text-text">{property.currentTenant}</div>
                          <div className="text-xs text-muted">
                            {property.activeTenantCount} active tenant
                            {property.activeTenantCount === 1 ? "" : "s"}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="vacant">Vacant</Badge>
                      )}
                    </TableCell>
                    {/* <TableCell>{formatCurrency(property.plannedRent)}</TableCell> */}
                    <TableCell>
                      <Badge variant={property.status === "active" ? "success" : "outline"}>
                        {property.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1.5">
                        <Button
                          aria-label={`View ${property.name}`}
                          onClick={() => setViewingProperty(property)}
                          title="View property"
                          variant="icon"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          aria-label={`Edit ${property.name}`}
                          onClick={() => {
                            setEditingProperty(property);
                            setIsSheetOpen(true);
                          }}
                          title="Edit property"
                          variant="icon"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          aria-label={`Delete ${property.name}`}
                          onClick={() => setDeletingProperty(property)}
                          title="Delete property"
                          variant="icon"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Sheet
        open={isSheetOpen}
        onOpenChange={(nextOpen) => {
          setIsSheetOpen(nextOpen);

          if (!nextOpen) {
            setEditingProperty(null);
          }
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <Building2 aria-hidden="true" size={20} className="text-primary" />
              {editingProperty ? "Edit Property" : "Add Property"}
            </SheetTitle>
            <SheetDescription>
              Capture the core details for this property. Only required fields block save.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <PropertyForm
              key={editingProperty?._id ?? "new"}
              isSubmitting={isSaving}
              onCancel={() => {
                setIsSheetOpen(false);
                setEditingProperty(null);
              }}
              onSubmit={handleSave}
              property={editingProperty}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={Boolean(viewingProperty)}
        onOpenChange={(open) => {
          if (!open) {
            setViewingProperty(null);
            setViewTab("details");
          }
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <Home aria-hidden="true" size={20} className="text-primary" />
              {viewingProperty?.name}
            </SheetTitle>
            <SheetDescription>
              {viewingProperty?.address}
            </SheetDescription>
          </SheetHeader>

          {/* Tab nav */}
          <div className="mt-5 flex gap-1 rounded-xl border border-border bg-bg/40 p-1">
            {[
              { id: "details", label: "Details" },
              { id: "blocks", label: "Blocks" },
              { id: "tax", label: "Tax Payments" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                  viewTab === tab.id
                    ? "bg-surface text-text shadow-sm"
                    : "text-muted hover:text-text"
                }`}
                onClick={() => setViewTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {viewingProperty ? (
            <div className="mt-5">
              {viewTab === "details" && (
                <div className="grid gap-3 text-sm text-muted sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-bg/55 p-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.24em] text-muted">Type</p>
                    <p className="text-sm text-text">
                      {propertyTypeLabel[viewingProperty.type] ?? viewingProperty.type}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-bg/55 p-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.24em] text-muted">Status</p>
                    <p className="text-sm text-text">
                      {viewingProperty.status === "active" ? "Occupied / active" : "Vacant / inactive"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-bg/55 p-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.24em] text-muted">Floors</p>
                    <p className="text-sm text-text">{viewingProperty.floors || "Not set"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-bg/55 p-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.24em] text-muted">Area</p>
                    <p className="text-sm text-text">
                      {viewingProperty.areaSqFt ? `${viewingProperty.areaSqFt} sq ft` : "Not set"}
                    </p>
                  </div>
                  {viewingProperty.nagarNigamPropertyId ? (
                    <div className="rounded-xl border border-border bg-bg/55 p-4">
                      <p className="mb-1 text-xs uppercase tracking-[0.24em] text-muted">Nagar Nigam ID</p>
                      <p className="text-sm text-text">{viewingProperty.nagarNigamPropertyId}</p>
                    </div>
                  ) : null}
                  {viewingProperty.annualTaxAmount ? (
                    <div className="rounded-xl border border-border bg-bg/55 p-4">
                      <p className="mb-1 text-xs uppercase tracking-[0.24em] text-muted">Annual Tax</p>
                      <p className="text-sm text-text">₹{Number(viewingProperty.annualTaxAmount).toLocaleString("en-IN")}</p>
                    </div>
                  ) : null}
                  <div className="rounded-xl border border-border bg-bg/55 p-4 sm:col-span-2">
                    <p className="mb-2 text-xs uppercase tracking-[0.24em] text-muted">Amenities</p>
                    {viewingProperty.amenities?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {viewingProperty.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text">No amenities added.</p>
                    )}
                  </div>
                  <div className="rounded-xl border border-border bg-bg/55 p-4 sm:col-span-2">
                    <p className="mb-2 text-xs uppercase tracking-[0.24em] text-muted">Notes</p>
                    <p className="text-sm text-text">{viewingProperty.notes || "No notes added."}</p>
                  </div>
                </div>
              )}

              {viewTab === "blocks" && (
                <BlockManager propertyId={viewingProperty._id} />
              )}

              {viewTab === "tax" && (
                <TaxPaymentManager
                  annualTaxAmount={viewingProperty.annualTaxAmount ?? 0}
                  propertyId={viewingProperty._id}
                />
              )}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(deletingProperty)} onOpenChange={() => setDeletingProperty(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle className="text-danger">
              <Trash2 aria-hidden="true" size={20} className="text-danger" />
              Delete Property
            </DialogTitle>
            <DialogDescription>
              This removes the property record permanently. Active-tenant properties are protected.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted">
            Delete <span className="font-medium text-text">{deletingProperty?.name}</span>?
          </div>
          <DialogFooter>
            <Button onClick={() => setDeletingProperty(null)} variant="secondary">
              Cancel
            </Button>
            <Button loading={isDeleting} onClick={handleDelete} variant="danger">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}