import { Button } from "@/components";
import { ChevronDown } from "lucide-react";
import { useTfaRecoveryContext } from "../model";

export default function TwoFactorRecoveryCodes({
  recoveryCodes
}: { recoveryCodes: string[] }) {
  const { setShowCodes, showCodes, copyAll, copyCode, copiedAll, copiedIndex, regenerateHandler, regenerateRecoveryCodes } = useTfaRecoveryContext();

  return (
    <div className="mt-2 space-y-3">
      {/* Action row */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setShowCodes((v) => !v)}
          variant="default"
          outline
          size="sm"
          leftIcon={
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${showCodes ? "rotate-180" : "rotate-0"
                }`}
            />
          }
        >
          {showCodes ? "Hide recovery codes" : "View recovery codes"}
        </Button>

        {/* Regenerate is destructive — warn with error variant */}
        <Button
          loading={regenerateRecoveryCodes.isPending}
          loadingText="Regenerating..."
          onClick={regenerateHandler}
          variant="primary"
          outline
          size="sm"
        >
          Regenerate
        </Button>
      </div>

      {/* Expanded codes panel */}
      {showCodes && (
        <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-base-content">Recovery Codes</p>
              <p className="text-xs text-base-content/60 mt-0.5">
                Each code can only be used once. Regenerating invalidates all previous codes.
              </p>
            </div>
            <Button size="xs" variant="primary" outline onClick={() => copyAll(recoveryCodes)}>
              {copiedAll ? "Copied!" : "Copy all"}
            </Button>
          </div>

          {/* Code grid */}
          <div className="grid grid-cols-2 gap-2">
            {recoveryCodes.map((code, index) => (
              <Button
                key={index}
                onClick={() => copyCode(code, index)}
                size="xs"
                variant="default"
                className="font-mono flex justify-between px-3 py-2"
              >
                <span>{code}</span>
                <span className="text-base-content/40">
                  {copiedIndex === index ? "✓" : "Copy"}
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}