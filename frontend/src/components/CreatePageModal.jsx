import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPage } from "../services/api.js";
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

const CONTRACT_TYPES = [
  "SOW",
  "Amendment",
  "Master Agreement",
  "Service Agreement",
];
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

      {/* Selected Tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 mb-1">
          {selected.map((val) => (
            <span
              key={val}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {val}
              <button
                onClick={() => handleRemove(val)}
                className="hover:text-blue-600"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <select
        onChange={handleAdd}
        defaultValue=""
        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
      >
        <option value="" disabled>
          -- Select --
        </option>
        {options
          .filter((opt) => !selected.includes(opt))
          .map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
      </select>
    </div>
  );
};

const CreatePageModal = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    url: "",
    rank: "",
  });
  const [contractTypes, setContractTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      setOpen(false);
      setForm({ title: "", url: "", rank: "" });
      setContractTypes([]);
      setStatuses([]);
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Error creating page");
    },
  });

  const handleSubmit = () => {
    if (!form.title || !form.url) return alert("Title aur URL required hai!");

    // Filters automatically build hoga dropdowns se
    const filters = {};
    if (contractTypes.length > 0) filters.contractType = contractTypes;
    if (statuses.length > 0) filters.status = statuses;

    mutate({
      title: form.title,
      url: form.url,
      rank: Number(form.rank) || 0,
      filters, // { contractType: ["SOW"], status: ["Processed", "Pending"] }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full mt-2">
          + Add Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Naya Page Banao</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            <Input
              placeholder="SOW Contracts"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* URL */}
          <div>
            <label className="text-sm font-medium text-slate-700">URL</label>
            <Input
              placeholder="sow-contracts"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>

          {/* Rank */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Rank (sidebar order)
            </label>
            <Input
              type="number"
              placeholder="1"
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
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Saving..." : "Create Page"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePageModal;
