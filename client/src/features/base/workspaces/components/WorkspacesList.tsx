import { Select } from "@/components";
import { WorkspaceSchema } from "../types";
import { useWorkspacesMutations } from "../hooks/api/useWorkspaceMutations";

type WorkspacesListProps = {
    workspaces: WorkspaceSchema[],
    currentClientId: number | null
}
export const WorkspacesList = ({ workspaces, currentClientId }: WorkspacesListProps) => {

    const { mutate, isPending } = useWorkspacesMutations.switch();
    const currentClient = workspaces.find((c) => c.id === currentClientId) || workspaces[0];
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        if (selectedId !== currentClient?.id) {
            mutate(selectedId);
        }
    };
    const options = workspaces.map(c => ({ value: c.id, label: c.slug }));
    return (
        <Select
            options={options}
            value={currentClient.id}
            disabled={isPending}
            onChange={handleSelect}
        />
    );

}