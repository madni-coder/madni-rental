"use client";

import { useState } from "react";
import { ExternalLink, Paperclip, Plus, Trash2, X } from "lucide-react";
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
import { Select } from "@/components/ui/select";
import api from "@/lib/axios";

const DOC_TYPE_LABELS = {
  aadhaar_copy: "Aadhaar Copy",
  other: "Other",
  pan_copy: "PAN Copy",
  rent_agreement: "Rent Agreement",
};

const DOC_TYPE_VARIANTS = {
  aadhaar_copy: "primary",
  other: "outline",
  pan_copy: "primary",
  rent_agreement: "success",
};

function UploadForm({ isSubmitting, onCancel, onSubmit }) {
  const [docType, setDocType] = useState("rent_agreement");
  const [label, setLabel] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  function validate() {
    if (!file) {
      setError("Please select a file.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10 MB.");
      return false;
    }
    setError("");
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ docType, file, label });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Select
        label="Document Type"
        onChange={(e) => setDocType(e.target.value)}
        value={docType}
      >
        <option value="aadhaar_copy">Aadhaar Copy</option>
        <option value="pan_copy">PAN Copy</option>
        <option value="rent_agreement">Rent Agreement</option>
        <option value="other">Other</option>
      </Select>
      <Input
        label="Label (Optional)"
        onChange={(e) => setLabel(e.target.value)}
        placeholder="e.g. Agreement 2024-25"
        value={label}
      />
      <div className="space-y-1.5">
        <label className="block text-xs font-medium uppercase tracking-[0.24em] text-muted">
          File
        </label>
        {file ? (
          <div className="flex items-center gap-2 rounded-md border border-border bg-bg/55 px-3 py-2 text-sm">
            <Paperclip aria-hidden="true" className="shrink-0 text-muted" size={14} />
            <span className="flex-1 truncate text-text">{file.name}</span>
            <button
              aria-label="Remove file"
              className="text-muted transition-colors hover:text-danger"
              onClick={() => setFile(null)}
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-bg/40 px-3 py-3 text-sm text-muted transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
            <Paperclip aria-hidden="true" size={14} />
            Click to select file (PDF, JPG, PNG — max 10 MB)
            <input
              accept="application/pdf,image/jpeg,image/png"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  setError("");
                }
              }}
              type="file"
            />
          </label>
        )}
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button loading={isSubmitting} type="submit">
          Upload
        </Button>
      </div>
    </form>
  );
}

export function TenantDocumentManager({ documents: initialDocuments = [], tenantId }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [showUpload, setShowUpload] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleUpload({ docType, file, label }) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", docType);
      if (label.trim()) formData.append("label", label.trim());

      const res = await api.post(`/tenants/${tenantId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDocuments(res.data.documents ?? []);
      toast.success("Document uploaded.");
      setShowUpload(false);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete() {
    if (!deletingDoc?._id) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/tenants/${tenantId}/documents/${deletingDoc._id}`);
      setDocuments(res.data.documents ?? []);
      toast.success("Document removed.");
      setDeletingDoc(null);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to remove document.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {!showUpload && (
        <Button onClick={() => setShowUpload(true)} size="sm" variant="secondary">
          <Plus aria-hidden="true" size={14} />
          Upload Document
        </Button>
      )}

      {showUpload && (
        <div className="rounded-xl border border-border bg-bg/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Upload Document
          </p>
          <UploadForm
            isSubmitting={isUploading}
            onCancel={() => setShowUpload(false)}
            onSubmit={handleUpload}
          />
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-sm text-muted">No documents uploaded yet.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={DOC_TYPE_VARIANTS[doc.type] ?? "outline"}>
                    {DOC_TYPE_LABELS[doc.type] ?? doc.type}
                  </Badge>
                  {doc.label ? (
                    <span className="text-sm text-text">{doc.label}</span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  aria-label="View document"
                  as="a"
                  href={doc.url}
                  rel="noreferrer"
                  target="_blank"
                  variant="icon"
                >
                  <ExternalLink size={14} />
                </Button>
                <Button
                  aria-label="Remove document"
                  onClick={() => setDeletingDoc(doc)}
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
        open={Boolean(deletingDoc)}
        onOpenChange={(open) => {
          if (!open) setDeletingDoc(null);
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              <Trash2 aria-hidden="true" size={20} className="text-danger" />
              Remove Document
            </DialogTitle>
            <DialogDescription>
              Remove{" "}
              <strong>
                {DOC_TYPE_LABELS[deletingDoc?.type] ?? deletingDoc?.type}
                {deletingDoc?.label ? ` — ${deletingDoc.label}` : ""}
              </strong>
              ? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeletingDoc(null)} variant="secondary">
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
