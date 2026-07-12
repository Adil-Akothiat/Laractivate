import { Button } from "@/components";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type TFRCProps = {
  recoveryCodes: string[];
  isPending: boolean;
  regenerate: () => void;
};

export default function TwoFactorRecoveryCodes({
  recoveryCodes,
  isPending,
  regenerate,
}: TFRCProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

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
              className={`w-4 h-4 transition-transform duration-300 ${
                showCodes ? "rotate-180" : "rotate-0"
              }`}
            />
          }
        >
          {showCodes ? "Hide recovery codes" : "View recovery codes"}
        </Button>

        {/* Regenerate is destructive — warn with error variant */}
        <Button
          loading={isPending}
          loadingText="Regenerating..."
          onClick={regenerate}
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
            <Button size="xs" variant="primary" outline onClick={copyAll}>
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