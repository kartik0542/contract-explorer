import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPageByUrl, getAllContracts } from "../services/api";
import CreateContractModal from "../components/CreateContractModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const CONTRACT_TYPES = [
  "All",
  "SOW",
  "Master Agreement",
  "Amendment",
  "Service Agreement",
];
const STATUS_TYPES = ["All", "Processed", "Pending", "Rejected"];

const ContractPage = () => {
  const { url } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Step 1: URL se Page config fetch karo
  const { data: pageData, isLoading: pageLoading } = useQuery({
    queryKey: ["page", url],
    queryFn: () => getPageByUrl(url).then((res) => res.data.data[0]),
  });

  // Step 2: PageId se filtered contracts fetch karo
  const { data: contractsData, isLoading: contractsLoading } = useQuery({
    queryKey: ["contracts", pageData?._id, activeType, activeStatus],
    queryFn: () =>
      getAllContracts({
        pageId: pageData._id,
        contractType: activeType !== "All" ? activeType : undefined,
        status: activeStatus !== "All" ? activeStatus : undefined,
        minAmount: minAmount || undefined, // ✅ add karo
        maxAmount: maxAmount || undefined, // ✅ add karo
      }).then((res) => res.data.data),
    enabled: !!pageData?._id, // jab tak pageData nahi aata tab tak contracts API run nahi hogi
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeType, activeStatus, minAmount, maxAmount]);

  if (pageLoading || contractsLoading)
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Loading...
      </div>
    );

  // Filter by search + activeType button
  const filtered = contractsData?.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "All" || c.contractType === activeType;
    const matchStatus = activeStatus === "All" || c.status === activeStatus;
    const matchMin = minAmount === "" || c.amount >= Number(minAmount);
    const matchMax = maxAmount === "" || c.amount <= Number(maxAmount);
    return matchSearch && matchType && matchStatus && matchMin && matchMax;
  });

  const totalPages = Math.ceil((filtered?.length || 0) / itemsPerPage);
  const paginated = filtered?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Status badge color
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
    <div className="p-6">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{pageData?.title}</h2>
        <CreateContractModal />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {CONTRACT_TYPES.map((type) => (
          <Button
            key={type}
            onClick={() => setActiveType(type)}
            variant={activeType === type ? "default" : "outline"}
            size="sm"
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Status Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_TYPES.map((status) => (
          <Button
            key={status}
            onClick={() => setActiveStatus(status)}
            variant={activeStatus === status ? "default" : "outline"}
            size="sm"
          >
            {status}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setActiveType("All");
            setActiveStatus("All");
            setMinAmount("");
            setMaxAmount("");
          }}
        >
          Reset Filters
        </Button>
      </div>

      {/* Amount Filter */}
      <div className="flex gap-2 mb-4 items-center">
        <Input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="max-w-37.5"
        />
        <span className="text-slate-400">—</span>
        <Input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          className="max-w-37.5"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contract Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-400 py-8"
                >
                  No contracts found
                </TableCell>
              </TableRow>
            ) : (
              paginated?.map((contract) => (
                <TableRow key={contract._id}>
                  <TableCell
                    className="font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/contracts/${contract._id}`)}
                  >
                    {contract.name}
                  </TableCell>
                  <TableCell>{contract.contractType}</TableCell>
                  <TableCell>₹{contract.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}
                    >
                      {contract.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {contract.description}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-2 gap-4">
        <p className="text-sm text-slate-500">
          Total: {filtered?.length || 0} contracts
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;
