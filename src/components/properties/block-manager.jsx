"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";

const emptyBlock = {
  areaSqFt: "",
  bpNumber: "",
  floor: "",
  name: "",
  notes: "",
  plannedRent: "",
};

function BlockForm({ block, isSubmitting, onCancel, onSubmit }) {
  const [form, setForm] = useState(
    block
      ? {
          areaSqFt: block.areaSqFt ?? "",
          bpNumber: block.bpNumber ?? "",
          floor: block.floor ?? "",
          name: block.name ?? "",
          notes: block.notes ?? "",
          plannedRent: block.plannedRent ?? "",
        }
      : emptyBlock,
  );
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Block name is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      areaSqFt: form.areaSqFt === "" ? null : Number(form.areaSqFt),
      bpNumber: form.bpNumber.trim(),
      floor: form.floor === "" ? null : Number(form.floor),
      name: form.name.trim(),
      notes: form.notes.trim(),
      plannedRent: form.plannedRent === "" ? null : Number(form.plannedRent),
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          error={errors.name}
          label="Block / Unit Name"
          onChange={(e) => update("name", e.target.value)}
          placeholder="Ground Floor Left"
          value={form.name}
        />
        <Input
          label="BP Number (Electricity Meter)"
          onChange={(e) => update("bpNumber", e.target.value)}
          placeholder="BP-0001234"
          value={form.bpNumber}
        />
        <Input
          label="Floor"
          onChange={(e) => update("floor", e.target.value)}
          placeholder="0"
          type="number"
          value={form.floor}
        />
        <Input
          label="Area (sq ft)"
          onChange={(e) => update("areaSqFt", e.target.value)}
          placeholder="500"
          type="number"
          value={form.areaSqFt}
        />
        <Input
          label="Planned Rent (₹)"
          onChange={(e) => update("plannedRent", e.target.value)}
          placeholder="12000"
          type="number"
          value={form.plannedRent}
        />
      </div>
      <Textarea
        label="Notes (Optional)"
        onChange={(e) => update("notes", e.target.value)}
        placeholder="Any notes about this block"
        rows={2}
        value={form.notes}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button loading={isSubmitting} type="submit">
          {block ? "Save Block" : "Add Block"}
        </Button>
      </div>
    </form>
  );
}

export function BlockManager({ propertyId }) {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [deletingBlock, setDeletingBlock] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);

    api.get(`/properties/${propertyId}/blocks`)
      .then((res) => {
        if (isActive) setBlocks(res.data.blocks ?? []);
      })
      .catch(() => {
        if (isActive) toast.error("Failed to load blocks.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [propertyId]);

  async function handleSave(data) {
    setIsSaving(true);
    try {
      if (editingBlock?._id) {
        const res = await api.put(`/properties/${propertyId}/blocks/${editingBlock._id}`, data);
        setBlocks((prev) => prev.map((b) => (b._id === res.data.block._id ? res.data.block : b)));
        toast.success("Block updated.");
      } else {
        const res = await api.post(`/properties/${propertyId}/blocks`, data);
        setBlocks((prev) => [...prev, res.data.block]);
        toast.success("Block added.");
      }
      setShowForm(false);
      setEditingBlock(null);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to save block.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingBlock?._id) return;
    setIsDeleting(true);
    try {
      await api.delete(`/properties/${propertyId}/blocks/${deletingBlock._id}`);
      setBlocks((prev) => prev.filter((b) => b._id !== deletingBlock._id));
      toast.success("Block removed.");
      setDeletingBlock(null);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to remove block.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2 py-3">
        <div className="h-10 animate-pulse rounded-lg bg-border/30" />
        <div className="h-10 animate-pulse rounded-lg bg-border/20" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showForm || editingBlock ? (
        <div className="rounded-xl border border-border bg-bg/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            {editingBlock ? "Edit Block" : "New Block"}
          </p>
          <BlockForm
            block={editingBlock}
            isSubmitting={isSaving}
            onCancel={() => {
              setShowForm(false);
              setEditingBlock(null);
            }}
            onSubmit={handleSave}
          />
        </div>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          size="sm"
          variant="secondary"
        >
          <Plus aria-hidden="true" size={14} />
          Add Block
        </Button>
      )}

      {blocks.length === 0 && !showForm ? (
        <p className="text-sm text-muted">No blocks yet. Add the first rentable unit above.</p>
      ) : (
        <div className="space-y-2">
          {blocks.map((block) => (
            <div
              key={block._id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-text">{block.name}</span>
                  {block.status === "occupied" ? (
                    <Badge variant="success">Occupied</Badge>
                  ) : (
                    <Badge variant="outline">Vacant</Badge>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
                  {block.bpNumber ? (
                    <span className="inline-flex items-center gap-1">
                      <Zap aria-hidden="true" size={11} />
                      {block.bpNumber}
                    </span>
                  ) : null}
                  {block.floor != null ? <span>Floor {block.floor}</span> : null}
                  {block.areaSqFt ? <span>{block.areaSqFt} sq ft</span> : null}
                  {block.plannedRent ? <span>₹{Number(block.plannedRent).toLocaleString("en-IN")}/mo</span> : null}
                  {block.currentTenant ? (
                    <span className="text-text">{block.currentTenant}</span>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  aria-label={`Edit ${block.name}`}
                  onClick={() => {
                    setEditingBlock(block);
                    setShowForm(false);
                  }}
                  variant="icon"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  aria-label={`Delete ${block.name}`}
                  onClick={() => setDeletingBlock(block)}
                  variant="icon"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(deletingBlock)}
        onOpenChange={(open) => {
          if (!open) setDeletingBlock(null);
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              <Trash2 aria-hidden="true" size={20} className="text-danger" />
              Remove Block
            </DialogTitle>
            <DialogDescription>
              Remove <strong>{deletingBlock?.name}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeletingBlock(null)} variant="secondary">
              Cancel
            </Button>
            <Button loading={isDeleting} onClick={handleDelete} variant="danger">
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
