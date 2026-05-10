import type { ReactNode } from "react";
import {
  Layers,
} from "lucide-react";
import { VARIANT_CONFIG, type AuthBannerVariant } from "./config";

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  /**
   * Which auth page context to display.
   * Drives the default title, subtitle, features, and footer.
   * All of those can still be overridden individually.
   */
  variant:   AuthBannerVariant;
  title?:    string;
  subtitle?: string;
  footer?:   ReactNode;
}

export default function AuthBanner({ variant, title, subtitle, footer }: Props) {
  const cfg = VARIANT_CONFIG[variant];

  return (
    <div className="hidden md:flex flex-col w-2/5 min-h-screen bg-indigo-700 p-10 gap-10">

      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Layers size={14} color="white" strokeWidth={2.5} />
        </div>
        <span className="text-white font-medium text-sm tracking-wide">AuthPanel</span>
      </div>

      {/* Main copy */}
      <div>
        <p className="text-white text-2xl font-medium leading-snug mb-2">
          {title ?? cfg.title}
        </p>
        <p className="text-white/50 text-sm leading-relaxed">
          {subtitle ?? cfg.subtitle}
        </p>
      </div>

      {/* Feature list */}
      <div className="flex flex-col gap-4">
        {cfg.features.map((f) => (
          <div key={f.label} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white/70 mt-0.5">
              {f.icon}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{f.label}</p>
              <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Divider */}
      <div className="border-t border-white/10" />
      {/* Footer */}
      <div className="flex items-center gap-3">
        {footer ?? cfg.footer}
      </div>

    </div>
  );
}