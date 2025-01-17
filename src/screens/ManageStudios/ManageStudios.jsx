import { useEffect, useState } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import Modal from "../../components/CustomModal/CustomModal.jsx";
import api from "../../helpers/AxiosInstance.js";

function ManageStudios() {
    const [list, setList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [newStudioName, setNewStudioName] = useState("");
    const [newCapacity, setNewCapacity] = useState("");

    const [editedData, setEditedData] = useState({
        dtStudioName: "",
        dtCapacity: "",
    });

    const [selectedStudio, setSelectedStudio] = useState(null);

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
        setNewCapacity("");
    };

    const handleConfirmAdd = async () => {
        if (newStudioName.trim() === "" || newCapacity.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const newStudio = {
                dtStudioName: newStudioName,
                dtCapacity: newCapacity,
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

    const handleOpenRemoveModal = (studio) => {
        setSelectedStudio(studio);
        setIsRemoveModalOpen(true);
    };

    const handleCloseRemoveModal = () => {
        setIsRemoveModalOpen(false);
        setSelectedStudio(null);
    };

    const handleRemove = async (id) => {
        try {
            await api.delete(`/api/v1/studios/${id}`);
            await fetchStudios();
            setError("");
            handleCloseRemoveModal();
        } catch (err) {
            console.error("Error removing studio:", err);
            setError("Failed to remove the studio. Please try again.");
        }
    };


    const handleOpenEditModal = (studio) => {
        setSelectedStudio(studio);
        setEditedData({
            dtStudioName: studio.dtStudioName,
            dtCapacity: studio.dtCapacity,
        });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedStudio(null);
        setEditedData({
            dtStudioName: "",
            dtCapacity: "",
        });
    };

    const handleEdit = async (id, updatedData) => {
        try {
            const data = {
                dtStudioName: updatedData.dtStudioName,
                dtCapacity: updatedData.dtCapacity,
            };
            await api.patch(`/api/v1/studios/${id}`, data);
            await fetchStudios();
            setError("");
            handleCloseEditModal();
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
                dtIsBookable: updatedStatus,
            });
            await fetchStudios();
        } catch (err) {
            console.error("Error toggling open/close status:", err);
            setError("Failed to toggle the studio status. Please try again.");
        }
    };

    return (
        <div className="manageStudiosContainer p-6">
            <CustomHeader />
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
                <div className={"listTableContainer w-100 px-5"}>
                    <table className="listTable table rounded-lg overflow-hidden">
                        <thead className={"listHeader "}>
                        <tr className={"listItem"}>
                            <th scope="col" className="w-60">Name</th>
                            <th scope="col" className="text-center w-20">Capacity</th>
                            <th scope="col" className="text-center w-20">Open/Close</th>
                            <th scope="col" className="text-center w-20">Edit</th>
                            <th scope="col" className="text-center w-20">Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((studio) => (
                            <tr key={studio.idStudio}>
                                <th scope="row">{studio.dtStudioName}</th>
                                <td className="text-center align-middle">{studio.dtCapacity}</td>
                                <td className="text-center align-middle">
                                    <div className="flex justify-center items-center h-full">
                                        <CustomButton
                                            color="primary"
                                            text={studio.dtIsBookable ? "Close" : "Open"} // Dynamically sets the button text
                                            onClick={() => handleToggleOpenClose(studio)}
                                            width="7em"
                                        />
                                    </div>
                                </td>

                                <td className="text-center align-middle">
                                    <div className="flex justify-center items-center h-full">
                                        <CustomButton
                                            color="warning"
                                            text="Edit"
                                            onClick={() => handleOpenEditModal(studio)}
                                            width="7em"
                                        />
                                    </div>
                                </td>
                                <td className="text-center align-middle">
                                    <div className="flex justify-center items-center h-full">
                                        <CustomButton
                                            color="error"
                                            text="Remove"
                                            onClick={() => handleOpenRemoveModal(studio)}
                                            width="7em"
                                        />
                                    </div>
                                </td>


                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onConfirm={handleConfirmAdd}
                title="Add New Studio"
            >
                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="new-studio-name"
                            className="block text-sm font-medium text-gray-700"
                        >
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
                        <label
                            htmlFor="new-studio-capacity"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Capacity
                        </label>
                        <input
                            type="number"
                            id="new-studio-capacity"
                            value={newCapacity}
                            onChange={(e) => setNewCapacity(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </form>
            </Modal>


            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onConfirm={() => handleEdit(selectedStudio?.idStudio, editedData)}
                title="Edit Studio"
            >
                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="edit-studio-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="edit-studio-name"
                            name="dtStudioName"
                            value={editedData.dtStudioName}
                            onChange={(e) =>
                                setEditedData({ ...editedData, dtStudioName: e.target.value })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="edit-studio-capacity"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Capacity
                        </label>
                        <input
                            type="number"
                            id="edit-studio-capacity"
                            name="dtCapacity"
                            value={editedData.dtCapacity}
                            onChange={(e) =>
                                setEditedData({
                                    ...editedData,
                                    dtCapacity: e.target.value,
                                })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isRemoveModalOpen}
                onClose={handleCloseRemoveModal}
                onConfirm={() => handleRemove(selectedStudio?.idStudio)}
                title="Confirm Deletion"
                message="Are you sure you want to delete this studio?"
            />
        </div>
    );
}

export default ManageStudios;
