import React, { useEffect, useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";
import "./AdminBookingDetailsPage.css";

function AdminBookingDetailsPage() {
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("CHECKED_IN");

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const response = await ApiService.getBookingById(id);
      setBooking(response.data);
      setSelectedStatus(response.data.status);
    } catch (error) {
      showError("Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      const response = await ApiService.updateBookingStatus(id, selectedStatus);
      if (response.statusCode == 200) {
        showSuccess("Booking status updated successfully");
        fetchBookingDetails();
      }
    } catch (error) {
      showError("Failed to update booking status");
    }
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="admin-booking-loading">Loading Booking Details......</div>
    );
  if (!booking)
    return <div className="admin-booking-error">Booking not Found</div>;

  return (
    <div className="admin-booking-container">
      <div className="admin-booking-card">
        <ErrorDisplay />
        <SuccessDisplay />
        <h2 className="admin-booking-title">Manage Booking</h2>

        <div className="admin-booking-summary">
          <div className="admin-booking-info">
            <div className="admin-booking-info-left">
              <div className="admin-booking-ref">
                Booking #:{booking.bookingReference}
              </div>
              <div
                className={`admin-booking-status ${booking.status.toLowerCase()}`}
              >
                Current Status: {booking.status}
              </div>
            </div>
            <div className="admin-flight-info">
              <div className="admin-flight-number">
                Flight: {booking.flight?.flightNumber}
              </div>
              <div className="admin-route">
                {booking.flight?.departureAirport?.iataCode}-{" "}
                {booking.flight.arrivalAirport.iataCode}
              </div>
              <div className="admin-date">
                {booking.flight
                  ? formatDate(booking.flight.departureTime)
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="admin-booking-details">
            <div className="admin-passenger-section">
              <h3>Passengers ({booking.passengers.length})</h3>
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="admin-passenger-card">
                  <div className="admin-passenger-header">
                    <h4>Passenger {index + 1}</h4>
                    <span className="admin-passenger-type">
                      {passenger.type}
                    </span>
                  </div>
                  <div className="admin-passenger-details">
                    <div className="admin-info-row">
                      <span className="admin-label">Name:</span>
                      <span className="admin-value">
                        {passenger.firstName} {passenger.lastName}
                      </span>
                    </div>
                    <div className="admin-info-row">
                      <span className="admin-label">Passport:</span>
                      <span className="admin-value">
                        {passenger.passportNumber}
                      </span>
                    </div>
                    <div className="admin-info-row">
                      <span className="admin-label">Seat:</span>
                      <span className="admin-value">
                        {passenger.seatNumber}
                      </span>
                    </div>
                    {passenger.specialRequests && (
                      <div className="admin-info-row">
                        <span className="admin-label">Special Requests:</span>
                        <span className="admin-value">
                          {passenger.specialRequests}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-booking-management">
              <h3>Update Booking Status</h3>
              <div className="admin-status-selector">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="admin-status-select"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="CHECKED_IN">CHECKED_IN</option>
                </select>
                <button
                  className="admin-update-button"
                  onClick={handleStatusChange}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>

          <div className="admin-booking-actions">
            <button
              onClick={() => navigate("/admin")}
              className="admin-back-button"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBookingDetailsPage;
