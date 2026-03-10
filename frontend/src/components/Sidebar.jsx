import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getAllPages } from "../services/api";
import { usePage } from "../context/PageContext";
import CreatePageModal from "./CreatePageModal";

const Sidebar = () => {
  const navigate = useNavigate();
  const { url } = useParams();
  const { setActivePage } = usePage();

  // TanStack Query se pages fetch karo
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pages"],
    queryFn: () => getAllPages().then((res) => res.data.data),
  });

  if (isLoading) return <div className="p-4 text-slate-400">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-400">Error loading pages</div>;

  const handlePageClick = (page) => {
    setActivePage(page);
    navigate(`/pages/${page.url}`);
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Contract Explorer</h1>
      </div>

      {/* Pages List */}
      <nav className="flex-1 p-4 space-y-1">
        {data?.map((page) => (
          <div key={page._id} className="flex items-center gap-1">
            <button
              onClick={() => handlePageClick(page)}
              className={`flex-1 text-left px-4 py-2 rounded-lg transition-colors duration-200 text-sm
        ${
          url === page.url
            ? "bg-slate-600 text-white font-semibold"
            : "text-slate-300 hover:bg-slate-700 hover:text-white"
        }`}
            >
              {page.title}
            </button>
            <button
              onClick={() => navigate(`/page-detail/${page._id}`)}
              className="text-slate-400 hover:text-blue-400 text-xs"
            >
              ℹ️
            </button>
          </div>
        ))}
      </nav>

      {/* ✅ YAHAN ADD KARO - bottom mein */}
      <div className="p-4 border-t border-slate-700">
        <CreatePageModal />
      </div>
    </aside>
  );
};

export default Sidebar;