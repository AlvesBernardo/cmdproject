import { Navigate, Outlet } from "react-router-dom";
import TokenManager from "../helpers/TokenManager";

const StudentRoutes = () => {
    if (TokenManager.getUserRole() === 'false') {
        return <Outlet />
    } else {
        return <Navigate to="/" />
    }
};

export default StudentRoutes;
