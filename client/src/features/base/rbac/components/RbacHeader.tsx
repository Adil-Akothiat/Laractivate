import { LayoutDashboard, UserKey } from "lucide-react";
import { Breadcrumb } from "@/components";
import { CreateRole } from "./CreateRole";
import { useToastContext } from "@/app/hooks/useToastContext";
import SearchAndFilterRoles from "./SearchAndFilterRoles";
import { Can } from "@/components/Guard/Can";

export default function RbacHeader() {
    const { toast } = useToastContext();
    const handleAlert = (msg:string, variant: "success" | "error" | "warning" | "info") => {
        console.log(msg);
        toast[variant](msg);
    }
    return (
        <div className="py-3">
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
                    { label: "Accounts", href: "/accounts", icon: <UserKey size={16} /> },
                ]}
            />
                <div>
                    <h1 className="text-2xl font-bold text-base-content">Roles & Permissions</h1>
                    <Can 
                        permission='roles.manage'
                        fallback={
                            <p className="text-sm text-warning mt-1">
                                You are only allowed to view this page, contact administrator for more access.
                            </p>
                        }
                    >
                        <p className="text-sm text-base-content/50 mt-1">
                            Manage roles and control what each role can do.
                        </p>
                    </Can>
                </div>
            <div className="flex justify-between mt-4">
            <SearchAndFilterRoles />
            <CreateRole
                onSuccess={(msg:string)=> handleAlert(msg, "success")}
                onFailure={(msg:string)=> handleAlert(msg, "error")}
            />
            </div>
        </div>
    );
}