"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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

function TaxPaymentForm({ isSubmitting, onCancel, onSubmit }) {
  const currentYear = new Date().getFullYear();
  const [form, setForm] = useState({
    amount: "",
    notes: "",
    paidOn: new Date().toISOString().slice(0, 10),
    year: String(currentYear),
  });
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
    if (!form.year || Number(form.year) < 2000) errs.year = "Valid year is required.";
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Amount must be greater than zero.";
    if (!form.paidOn) errs.paidOn = "Payment date is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      amount: Number(form.amount),
      notes: form.notes.trim(),
      paidOn: form.paidOn,
      year: Number(form.year),
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          error={errors.year}
          label="Tax Year"
          max={2100}
          min={2000}
          onChange={(e) => update("year", e.target.value)}
          step={1}
          type="number"
          value={form.year}
        />
        <Input
          error={errors.amount}
          label="Amount Paid (₹)"
          onChange={(e) => update("amount", e.target.value)}
          placeholder="5000"
          type="number"
          value={form.amount}
        />
        <Input
          error={errors.paidOn}
          label="Payment Date"
          onChange={(e) => update("paidOn", e.target.value)}
          type="date"
          value={form.paidOn}
        />
      </div>
      <Textarea
        label="Notes (Optional)"
        onChange={(e) => update("notes", e.target.value)}
        placeholder="Receipt no, office, etc."
        rows={2}
        value={form.notes}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button loading={isSubmitting} type="submit">
          Record Payment
        </Button>
      </div>
    </form>
  );
}

export function TaxPaymentManager({ annualTaxAmount = 0, propertyId }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [payments, setPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);

    api.get(`/properties/${propertyId}/tax-payments`, { params: { year } })
      .then((res) => {
        if (isActive) {
          setPayments(res.data.payments ?? []);
          setTotalPaid(res.data.totalPaid ?? 0);
          setOutstanding(res.data.outstanding ?? 0);
        }
      })
      .catch(() => {
        if (isActive) toast.error("Failed to load tax payments.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [propertyId, year]);

  async function handleSave(data) {
    setIsSaving(true);
    try {
      const res = await api.post(`/properties/${propertyId}/tax-payments`, data);
      setPayments((prev) => [res.data.payment, ...prev]);
      const newTotal = totalPaid + res.data.payment.amount;
      setTotalPaid(newTotal);
      setOutstanding(Math.max(0, annualTaxAmount - newTotal));
      toast.success("Tax payment recorded.");
      setShowForm(false);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to record payment.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingPayment?._id) return;
    setIsDeleting(true);
    try {
      await api.delete(`/properties/${propertyId}/tax-payments/${deletingPayment._id}`);
      const removed = deletingPayment.amount;
      setPayments((prev) => prev.filter((p) => p._id !== deletingPayment._id));
      const newTotal = Math.max(0, totalPaid - removed);
      setTotalPaid(newTotal);
      setOutstanding(Math.max(0, annualTaxAmount - newTotal));
      toast.success("Payment removed.");
      setDeletingPayment(null);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to remove payment.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-bg/40 px-3 py-2 text-center">
          <p className="text-xs text-muted">Annual Tax</p>
          <p className="font-semibold text-text">₹{Number(annualTaxAmount).toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg/40 px-3 py-2 text-center">
          <p className="text-xs text-muted">Paid ({year})</p>
          <p className="font-semibold text-success">₹{Number(totalPaid).toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg/40 px-3 py-2 text-center">
          <p className="text-xs text-muted">Outstanding</p>
          <p className={`font-semibold ${outstanding > 0 ? "text-danger" : "text-text"}`}>
            ₹{Number(outstanding).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Year selector */}
      <div className="flex items-center gap-3">
        <Input
          className="w-28"
          label="Year"
          max={currentYear + 1}
          min={2000}
          onChange={(e) => setYear(Number(e.target.value))}
          step={1}
          type="number"
          value={year}
        />
        {!showForm && (
          <Button
            className="mt-5"
            onClick={() => setShowForm(true)}
            size="sm"
            variant="secondary"
          >
            <Plus aria-hidden="true" size={14} />
            Record Payment
          </Button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-bg/40 p-4">
          <TaxPaymentForm
            isSubmitting={isSaving}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
          />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-10 animate-pulse rounded-lg bg-border/30" />
          <div className="h-10 animate-pulse rounded-lg bg-border/20" />
        </div>
      ) : payments.length === 0 ? (
        <p className="text-sm text-muted">No tax payments recorded for {year}.</p>
      ) : (
        <div className="space-y-2">
          {payments.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3"
            >
              <div>
                <p className="font-medium text-text">₹{Number(p.amount).toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted">
                  {new Date(p.paidOn).toLocaleDateString("en-IN")}
                  {p.notes ? ` · ${p.notes}` : ""}
                </p>
              </div>
              <Button
                aria-label="Remove payment"
                onClick={() => setDeletingPayment(p)}
                variant="icon"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(deletingPayment)}
        onOpenChange={(open) => {
          if (!open) setDeletingPayment(null);
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              <Trash2 aria-hidden="true" size={20} className="text-danger" />
              Remove Tax Payment
            </DialogTitle>
            <DialogDescription>
              Remove this payment of{" "}
              <strong>₹{Number(deletingPayment?.amount).toLocaleString("en-IN")}</strong>? This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeletingPayment(null)} variant="secondary">
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
