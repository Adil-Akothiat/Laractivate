import { LogSchema } from "@/features/shared";
import { useState } from "react";
import { parseDevice } from "../utils/parseDevice";
import { useGetEventConfig } from "./useGetEventConfig";

export const useActivityLogCard = (log: LogSchema) => {
    const [open, setOpen] = useState<boolean>(false);
    const config = useGetEventConfig(log.event);
    const device = parseDevice(log.properties);
    const isLocal =
        !log.properties?.city ||
        log.properties.city === "Local" ||
        log.properties.country === "Localhost";

    return {
        open,
        setOpen,
        config,
        device,
        isLocal
    }
}