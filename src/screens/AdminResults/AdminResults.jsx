import { useEffect, useState } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import Modal from "../../components/CustomModal/CustomModal.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import api from "../../helpers/AxiosInstance.js";

function AdminResults() {
    const [list, setList] = useState([]);

    const [selectedResult, setSelectedResult] = useState(null);
    const [editedData, setEditedData] = useState({
        dtStudioName: "",
        dtCapacity: ""
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await api.get("api/v1/booked-instances");
            if (response.data.data.length > 0) {
                setList(response.data.data);
                setError("");
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

    const handleOpenEditModal = (result) => {
        setSelectedResult(result);
        setEditedData({
            dtStudioName: result.dtStudioName || "",
            dtCapacity: result.dtStudioCapacity || ""
        });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedResult(null);
        setEditedData({
            dtStudioName: "",
            dtCapacity: ""
        });
    };

    const handleEdit = async (id, updatedData) => {
        try {
            const data = {
                dtStudioName: updatedData.dtStudioName,
                dtCapacity: updatedData.dtCapacity
            };
            await api.patch(`/api/v1/results/${id}`, data);
            await fetchResults();
            setError("");
            handleCloseEditModal();
        } catch (err) {
            console.error("Error editing results:", err);
            setError("Failed to edit the results. Please try again.");
        }
    };

    const handleOpenRemoveModal = (result) => {
        setSelectedResult(result);
        setIsRemoveModalOpen(true);
    };

    const handleCloseRemoveModal = () => {
        setIsRemoveModalOpen(false);
        setSelectedResult(null);
    };

    const handleRemove = async (id) => {
        try {
            await api.delete(`/api/v1/results/${id}`);
            await fetchResults();
            setError("");
            handleCloseRemoveModal();
        } catch (err) {
            console.error("Error removing results:", err);
            setError("Failed to remove the results. Please try again.");
        }
    };

    return (
        <div className="manageStudiosContainer p-6">
            <CustomHeader />
            {loading ? (
                <p>Loading Results...</p>
            ) : error ? (
                <p className="text-red-500 mb-9">{error}</p>
            ) : (
                <div className="studioListContainer">
                    <div className="studioListHeader grid grid-cols-5 gap-4 font-bold mb-2">
                        <span>Name</span>
                        <span>Email</span>
                        <span>Accepted Studio</span>
                    </div>

                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Studio Name</th>
                            <th scope="col">Capacity</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((result, index) => (
                            <tr key={result.idResult}>
                                <th scope="row">{index + 1}</th>
                                <td>{result.dtStudioName}</td>
                                <td>{result.dtCapacity}</td>
                                <td>
                                    <CustomButton
                                        color="warning"
                                        text="Edit"
                                        onClick={() => handleOpenEditModal(result)}
                                    />
                                </td>
                                <td>
                                    <CustomButton
                                        color="error"
                                        text="Remove"
                                        onClick={() => handleOpenRemoveModal(result)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onConfirm={() =>
                    handleEdit(selectedResult?.idResult, editedData)
                }
                title="Edit Result"
            >
                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="edit-studio-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Studio Name
                        </label>
                        <input
                            type="text"
                            id="edit-studio-name"
                            name="dtStudioName"
                            value={editedData.dtStudioName}
                            onChange={(e) =>
                                setEditedData({
                                    ...editedData,
                                    dtStudioName: e.target.value
                                })
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
                                    dtCapacity: e.target.value
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
                onConfirm={() => handleRemove(selectedResult?.idResult)}
                title="Confirm Deletion"
                message="Are you sure you want to remove this result?"
            />
        </div>
    );
}

export default AdminResults;
