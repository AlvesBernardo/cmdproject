import CustomList from "../../components/CustomList/CustomList.jsx";
import React, { useEffect, useState } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import Modal from "../../components/CustomModal/CustomModal.jsx";
import api from "../../helpers/AxiosInstance.js";

function ManageStudios() {
    const [list, setList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newStudioName, setNewStudioName] = useState("");
    const [newStudioCapacity, setNewStudioCapacity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchStudios = async () => {
        setLoading(true);
        try {
            const response = await api.get("api/v1/studios");
            console.log("Fetched studios:", response.data.data);
            setList(response.data.data);
            setError("");
        } catch (err) {
            console.error("Error fetching studios:", err);
            setError("Failed to fetch studios. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudios();
    }, []);

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewStudioName("");
        setNewStudioCapacity("");
    };

    const handleConfirmAdd = async () => {
        if (newStudioName.trim() === "" || newStudioCapacity.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const newStudio = {
                dtStudioName: newStudioName,
                dtStudioCapacity: newStudioCapacity
            };
            await api.post("/api/v1/studios/", newStudio);
            setError("");
            await fetchStudios();
            handleCloseAddModal();
        } catch (err) {
            console.error("Error adding studio:", err);
            setError("Failed to add the studio. Please try again.");
        }
    };

    const handleRemove = async (id) => {
        try {
            await api.delete(`/api/v1/studios/${id}`);
            await fetchStudios();
            setError("");
        } catch (err) {
            console.error("Error removing studio:", err);
            setError("Failed to remove the studio. Please try again.");
        }
    };

    const handleEdit = async (id, updatedData) => {
        try {
            const data = {
                dtStudioName: updatedData.dtStudioName,
                dtStudioCapacity: updatedData.dtStudioCapacity
            };
            await api.patch(`/api/v1/studios/${id}`, data);
            await fetchStudios();
            setError("");
        } catch (err) {
            console.error("Error editing studio:", err);
            setError("Failed to edit the studio. Please try again.");
        }
    };

    const handleToggleOpenClose = async (studio) => {
        try {
            const updatedStatus = !studio.dtIsBookable;
            console.log("Toggling status for studio:", studio);
            await api.put(`/api/v1/studios/open_close/${studio.idStudio}`, {
                dtIsBookable: updatedStatus
            });
            await fetchStudios();
        } catch (err) {
            console.error("Error toggling open/close status:", err);
            setError("Failed to toggle the studio status. Please try again.");
        }
    };

    return (
        <div className="manageStudiosContainer p-6">
            <CustomHeader/>
            <div className="manageStudiosButtonContainer">
                <CustomButton
                    color="primary"
                    text="Add new studio"
                    width="200px"
                    onClick={handleOpenAddModal}
                />
            </div>
            {loading ? (
                <p>Loading studios...</p>
            ) : error ? (
                <p className="text-red-500 mb-9">{error}</p>
            ) : (
                <CustomList
                    list={list}
                    hasRemoveButton={true}
                    hasEditButton={true}
                    onRemove={handleRemove}
                    onEdit={handleEdit}
                    onToggleOpenClose={handleToggleOpenClose}
                />
            )}

            <Modal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onConfirm={handleConfirmAdd}
                title="Add New Studio"
            >
                <form className="space-y-4">
                    <div>
                        <label htmlFor="new-studio-name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="new-studio-name"
                            value={newStudioName}
                            onChange={(e) => setNewStudioName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="new-studio-capacity" className="block text-sm font-medium text-gray-700">
                            Capacity
                        </label>
                        <input
                            type="number"
                            id="new-studio-capacity"
                            value={newStudioCapacity}
                            onChange={(e) => setNewStudioCapacity(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default ManageStudios;
