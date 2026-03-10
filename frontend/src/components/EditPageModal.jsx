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

const EditPageModal = ({ page }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: page.title,
    url: page.url,
    rank: page.rank,
    filters: page.filters ? JSON.stringify(page.filters) : "",
  });

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

  const handleSubmit = () => {
    if (!form.title || !form.url) return alert("Title aur URL required hai!");

    let parsedFilters = {};
    if (form.filters) {
      try {
        parsedFilters = JSON.parse(form.filters);
      } catch {
        return alert(
          'Filters valid JSON hona chahiye!\nExample: {"contractType": ["SOW"]}',
        );
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
        <Button size="sm" variant="outline">
          Edit
        </Button>
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

          {/* Filters */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Filters (JSON)
            </label>
            <Input
              placeholder='{"contractType": ["SOW"]}'
              value={form.filters}
              onChange={(e) => setForm({ ...form, filters: e.target.value })}
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Saving..." : "Update Page"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPageModal;
