import { Button } from "@/components";
import { useClearHistory } from "../api/clearHistory.api";

export function ClearSessionHistory() {
    const { mutate, isPending } = useClearHistory();
    return (
        <div className="flex justify-between">
            <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Recent Security Activity
            </h3>
            <Button
                outline
                size="xs"
                variant="default"
                className="text-gray-500"
                onClick={() => mutate()}
                loading={isPending}
            >
                Clear history
            </Button>
        </div>
    );
}