import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContract } from "../services/api.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONTRACT_TYPES = ["SOW", "Master Agreement", "Amendment", "Service Agreement"];
const STATUS_TYPES = ["Pending", "Processed", "Rejected"];

const EditContractModal = ({ contract }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: contract.name,
    contractType: contract.contractType,
    amount: contract.amount,
    description: contract.description || "",
    status: contract.status || "Processed",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateContract(contract._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      setOpen(false);
    },
  });

  const handleSubmit = () => {
    if (!form.name || !form.amount) return alert("Name aur Amount required hai!");
    mutate({ ...form, amount: Number(form.amount) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contract Edit Karo</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Contract Type */}
          <div>
            <label className="text-sm font-medium text-slate-700">Contract Type</label>
            <select
              value={form.contractType}
              onChange={(e) => setForm({ ...form, contractType: e.target.value })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mt-1"
            >
              {CONTRACT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-slate-700">Amount</label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mt-1"
            >
              {STATUS_TYPES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Update Contract"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditContractModal;