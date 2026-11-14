export interface LogPropertiesSchema {
    ip?: string;
    city?: string;
    country?: string;
    device?: string;
    browser?: string;
    platform?: string;
    timezone?: string;
    user_agent?: string;
    device_name?: string;
    browser_version?: string | null;
    platform_version?: string;
    email?: string;
    old?: Record<string, string | null>;
    new?: Record<string, string | null>;
};

export interface LogSchema {
    id: number;
    user_id: string;
    description: string;
    event: string;
    properties: LogPropertiesSchema | null;
    ip_address: string;
    user_agent: string | null;
    created_at: string;
    updated_at: string;
};


export type ActivityLogEventConfigProps = {
  icon: React.ReactNode;
  label: string;
  iconBg: string;
  iconColor: string;
  badge: string;
};