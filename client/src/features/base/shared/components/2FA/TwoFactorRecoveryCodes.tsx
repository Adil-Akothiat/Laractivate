import { Button } from "@/components";
import { ArrowDownToDot } from "lucide-react";
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
    <div className="mt-2">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button 
          onClick={() => setShowCodes((v) => !v)}
          variant="default"
          outline
          size="sm"
          leftIcon={<ArrowDownToDot         className={`w-5 h-5 transition-transform duration-700 ${showCodes ? 'rotate-180' : 'rotate-0'}`} 
/>}
        >
          {showCodes ? "Hide recovery codes" : "View recovery codes"}
        </Button>

        <Button
          loading={isPending}
          loadingText="Regenerating..."
          onClick={regenerate}
          variant="default"
          outline
          size="sm"
        >
          Regenerate
        </Button>
      </div>

      {showCodes && (
        <div className="mt-3" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontWeight: 600 }}>Recovery Codes</p>
            <Button size="xs" variant="primary" outline onClick={copyAll}>
              {copiedAll ? "Copied!" : "Copy all"}
            </Button>
          </div>
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
            Each code can only be used once. Regenerating invalidates all
            previous codes.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
              marginTop: 12,
            }}
          >
            {recoveryCodes.map((code, index) => (
              <Button
                key={index}
                onClick={() => copyCode(code, index)}
                size="xs"
                variant="default"
                style={{
                  fontFamily: "monospace",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 8,
                }}
              >
                <span>{code}</span>
                <span>{copiedIndex === index ? "✓" : "Copy"}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}