import { AddWorkspace } from "./AddWorkspace";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export const WorkspacesManager = () => {
    return (
        <div className='flex items-center gap-2'>
            <WorkspaceSwitcher />
            <AddWorkspace />
        </div>
    );
}