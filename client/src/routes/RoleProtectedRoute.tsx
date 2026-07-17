import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
    children: React.ReactElement;
    allowedRoles: string[];
}

export default function RoleProtectedRoute({
    children,
    allowedRoles,
}: Props) {

    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        switch (user.role) {
            case "Citizen":
                return <Navigate to="/" replace />;

            case "Volunteer":
                return <Navigate to="/volunteer" replace />;

            case "Dispatcher":
                return <Navigate to="/dispatcher" replace />;

            case "Hospital":
                return <Navigate to="/hospital" replace />;

            default:
                return <Navigate to="/login" replace />;
        }
    }

    return children;
}