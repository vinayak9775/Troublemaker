import React from "react";
import Modal from "@mui/material/Modal";

const EventDetailsModal = ({ event, isOpen, onClose, fetchEvents }) => {
  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      fetchEvents();
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      {event && (
        <div>
          <h2>Event Details</h2>
          <p>Title: {event.title}</p>
          <p>Start Time: {event.start.toString()}</p>
          <p>End Time: {event.end.toString()}</p>
          <p>Availability Status: {event.availabilityStatus}</p>
          <button onClick={handleDeleteEvent}>Delete</button>
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </Modal>
  );
};

export default EventDetailsModal;
