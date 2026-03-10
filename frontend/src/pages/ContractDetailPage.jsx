import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getContractById } from "../services/api.js";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContract } from "../services/api.js";
import EditContractModal from "../components/EditContractModal";

const ContractDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contract", id],
    queryFn: () => getContractById(id).then((res) => res.data.data),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id) => deleteContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
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
        Contract not found!
      </div>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>

      {/* Contract Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{data?.name}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">
              Contract Type
            </p>
            <p className="text-sm font-medium text-slate-700">
              {data?.contractType}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Amount</p>
            <p className="text-sm font-medium text-slate-700">
              ₹{data?.amount?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Status</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data?.status)}`}
            >
              {data?.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Created At</p>
            <p className="text-sm text-slate-700">
              {new Date(data?.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Description</p>
            <p className="text-sm text-slate-700">
              {data?.description || "No description"}
            </p>
          </div>

          <div className="flex gap-4">
            <EditContractModal contract={data} />

            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (window.confirm("Delete karna hai?")) {
                  deleteMutate(data._id);
                  navigate("/");
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPage;
