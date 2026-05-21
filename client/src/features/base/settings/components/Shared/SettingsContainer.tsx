import { FingerprintPattern, Lock, Logs, User, UserKey } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
    children:ReactNode;
    settingsType:'profile'|'password'|'two_factor_auth'|'sessions'|'activity_logs'|'two_factor_auth';
}

const headers = {
    profile:{
        title:'Profile',
        description:'description profile',
        icon:<Lock size={18} className="text-primary"/>
    },
    password:{
        title:'Password',
        description:"Manage devices logged into your account. If you don't recognise a session, revoke it immediately to secure your account.",
        icon:<User size={18} className="text-primary"/>
    },
    two_factor_auth:{
        title:'Two-Factor Authentication',
        description:"Secure your account with an authenticator app.",
        icon:<FingerprintPattern size={18} className="text-primary"/>
    },
    sessions:{
        title:'Sessions',
        description:"Manage devices logged into your account. If you don't recognise a session, revoke it immediately to secure your account.",
        icon:<UserKey size={18} className="text-primary"/>
    },
    activity_logs:{
        title:'Activity Logs',
        description:"Manage devices logged into your account. If you don't recognise a session, revoke it immediately to secure your account.",
        icon:<Logs size={18} className="text-primary"/>
    },

};
export default function SettingsContainer({ children, settingsType }: Props) {
  const { icon, title, description } = headers[settingsType];
  return (
    <div className="py-6 px-3 space-y-6">

      {/* Header: icon + text inline, compact and grouped */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-base-content text-base">{title}</h2>
          <p className="text-sm text-base-content/60 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Divider: clear boundary between header and content */}
      <div className="h-px bg-base-content/10" />

      {children}
    </div>
  );
}