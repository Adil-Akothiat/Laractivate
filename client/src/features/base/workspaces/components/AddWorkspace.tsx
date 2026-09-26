import { Button, Input, Modal } from "@/components";
import { FormControl } from "@/components/FormControls";
import { UserRoundPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { useToastContext } from "@/app/hooks";
import { getErrorsMessagesStr } from "@/app/utils";
import { useWorkspacesMutations } from "../hooks/api/useWorkspaceMutations";

export const AddWorkspace = () => {
    const [isOpen, setIsOpened] = useState<boolean>(false);
    const [workSpaceName, setWorkSpaceName] = useState<string>("");
    const { mutate, isPending } = useWorkspacesMutations.create();
    const { toast } = useToastContext();


    const submitClientHandler = (e:FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
        mutate(workSpaceName, {
            onSuccess: (data)=> {
                toast.success(data.message || '');
            },
            onError: (err)=> {
                toast.error(getErrorsMessagesStr(err))
            },
            onSettled:()=> {
                setIsOpened(false);
                setWorkSpaceName('');
            }
        });
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                title="New workspace"
                onClose={() => setIsOpened(false)}
            >
                <form onSubmit={submitClientHandler}>
                    <FormControl>
                        <Input
                            label="Workspace Name"
                            id="work-space-name-id"
                            name="workspace"
                            value={workSpaceName}
                            onChange={(e) => setWorkSpaceName(e.target.value)}
                            autoFocus={true}
                        />
                    </FormControl>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            loading={isPending}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </Modal>
            <Button
                type="submit"
                variant="default"
                leftIcon={<UserRoundPlus size={16} />}
                onClick={() => setIsOpened(true)}
            >

            </Button>
        </div>
    );
}