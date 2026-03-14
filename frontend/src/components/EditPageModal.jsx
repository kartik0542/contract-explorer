import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePage } from "../services/api.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const CONTRACT_TYPES = ["SOW", "Amendment", "Master Agreement", "Service Agreement"];
const STATUSES = ["Processed", "Pending", "Draft", "Rejected"];

const TagSelect = ({ label, options, selected, onChange }) => {
  const handleAdd = (e) => {
    const val = e.target.value;
    if (val && !selected.includes(val)) {
      onChange([...selected, val]);
    }
    e.target.value = "";
  };

  const handleRemove = (val) => {
    onChange(selected.filter((v) => v !== val));
  };

  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 mb-1">
          {selected.map((val) => (
            <span
              key={val}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {val}
              <button onClick={() => handleRemove(val)} className="hover:text-blue-600">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <select
        onChange={handleAdd}
        defaultValue=""
        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
      >
        <option value="" disabled>-- Select --</option>
        {options
          .filter((opt) => !selected.includes(opt))
          .map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
      </select>
    </div>
  );
};

const EditPageModal = ({ page }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: page.title,
    url: page.url,
    rank: page.rank,
  });

  // ✅ Existing filters se pre-load ho jaayenge
  const [contractTypes, setContractTypes] = useState(
    page.filters?.contractType || []
  );
  const [statuses, setStatuses] = useState(
    page.filters?.status || []
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updatePage(page._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      setOpen(false);
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Error updating page");
    },
  });

  // ✅ Dialog open hone par fresh state load karo (agar page prop change ho)
  const handleOpenChange = (val) => {
    if (val) {
      setForm({ title: page.title, url: page.url, rank: page.rank });
      setContractTypes(page.filters?.contractType || []);
      setStatuses(page.filters?.status || []);
    }
    setOpen(val);
  };

  const handleSubmit = () => {
    if (!form.title || !form.url) return alert("Title aur URL required hai!");

    const filters = {};
    if (contractTypes.length > 0) filters.contractType = contractTypes;
    if (statuses.length > 0) filters.status = statuses;

    mutate({
      title: form.title,
      url: form.url,
      rank: Number(form.rank) || 0,
      filters,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Page Edit Karo</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* URL */}
          <div>
            <label className="text-sm font-medium text-slate-700">URL</label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>

          {/* Rank */}
          <div>
            <label className="text-sm font-medium text-slate-700">Rank</label>
            <Input
              type="number"
              value={form.rank}
              onChange={(e) => setForm({ ...form, rank: e.target.value })}
            />
          </div>

          {/* Contract Type Dropdown */}
          <TagSelect
            label="Contract Type"
            options={CONTRACT_TYPES}
            selected={contractTypes}
            onChange={setContractTypes}
          />

          {/* Status Dropdown */}
          <TagSelect
            label="Status"
            options={STATUSES}
            selected={statuses}
            onChange={setStatuses}
          />

          {/* Submit */}
          <Button onClick={handleSubmit} disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Update Page"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPageModal;