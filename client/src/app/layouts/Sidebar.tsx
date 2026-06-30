import { useState } from "react";
import { X } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Modal } from "@/components";
import PageHeader from "./components/PageHeader";
import SidebarContent from "./components/SidebarContent";
import { useToastContext } from "../hooks/common";
import { getErrorsMessagesStr } from "../utils/errorsHandling";
import { useAuthMutations } from "@/features/base/auth/hooks";
import { useMe } from "../hooks";
import { DataLoader } from "@/components/Loaders/DataLoader";

const ISDEVELOPMENT = import.meta.env.DEV;
const BACKENDURL = import.meta.env.VITE_PUBLIC_API || 'http://localhost:8000';

export default function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const query = useMe();
  const { logout } = useAuthMutations();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { toast } = useToastContext();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/login"),
      onError: (err: any) => {
        toast.error(getErrorsMessagesStr(err));
      },
    });
  };

  return (
    <DataLoader query={query}>
      {(data) => {
        const user = data;
        return (
          <div className="flex min-h-screen bg-base-200" data-theme="light">
            {/* ── Desktop sidebar (hidden on mobile) ── */}
            <aside className="hidden md:flex w-60 lg:w-72 lg:px-4 bg-base-100 border-r border-base-300 flex-col shrink-0">
              <SidebarContent />
            </aside>

            {/* ── Mobile drawer overlay ── */}
            {drawerOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/40 md:hidden"
                onClick={() => setDrawerOpen(false)}
              />
            )}

            {/* ── Mobile drawer panel ── */}
            <aside
              className={`fixed top-0 left-0 h-full w-64 z-50 bg-base-100 border-r border-base-300 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:hidden
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
              {/* Close button */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-3 right-3 btn btn-ghost btn-sm btn-circle"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </aside>
            <div className="flex-1 flex flex-col min-w-0">
              <Modal
                isOpen={isLogoutModalOpen}
                title="Confirm Logout"
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                confirmText="Logout"
                cancelText="Cancel"
                isConfirming={logout.isPending}
              >
                <p>Are you sure you want to log out?</p>
              </Modal>
              <PageHeader
                setDrawerOpen={(open) => setDrawerOpen(open)}
                setIsLogoutModalOpen={(open) => setIsLogoutModalOpen(open)}
                user={user}
              />
              <main className="flex-1">
                <div>
                  {ISDEVELOPMENT && (
                    <a 
                      href={`${BACKENDURL}/telescope`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ zIndex: 9999 }}
                      className="fixed bottom-5 right-5 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3 py-2 rounded-full shadow-2xl transition-all duration-200 hover:scale-105"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      🔍 Open Backend Telescope
                    </a>
                  )}
                  <Outlet />
                </div>
              </main>
            </div>
          </div>
        );
      }}
    </DataLoader>
  );
}