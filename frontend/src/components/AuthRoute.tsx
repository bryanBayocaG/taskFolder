import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store";

interface AuthRouteProps {
    element: JSX.Element;
}

const AuthRoute = ({ element }: AuthRouteProps) => {
    const currentAuth = useAuthStore((state) => state.currentAuth);
    const currentAuthUID = useAuthStore((state) => state.currentAuthId)
    return currentAuth ? <Navigate to={`/mytask/${currentAuthUID}`} replace /> : element;
};

export default AuthRoute;
