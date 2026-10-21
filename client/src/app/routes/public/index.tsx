import AuthRoutes from "./auth";
import OtherPublicRoutes from "./others";

export default function PublicRoutes() {
    return (
        <>
            {AuthRoutes()}
            {OtherPublicRoutes()}
        </>
    );
}