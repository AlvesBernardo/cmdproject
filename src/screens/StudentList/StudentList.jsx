import React, { useEffect, useState } from "react";
import api from "../../helpers/AxiosInstance.js";
import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import CustomList from "../../components/CustomList/CustomList.jsx";

function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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


    const handleRemove = async (user_id) => {
        try {
            await api.delete(`/api/v1/students/${user_id}`);
            await fetchStudents();
            setError("");
        } catch (err) {
            console.error("Error removing student:", err);
            setError("Failed to remove the student. Please try again.");
        }
    };

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
                        <CustomList
                            list={students}
                            hasRemoveButton={true}
                            hasEditButton={false}
                            onRemove={handleRemove}
                        />
                    )}
                </div>
            </div>
        </div>
    );





}

export default StudentList;
