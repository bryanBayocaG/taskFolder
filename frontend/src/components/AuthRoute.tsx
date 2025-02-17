import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store";

interface AuthRouteProps {
    element: JSX.Element;
}

const AuthRoute = ({ element }: AuthRouteProps) => {
    const currentAuth = useAuthStore((state) => state.currentAuth);

    return currentAuth ? <Navigate to="/mytask" replace /> : element;
};

export default AuthRoute;
