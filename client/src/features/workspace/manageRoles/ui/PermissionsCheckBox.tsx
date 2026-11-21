import { Checkbox } from "@/components";
import { GroupedPermissionsSchema } from "@/entities";
import { memo } from "react";
interface PermissionsCheckboxProps {
    groupedPermissions: GroupedPermissionsSchema[];
    attachedPermissions: string[];
    permissionsLength: number;
    onAttachAll: () => void;
    onAttach: (id: string) => void;
};

export const PermissionsCheckbox = memo(function ({ groupedPermissions, attachedPermissions, permissionsLength, onAttachAll, onAttach }: PermissionsCheckboxProps) {
    return (
        <div>
            <div className="border border-base-200 rounded-xl divide-y divide-base-200 max-h-72 overflow-y-auto">
                <Checkbox
                    label="Check all"
                    name="check-all-permissions"
                    id="check-all-permissions"
                    className="mb-1"
                    onChange={onAttachAll}
                    checked={attachedPermissions.length === permissionsLength}
                />
                {
                    groupedPermissions.map(({ group, permissions }, j) => {
                        return (
                            <div key={j} className="mb-3">
                                <h4>{group}</h4>
                                {
                                    permissions.map(({ name, id }, i) => (
                                        <Checkbox
                                            key={`${j}-${i}`}
                                            label={name}
                                            name={name}
                                            id={name}
                                            className="mb-1"
                                            onChange={() => onAttach(id)}
                                            checked={attachedPermissions.includes(id)}
                                        />
                                    ))
                                }
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
})