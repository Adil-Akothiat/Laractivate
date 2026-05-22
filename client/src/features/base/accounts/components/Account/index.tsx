import { useParams, useSearchParams } from "react-router-dom";
import { useAccount } from "@/features/base/accounts";
import { Breadcrumb } from "@/components";
import AccountProfile from "./Profile/AccountProfile";
import AccountSecurity from "./Security/AccountSecurity";
import AccountDangerZone from "./DangerZone/AccountDangerZone";
import Tabs from "@/components/Tabs/Tabs";
import {
  IdCard,
  LayoutDashboard,
  User,
  UserCircle,
  ShieldCheck,
  Lock,
  Trash2,
  Globe,
  Logs,
} from "lucide-react";
import Container from "@/components/Container";
import AccountSessions from "./Sessions/AccountSession";
import AccountAccess from "./Access/AccountAccess";
import AccountActivityLogs from "./ActivityLog/AccountActivityLogs";
import { DataLoader } from "@/components/Loaders/DataLoader";

const VALID_TABS = [
  "profile",
  "security",
  "access",
  "danger",
  "sessions",
  "activity-logs",
];

export default function AccountDetails() {
  const { id } = useParams();
  const query = useAccount(id);

  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "profile";

  return (
    <Container>
      <DataLoader query={query}>
        {(data) => {
          const user = data;
          return (
            <>
              <Breadcrumb
                items={[
                  {
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: <LayoutDashboard size={16} />,
                  },
                  {
                    label: "Accounts",
                    href: "/accounts",
                    icon: <User size={16} />,
                  },
                  {
                    label: user!.full_name || user!.email,
                    href: `/accounts/${id}`,
                    icon: <IdCard size={16} />,
                  },
                ]}
              />

              <Tabs
                vertical={true}
                tabs={[
                  {
                    key: "profile",
                    label: "Profile",
                    icon: <UserCircle size={15} />,
                    content: <AccountProfile user={user} />,
                  },
                  {
                    key: "security",
                    label: "Security",
                    icon: <ShieldCheck size={15} />,
                    content: <AccountSecurity user={user} />,
                  },
                  {
                    key: "access",
                    label: "Access",
                    icon: <Lock size={15} />,
                    content: <AccountAccess user={user} />,
                  },
                  {
                    key: "danger",
                    label: "Danger Zone",
                    icon: <Trash2 size={15} />,
                    content: <AccountDangerZone user={user} />,
                  },
                  {
                    key: "sessions",
                    label: "Sessions",
                    icon: <Globe size={15} />,
                    content: <AccountSessions userId={user?.id} />,
                  },
                  {
                    key: "activity-logs",
                    label: "Activity Logs",
                    icon: <Logs size={15} />,
                    content: <AccountActivityLogs userId={user?.id} />,
                  },
                ]}
                activeKey={initialTab}
                variant="bordered"
                size="sm"
                className="mt-4"
              />
            </>
          );
        }}
      </DataLoader>
    </Container>
  );
}