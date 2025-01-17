import React, { useEffect, useState } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import Modal from "../../components/CustomModal/CustomModal.jsx";
import api from "../../helpers/AxiosInstance.js";
import { id } from "date-fns/locale";

function Events() {
    const [list, setList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [isActivationModalOpen, setIsActivationModalOpen] = useState(false); // Activation confirmation modal
    const [activatedEvent, setActivatedEvent] = useState(null); // Track activated event
    const [newEventName, setNewEventName] = useState("");
    const [newEventStartDate, setNewEventStartDate] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await api.get("api/v1/events");
            console.log("Fetched events:", response.data.data);
            setList(response.data.data);
            setError("");
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to fetch events. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewEventName("");
        setNewEventStartDate("");
    };

    const handleConfirmAdd = async () => {
        if (newEventName.trim() === "" || newEventStartDate.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const newEvent = {
                event_name: newEventName,
                start_date: newEventStartDate,
            };
            await api.post("/api/v1/events/", newEvent);
            setError("");
            await fetchEvents();
            handleCloseAddModal();
        } catch (err) {
            console.error("Error adding event:", err);
            setError("Failed to add the event. Please try again.");
        }
    };

    const handleOpenRemoveModal = (event) => {
        setSelectedEvent(event);
        setIsRemoveModalOpen(true);
    };

    const handleCloseRemoveModal = () => {
        setIsRemoveModalOpen(false);
        setSelectedEvent(null);
    };

    const handleRemove = async (idEvent) => {
        try {
            await api.delete(`/api/v1/events/${idEvent}`);
            await fetchEvents();
            setError("");
            handleCloseRemoveModal();
        } catch (err) {
            console.error("Error removing event:", err);
            setError("Failed to remove the event. Please try again.");
        }
    };

    const handleStartSignup = async (event) => {
        try {
            await api.post(`/activate-route`, { event_id: event.idEvent });
            setActivatedEvent(event); 
            setIsActivationModalOpen(true);
            setError("");
        } catch (err) {
            console.error("Error activating event:", err);
            setError("Failed to activate the event. Please try again.");
        }
    };

    const handleRunAlgorithm = async (idEvent) => {
        try {
            await api.post(`/api/v1/distribute-students/${idEvent}`);
            setError("");
        } catch (err) {
            console.error("Error running algorithm:", err);
            setError("Failed to run the algorithm. Please try again.");
        }
    };

    const handleCloseActivationModal = () => {
        setIsActivationModalOpen(false);
        setActivatedEvent(null);
    };

    return (
        <div className="eventsContainer">
            <CustomHeader />
            <div className="eventsButtonContainer my-4">
                <CustomButton
                    color="primary"
                    text="Add new event"
                    width="200px"
                    onClick={handleOpenAddModal}
                />
            </div>

            {loading ? (
                <p>Loading events...</p>
            ) : error ? (
                <p className="text-red-500 mb-9">{error}</p>
            ) : (
                <div className={"listTableContainer"}>
                    <table className="listTable table">
                        <thead className={"listHeader"}>
                            <tr className={"listItem"}>
                                <th scope="col" className="w-40">Name</th>
                                <th scope="col" className="w-10">Start Date</th>
                                <th scope="col" className="w-10">End Date</th>
                                <th scope="col" className="text-center w-20">Sign up</th>
                                <th scope="col" className="text-center w-20">Sort students</th>
                                <th scope="col" className="text-center w-20">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((event) => (
                                <tr key={event.idEvent}>
                                    <th scope="row">{event.dtEventName}</th>
                                    <td scope="row">{new Date(event.dtStartDate).toLocaleDateString()}</td>
                                    <td scope="row">{new Date(event.dtEndDate).toLocaleDateString()}</td>
                                    <td>
                                        <CustomButton
                                            color="primary"
                                            text="Start sign up"
                                            onClick={() => handleStartSignup(event)}
                                        />
                                    </td>
                                    <td>
                                    <CustomButton
                                        color="secondary"
                                        text="Run"
                                        onClick={() => handleRunAlgorithm(parseInt(event.idEvent, 10))}
                                    />

                                    </td>
                                    <td>
                                        <CustomButton
                                            color="error"
                                            text="Remove"
                                            onClick={() => handleOpenRemoveModal(event.idEvent)}
                                        />
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
                title="Add New Event"
            >
                <form className="space-y-4">
                    <div>
                        <label htmlFor="new-event-name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="new-event-name"
                            value={newEventName}
                            onChange={(e) => setNewEventName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="new-event-start-date" className="block text-sm font-medium text-gray-700">
                            Start date
                        </label>
                        <input
                            type="date"
                            id="new-event-start-date"
                            value={newEventStartDate}
                            onChange={(e) => setNewEventStartDate(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isRemoveModalOpen}
                onClose={handleCloseRemoveModal}
                onConfirm={() => handleRemove(selectedEvent?.idEvent)}
                title="Confirm Deletion"
                message="Are you sure you want to delete this event?"
            />

            <Modal
                isOpen={isActivationModalOpen}
                onClose={handleCloseActivationModal}
                title="Event Activated"
                message={`The event "${activatedEvent?.dtEventName}" has been successfully activated.`}
            />
        </div>
    );
}

export default Events;
