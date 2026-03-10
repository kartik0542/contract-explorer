import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ContractPage from "./pages/ContractPage";
import ContractDetailPage from "./pages/ContractDetailPage";
import PageDetailPage from "./pages/PageDetailPage";

const App = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/pages/all-contracts" />} />
          <Route path="/pages/:url" element={<ContractPage />} />
          <Route path="/contracts/:id" element={<ContractDetailPage />} />
          <Route path="/page-detail/:id" element={<PageDetailPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
