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

const CreatePageModal = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    url: "",
    rank: "",
    filters: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      setOpen(false);
      setForm({ title: "", url: "", rank: "", filters: "" });
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Error creating page");
    }
  });

  const handleSubmit = () => {
    if (!form.title || !form.url) return alert("Title aur URL required hai!");

    // filters ko parse karo agar likha ho
    let parsedFilters = {};
    if (form.filters) {
      try {
        parsedFilters = JSON.parse(form.filters);
      } catch {
        return alert("Filters valid JSON hona chahiye!\nExample: {\"contractType\": [\"SOW\"]}");
      }
    }

    mutate({
      title: form.title,
      url: form.url,
      rank: Number(form.rank) || 0,
      filters: parsedFilters,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full mt-2">+ Add Page</Button>
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
            <label className="text-sm font-medium text-slate-700">Rank (sidebar order)</label>
            <Input
              type="number"
              placeholder="1"
              value={form.rank}
              onChange={(e) => setForm({ ...form, rank: e.target.value })}
            />
          </div>

          {/* Filters */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Filters (JSON format)
            </label>
            <Input
              placeholder='{"contractType": ["SOW"]}'
              value={form.filters}
              onChange={(e) => setForm({ ...form, filters: e.target.value })}
            />
            <p className="text-xs text-slate-400 mt-1">
              Khaali chhodo agar koi filter nahi chahiye
            </p>
          </div>  

          {/* Submit */}
          <Button onClick={handleSubmit} disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Create Page"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePageModal;