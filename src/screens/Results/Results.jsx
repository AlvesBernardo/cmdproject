import React, { useEffect, useState } from "react";
import CustomList from "../../components/CustomList/CustomList.jsx";
import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import Modal from "../../components/CustomModal/CustomModal.jsx";
import axios from "axios";
import "../../css/screens/_results.scss";


function ManageStudios() {
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("2023-2024 Semester one");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudiosFromJSON = async () => {
            setLoading(true);
            try {
                const response = await fetch("/admin_student_results.json");
                if (!response.ok) {
                    throw new Error("Failed to load JSON file");
                }
                const data = await response.json();

                const sortedData = sortArray(data.filter((item) => item.semester === selectedSemester), "name", "asc");
                setList(data);
                setFilteredList(sortedData);
            } catch (err) {
                console.error("Error fetching studios:", err);
                setError("Failed to load student results. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudiosFromJSON();
    }, []);

    const sortArray = (array, key, direction) => {
        return [...array].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
    };

    const handleSemesterChange = (event) => {
        const semester = event.target.value;
        setSelectedSemester(semester);

        const updatedList = list.filter((item) => item.semester === semester);
        const sortedList = sortArray(updatedList, sortConfig.key, sortConfig.direction);
        setFilteredList(sortedList);
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        const sortedList = sortArray(filteredList, key, direction);
        setSortConfig({ key, direction });
        setFilteredList(sortedList);
    };

    return (
        <div className="manageStudiosContainer p-6">
            <CustomHeader/>

            <div className="dropdown-container">
                <select
                    id="semester-select"
                    value={selectedSemester}
                    onChange={handleSemesterChange}
                    className="dropdown-select"
                >
                    <option value="2023-2024 Semester one">2023-2024 Semester one</option>
                    <option value="2023-2024 Semester two">2023-2024 Semester two</option>
                    <option value="2024-2025 Semester one">2024-2025 Semester one</option>
                </select>
            </div>

            {loading ? (
                <p>Loading studios...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <div className="results-header">
                        <div className="header-item">
                            <span onClick={() => handleSort("name")}>
                                Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                            </span>
                        </div>
                        <div className="header-item">
                            <span onClick={() => handleSort("email")}>
                                Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                            </span>
                        </div>
                        <div className="header-item">
                            <span onClick={() => handleSort("studio")}>
                                Accepted Studio {sortConfig.key === "studio" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                            </span>
                        </div>
                    </div>

                    <CustomList
                        list={filteredList}
                        hasRemoveButton={true}
                        hasEditButton={true}
                    />
                </>
            )}
        </div>
    );
}

export default ManageStudios;
