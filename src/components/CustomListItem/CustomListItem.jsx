import React, { useState } from "react";
import CustomButton from "../CustomButton/CustomButton.jsx";
import Modal from "../CustomModal/CustomModal.jsx";

const CustomListItem = ({ item, hasEditButton, hasRemoveButton, onRemove, onEdit, onToggleOpenClose }) => {
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedData, setEditedData] = useState({ ...item });

    const handleOpenRemoveModal = () => setIsRemoveModalOpen(true);
    const handleCloseRemoveModal = () => setIsRemoveModalOpen(false);
    const handleConfirmRemove = () => {
        onRemove(item.idStudio);
        handleCloseRemoveModal();
    };

    const handleOpenEditModal = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleConfirmEdit = () => {
        onEdit(item.idStudio, editedData);
        handleCloseEditModal();
    };

    const handleToggle = () => onToggleOpenClose(item);

    return (
        <div className="customListItemContainer flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="dataContainer flex-1">
                <p className="dataItem">
                    <span className="font-semibold">Name: </span>
                    {item.dtStudioName}
                </p>
                <p className="dataItem">
                    <span className="font-semibold">Capacity: </span>
                    {item.dtStudioCapacity}
                </p>
                <p className="dataItem">
                    <span className="font-semibold">Status: </span>
                    {item.dtIsBookable ? "Open" : "Closed"}
                </p>
            </div>
            <div className="customListItemButtonContainer flex space-x-2">
                <CustomButton
                    color={item.dtIsBookable ? "error" : "primary"}
                    text={item.dtIsBookable ? "Close" : "Open"}
                    onClick={handleToggle}
                />
                {hasEditButton && (
                    <CustomButton
                        color="warning"
                        text="Edit"
                        onClick={handleOpenEditModal}
                    />
                )}
                {hasRemoveButton && (
                    <CustomButton
                        color="error"
                        text="Remove"
                        onClick={handleOpenRemoveModal}
                    />
                )}
            </div>

            <Modal
                isOpen={isRemoveModalOpen}
                onClose={handleCloseRemoveModal}
                onConfirm={handleConfirmRemove}
                title="Confirm Deletion"
                message="Are you sure you want to delete this studio?"
            />

            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onConfirm={handleConfirmEdit}
                title="Edit Studio"
            >
                <form className="space-y-4">
                    <div>
                        <label htmlFor={`name-${item.idStudio}`} className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id={`name-${item.idStudio}`}
                            name="dtStudioName"
                            value={editedData.dtStudioName}
                            onChange={(e) => setEditedData({ ...editedData, dtStudioName: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor={`capacity-${item.idStudio}`} className="block text-sm font-medium text-gray-700">
                            Capacity
                        </label>
                        <input
                            type="number"
                            id={`capacity-${item.idStudio}`}
                            name="dtStudioCapacity"
                            value={editedData.dtStudioCapacity}
                            onChange={(e) => setEditedData({ ...editedData, dtStudioCapacity: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CustomListItem;
