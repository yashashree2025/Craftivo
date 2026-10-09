import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ role }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Role is required but user has different role
    if (role && user.role !== role) {
        if (user.role === "artisan") {
            return <Navigate to="/artisan/dashboard" replace />;
        }

        if (user.role === "customer") {
            return <Navigate to="/customer/dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;