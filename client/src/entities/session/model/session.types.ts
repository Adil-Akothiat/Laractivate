export interface SessionSchema {
  session_id: number;
  user_id: string;
  device: string;
  device_name?: string;
  browser: string;
  browser_version?: string;
  platform: string;
  platform_version?: string;
  ip_address: string;
  city?: string;
  country?: string;
  timezone?: string;
  user_agent?: string;
  is_current: boolean;
  is_active: boolean;
  revoked: boolean;
  last_active: string;
}

export interface SessionResponseSchema {
  active: SessionSchema[];
  history: SessionSchema[];
}

export interface SessionCardProps {
  session: SessionSchema;
  active?: boolean;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  isRevoking?: boolean;
  onRevoke?: (session: SessionSchema) => void;
}
export interface DeviceIconProps {
  device: string;
  active: boolean;
}

export interface SessionRowProps {
  label: string;
  value: string
}