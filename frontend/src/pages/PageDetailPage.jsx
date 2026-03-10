import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPageById } from "../services/api.js";
import { Button } from "@/components/ui/button";
import EditPageModal from "@/components/EditPageModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePage } from "../services/api.js";

const PageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["page", id],
    queryFn: () => getPageById(id).then((res) => res.data.data),
  });

  const { mutate: deletePageMutate } = useMutation({
    mutationFn: (id) => deletePage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      navigate("/pages/all-contracts");
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Page not found!
      </div>
    );

  return (
    <div className="p-8 max-w-2xl">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>

      {/* Page Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{data?.title}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">URL</p>
            <p className="text-sm font-medium text-slate-700">/{data?.url}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Rank</p>
            <p className="text-sm font-medium text-slate-700">{data?.rank}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Parent</p>
            <p className="text-sm font-medium text-slate-700">
              {data?.parent || "None"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Created At</p>
            <p className="text-sm text-slate-700">
              {new Date(data?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div>
          <p className="text-xs text-slate-400 uppercase mb-1">Filters</p>
          {Object.keys(data?.filters || {}).length === 0 ? (
            <p className="text-sm text-slate-500">Koi filter nahi</p>
          ) : (
            <pre className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
              {JSON.stringify(data?.filters, null, 2)}
            </pre>
          )}
        </div>

        <div className="flex gap-4">
          <EditPageModal page={data} />
          <Button
            size="sm"
            className="gap-2"
            variant="destructive"
            onClick={() => {
              if (window.confirm("Page delete karna hai?")) {
                deletePageMutate(data._id);
                navigate("/");
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageDetailPage;
