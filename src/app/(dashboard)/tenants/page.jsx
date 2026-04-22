"use client";

import { useDeferredValue, useEffect, useState } from "react";
import {
  Calendar,
  Pencil,
  Plus,
  Search,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { TenantForm } from "@/components/tenants/tenant-form";
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

function formatRent(amount) {
  if (!amount && amount !== 0) {
    return "—";
  }

  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const deferredSearch = useDeferredValue(search);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [deactivatingTenant, setDeactivatingTenant] = useState(null);
  const [exitDate, setExitDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch tenants
  useEffect(() => {
    let isActive = true;

    async function fetchTenants() {
      setIsLoading(true);

      try {
        const response = await api.get("/tenants", {
          params: {
            search: deferredSearch || undefined,
            status: status === "all" ? undefined : status,
          },
        });

        if (isActive) {
          setTenants(response.data.tenants ?? []);
        }
      } catch (error) {
        if (isActive) {
          toast.error(error?.response?.data?.message ?? "Failed to load tenants.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchTenants();

    return () => {
      isActive = false;
    };
  }, [deferredSearch, refreshKey, status]);

  // Fetch properties for the form dropdown (once)
  useEffect(() => {
    let isActive = true;

    api.get("/properties")
      .then((res) => {
        if (isActive) {
          setProperties(res.data.properties ?? []);
        }
      })
      .catch(() => {
        // Non-critical — form will show empty dropdown
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSave(payload) {
    setIsSaving(true);

    try {
      const { rentAgreementFile, ...fields } = payload;
      let requestData;
      let config = {};

      if (rentAgreementFile) {
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });
        formData.append("rentAgreement", rentAgreementFile);
        requestData = formData;
      } else {
        requestData = Object.fromEntries(
          Object.entries(fields).filter(([, v]) => v !== null && v !== undefined),
        );
        config = { headers: { "Content-Type": "application/json" } };
      }

      if (editingTenant?._id) {
        await api.put(`/tenants/${editingTenant._id}`, requestData, config);
        toast.success("Tenant updated.");
      } else {
        await api.post("/tenants", requestData, config);
        toast.success("Tenant added.");
      }

      setIsSheetOpen(false);
      setEditingTenant(null);
      setSearch("");
      setRefreshKey((k) => k + 1);
    } catch (error) {
      const fieldErrors = error?.response?.data?.errors;

      if (fieldErrors) {
        return { fieldErrors };
      }

      toast.error(error?.response?.data?.message ?? "Failed to save tenant.");
    } finally {
      setIsSaving(false);
    }

    return null;
  }

  async function handleDeactivate() {
    if (!deactivatingTenant?._id) {
      return;
    }

    setIsDeactivating(true);

    try {
      await api.patch(`/tenants/${deactivatingTenant._id}/deactivate`, {
        exitDate: exitDate || undefined,
      });
      toast.success("Tenant marked as inactive.");
      setDeactivatingTenant(null);
      setExitDate("");
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to deactivate tenant.");
    } finally {
      setIsDeactivating(false);
    }
  }

  return (
    <section>
      <PageHeader
        action={
          <Button
            onClick={() => {
              setEditingTenant(null);
              setIsSheetOpen(true);
            }}
          >
            <Plus aria-hidden="true" size={16} />
            Add Tenant
          </Button>
        }
        title="Tenants"
      />

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface/90 p-4 shadow-(--shadow-card) sm:flex-row sm:items-center">
        <Input
          className="max-w-full sm:max-w-xs"
          icon={<Search aria-hidden="true" size={16} />}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone"
          value={search}
        />
        <Select
          className="sm:w-44"
          onChange={(e) => setStatus(e.target.value)}
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
        ) : tenants.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-18 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-border bg-bg/70 text-primary">
              <Users aria-hidden="true" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-text">No tenants yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              Add your first tenant and link them to a property to start tracking rent and dues.
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                setEditingTenant(null);
                setIsSheetOpen(true);
              }}
            >
              <Plus aria-hidden="true" size={16} />
              Add the first tenant
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant._id}>
                    <TableCell>
                      <div className="font-medium text-text">{tenant.fullName}</div>
                      <div className="mt-0.5 text-xs text-muted">{tenant.phone}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted">
                      {tenant.propertyId?.name ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium text-text">
                      {formatRent(tenant.monthlyRent)}
                    </TableCell>
                    <TableCell className="text-sm text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar aria-hidden="true" size={12} />
                        {tenant.paymentDueDate ? ordinal(tenant.paymentDueDate) : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tenant.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1.5">
                        <Button
                          aria-label={`Edit ${tenant.fullName}`}
                          onClick={() => {
                            setEditingTenant(tenant);
                            setIsSheetOpen(true);
                          }}
                          title="Edit tenant"
                          variant="icon"
                        >
                          <Pencil size={16} />
                        </Button>
                        {tenant.isActive ? (
                          <Button
                            aria-label={`Mark ${tenant.fullName} as inactive`}
                            onClick={() => {
                              setDeactivatingTenant(tenant);
                              setExitDate("");
                            }}
                            title="Tenant exit"
                            variant="icon"
                          >
                            <UserMinus size={16} />
                          </Button>
                        ) : (
                          <Button
                            aria-label="Tenant is already inactive"
                            className="opacity-30"
                            disabled
                            title="Already inactive"
                            variant="icon"
                          >
                            <UserCheck size={16} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add / Edit Sheet */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={(nextOpen) => {
          setIsSheetOpen(nextOpen);

          if (!nextOpen) {
            setEditingTenant(null);
          }
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <Users aria-hidden="true" size={20} className="text-primary" />
              {editingTenant ? "Edit Tenant" : "Add Tenant"}
            </SheetTitle>
            <SheetDescription>
              {editingTenant
                ? "Update the tenant record. Sensitive fields are stored encrypted."
                : "Onboard a new tenant and link them to a property."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
            <TenantForm
              key={editingTenant?._id ?? "new"}
              isSubmitting={isSaving}
              onCancel={() => {
                setIsSheetOpen(false);
                setEditingTenant(null);
              }}
              onSubmit={handleSave}
              properties={
                editingTenant
                  ? // When editing: show all + the tenant's current property even if occupied
                    properties.filter(
                      (p) =>
                        (p.activeTenantCount ?? 0) === 0 ||
                        String(p._id) === String(editingTenant.propertyId?._id ?? editingTenant.propertyId),
                    )
                  : // When creating: only vacant properties
                    properties.filter((p) => (p.activeTenantCount ?? 0) === 0)
              }
              tenant={editingTenant}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Tenant Exit Confirmation */}
      <Dialog
        open={Boolean(deactivatingTenant)}
        onOpenChange={(open) => {
          if (!open) {
            setDeactivatingTenant(null);
            setExitDate("");
          }
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              <UserMinus aria-hidden="true" size={20} className="text-danger" />
              Tenant Exit
            </DialogTitle>
            <DialogDescription>
              This marks the tenant as inactive and cancels all pending bills. Historical data
              is preserved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted">
            <p>
              Mark{" "}
              <span className="font-medium text-text">{deactivatingTenant?.fullName}</span> as
              inactive?
            </p>
            <Input
              helper="Leave blank to use today's date."
              label="Exit Date (Optional)"
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setExitDate(e.target.value)}
              type="date"
              value={exitDate}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setDeactivatingTenant(null);
                setExitDate("");
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button loading={isDeactivating} onClick={handleDeactivate} variant="danger">
              Mark Inactive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
