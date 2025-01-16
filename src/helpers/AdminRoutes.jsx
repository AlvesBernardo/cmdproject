import { Navigate, Outlet } from "react-router-dom";
import TokenManager from "../helpers/TokenManager";

const AdminRoutes = () => {
    if (TokenManager.getUserRole() === 'true') {
        return <Outlet />
    } else {
        return <Navigate to="/" />
    }
};

export default AdminRoutes;
