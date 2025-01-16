import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import CustomList from "../../components/CustomList/CustomList.jsx";
import React, {useEffect, useState} from "react";
import api from "../../helpers/AxiosInstance.js";

function AdminResults () {

    const [list, setList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await api.get("api/v1/results");
            if (response.data.data.length > 0) {
                setList(response.data.data);
            } else {
                setError("No Results found");
            }
        } catch (err) {
            console.error("Error fetching Results:", err);
            setError("Failed to fetch Results. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleRemove = async (id) => {
        try {
            await api.delete(`/api/v1/results/${id}`);
            await fetchResults();
            setError("");
        } catch (err) {
            console.error("Error removing results:", err);
            setError("Failed to remove the results. Please try again.");
        }
    };

    const handleEdit = async (id, updatedData) => {
        try {
            const data = {
                dtStudioName: updatedData.dtStudioName,
                dtStudioCapacity: updatedData.dtCapacity
            }
            await api.patch(`/api/v1/results/${id}`, data);
            await fetchResults()
            setError("");
        } catch (err) {
            console.error("Error editing results:", err);
            setError("Failed to edit the results. Please try again.");
        }
    };

    return (
        <div className="manageStudiosContainer p-6">
            <CustomHeader/>
            {loading ? (
                <p>Loading Results...</p>
            ) : error ? (
                <p className="text-red-500 mb-9">{error}</p>
            ) : (
                <div className="studioListContainer">
                    {/* Header Row */}
                    <div className="studioListHeader grid grid-cols-5 gap-4 font-bold mb-2">
                        <span>Name</span>
                        <span>Email</span>
                        <span>Accepted Studio</span>
                    </div>
                    {/* Custom List */}
                    <CustomList
                        list={list}
                        hasRemoveButton={true}
                        hasEditButton={true}
                        onRemove={handleRemove}
                        onEdit={handleEdit}
                    />
                </div>
            )}
        </div>
    )
}

export default AdminResults
