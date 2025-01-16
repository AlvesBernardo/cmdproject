import React from "react";
import CustomButton from "../CustomButton/CustomButton.jsx";

const Modal = ({ isOpen, onClose, onConfirm, title, message, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>

            <div className="bg-white rounded-lg shadow-lg z-10 max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <CustomButton onClick={onClose} width={"20px"}>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </CustomButton>
                </div>
                <div className="mb-4">
                    {message && <p className="text-gray-600">{message}</p>}
                    {children}
                </div>
                <div className="flex justify-end gap-4">
                    {onClose && (
                        <CustomButton onClick={onClose} text={"Cancel"}/>
                    )}
                    {onConfirm && (
                        <CustomButton onClick={onConfirm} text={"Confirm"} color={"error"}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
