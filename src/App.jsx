import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./screens/SignIn/SignIn.jsx";
import SignUp from "./screens/SignUp/SignUp.jsx";
import ProtectedRoute from "./helpers/ProtectedRoute.jsx";
import StudentResults from "./screens/StudentResults/StudentResults.jsx";
import StudentDashboard from "./screens/Dashboard/StudentDashboard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./screens/Dashboard/AdminDashboard.jsx";
import Questionnaire from "./screens/Questionnaire/Questionnaire.jsx";
import ManageStudios from "./screens/ManageStudios/ManageStudios.jsx";
import StudentList from "./screens/StudentList/StudentList.jsx";
import AdminRoutes from "./helpers/AdminRoutes.jsx";
import StudentRoutes from "./helpers/StudentRoutes.jsx";
import AdminResults from "./screens/AdminResults/AdminResults.jsx";

function App() {
    return (
        <BrowserRouter basename="/cmdproject"> {/* Set the basename here */}
            <ToastContainer />
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminRoutes />}>
                        <Route path="/adminDashboard" element={<AdminDashboard />} />
                        <Route path="/manageStudios" element={<ManageStudios />} />
                        <Route path="/studentList" element={<StudentList />} />
                        <Route path="/adminResults" element={<AdminResults />} />
                    </Route>
                    <Route element={<StudentRoutes />}>
                        <Route path="/studentDashboard" element={<StudentDashboard />} />
                        <Route path="/questionnaire" element={<Questionnaire />} />
                        <Route path="/studentresults" element={<StudentResults />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
