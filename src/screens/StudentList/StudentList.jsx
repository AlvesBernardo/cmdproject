import { useEffect, useState } from "react";
import api from "../../helpers/AxiosInstance.js";
import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import Modal from "../../components/CustomModal/CustomModal.jsx";

function StudentList() {
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleOpenRemoveModal = () => setIsRemoveModalOpen(true);
    const handleCloseRemoveModal = () => setIsRemoveModalOpen(false);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/students");
            setStudents(response.data.data);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Failed to fetch students. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleRemove = async (idUser) => {
        try {
            await api.delete(`/api/v1/students/${idUser}`);
            await fetchStudents();
            setError("");
            handleCloseRemoveModal();
        } catch (err) {
            console.error("Error removing student:", err);
            setError("Failed to remove the student. Please try again.");
            handleCloseRemoveModal();
        }
    };

    console.log(students)
    return (
        <div className="manageStudentsContainer min-h-screen w-full">
            <CustomHeader/>

            <div className="overflow-x-auto mt-6">

                <div className="bg-white rounded-b-md">
                    {loading ? (
                        <p className="p-4">Loading students...</p>
                    ) : error ? (
                        <p className="text-red-500 p-4">{error}</p>
                    ) : (
                        <div className={"listTableContainer w-100 px-5"}>
                            <table className="listTable table rounded-lg overflow-hidden">
                                <thead className={"listHeader"}>
                                <tr className={"listItem"}>
                                    <th scope="col">Email</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Student number</th>
                                    <th scope="col">Year</th>
                                    <th scope="col" className="text-center">Remove</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.idUser}>
                                            <th scope="row">{student.dtEmail}</th>
                                            <td>{student.dtFullName}</td>
                                            <td>{student.dtStudentNumber}</td>
                                            <td>{student.dtStudentYear}</td>
                                            <td>
                                                <CustomButton
                                                color="error"
                                                text="Remove"
                                                onClick={handleOpenRemoveModal}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isRemoveModalOpen}
                onClose={handleCloseRemoveModal}
                onConfirm={handleRemove}
                title="Confirm Deletion"
                message="Are you sure you want to delete this studio?"
            />
        </div>
    );


}

export default StudentList;
