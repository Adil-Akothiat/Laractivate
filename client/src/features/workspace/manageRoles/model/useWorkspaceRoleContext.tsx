import { createContext, ReactNode, useContext } from "react";
import { WorkspaceRoleContextProps } from "./manageRoles.types";
import { useFilterRoles } from "./useFilterRoles";
import { useManageRoles } from "./useManageRoles";

const WorkspaceRoleContext = createContext<WorkspaceRoleContextProps | null>(null);

export function WorkspaceRoleContextProvider({ children }: { children: ReactNode }) {
    const { filterQueries } = useFilterRoles();
    const manageRoleStates = useManageRoles();

    return (
        <WorkspaceRoleContext.Provider
            value={{
                filterQueries,
                manageRoleStates
            }}
        >
            {children}
        </WorkspaceRoleContext.Provider>
    );
}

export function useWorkspaceRoleContext() {
    const context = useContext(WorkspaceRoleContext);
    if (!context) {
        throw new Error("useTfaStepperContext must be used within a TfaStepperContextProvider");
    }
    return context;
}