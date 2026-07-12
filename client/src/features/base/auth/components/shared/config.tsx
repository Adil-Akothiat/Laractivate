import { Bell, CircleCheck, Clock, Fingerprint, KeyRound, Layers, Lock, Mail, RefreshCw, ShieldCheck, Star, UserRound, Users } from "lucide-react";
import type { ReactNode } from "react";

interface VariantConfig {
  title:    string;
  subtitle: string;
  features: { icon: ReactNode; label: string; desc: string }[];
  footer:   ReactNode;
}

export type AuthBannerVariant = "login" | "register" | "forgot-password" | "reset-password";
export const VARIANT_CONFIG: Record<AuthBannerVariant, VariantConfig> = {
  login: {
    title:    "System Oversight & Control.",
    subtitle: "Centralized management for user accounts, system security, and activity tracking.",
    features: [
      { 
        icon: <Users size={14} />,   
        label: "Account Management",  
        desc: "Modify profiles, manage statuses, and oversee all platform users." 
      },
      { 
        icon: <Fingerprint size={14} />, 
        label: "Multi-Factor Auth",      
        desc: "Secure administrative access with built-in 2FA support." 
      },
      { 
        icon: <ShieldCheck size={14} />, 
        label: "RBAC & Activity Logs",   
        desc: "Role-based permissions and real-time user activity tracking." 
      },
      { 
        icon: <Layers size={14} />,       
        label: "Team Workspaces",    
        desc: "Advanced organizational structures — Coming Soon." 
      },
    ],
    footer: (
      <>
        <div className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white/70">
          Admin Suite
        </div>
        <p className="text-white/40 text-xs">Security-first boilerplate</p>
      </>
    ),
  },
  register: {
    title:    "Get started in minutes.",
    subtitle: "Create your account and unlock everything you need to run your team.",
    features: [
      { icon: <UserRound size={14} />,    label: "Free to start",       desc: "No credit card required to create an account."    },
      { icon: <ShieldCheck size={14} />, label: "Secure by default",   desc: "Your data is encrypted and protected from day one." },
      { icon: <Bell size={14} />,        label: "Instant onboarding",  desc: "Invites, roles, and settings ready right away."    },
      { icon: <Star size={14} />,        label: "Built for teams",     desc: "Scale from a solo account to a full organisation." },
    ],
    footer: (
      <p className="text-white/40 text-xs">
        Join <span className="text-white/70 font-medium">10,000+</span> teams already on AuthPanel
      </p>
    ),
  },

  "forgot-password": {
    title:    "Lost access? We'll get you back in.",
    subtitle: "Enter your email and we'll send a secure reset link in seconds.",
    features: [
      { icon: <Mail size={14} />,        label: "Check your inbox",       desc: "A reset link will arrive within a few seconds."   },
      { icon: <Clock size={14} />,       label: "Link expires in 15 min", desc: "For your safety, reset links are short-lived."    },
      { icon: <ShieldCheck size={14} />, label: "Secure reset flow",      desc: "Links are one-time use and fully encrypted."      },
      { icon: <Lock size={14} />,        label: "No guessing needed",     desc: "Your current password stays safe until you act."  },
    ],
    footer: (
      <p className="text-white/40 text-xs">
        Still stuck?{" "}
        <a href="#" className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">
          Contact support
        </a>
      </p>
    ),
  },

  "reset-password": {
    title:    "Almost there — set a new password.",
    subtitle: "Choose something strong. You won't need to do this again for a while.",
    features: [
      { icon: <KeyRound size={14} />,     label: "Strong passwords",     desc: "Use 12+ characters with a mix of symbols and numbers." },
      { icon: <RefreshCw size={14} />,   label: "Single use link",      desc: "This reset link becomes invalid after you submit."    },
      { icon: <CircleCheck size={14} />, label: "Instant access",       desc: "Log in immediately with your new credentials."        },
      { icon: <ShieldCheck size={14} />, label: "Session invalidation", desc: "All previous sessions are revoked for safety."        },
    ],
    footer: (
      <p className="text-white/40 text-xs">
        Remember your password?{" "}
        <a href="/login" className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">
          Back to login
        </a>
      </p>
    ),
  },
};