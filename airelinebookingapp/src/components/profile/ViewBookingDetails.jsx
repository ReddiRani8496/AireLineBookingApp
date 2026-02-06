import React from "react";
import React, { useEffect, useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import { Link, useNavigate, useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";

function ViewBookingDetails() {
  const { id } = useParams();

  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
  const [booking, setBooking] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    fetchBookingDetails();
  },[id]);

  const fetchBookingDetails= async() {
    try {
     const response = await ApiService.getBookingById(id);
     setBooking(response.data);
    } catch (error) {
      showError("Failed to load booking details");
    } finally{
      setLoading(false)
    }
  }

    const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotalPrice = () => {
    if(!booking || !booking.flight) return 0;
    return booking.passengers.reduce((total,passenger)=> {
      let price = booking.flight.basePrice;
      if(passenger.type=='CHILD') {
        price = 0.75;
      } else if(passenger.type == 'INFANT') {
        price=0.1;
      }

      return total + price;
    },0);
  }

  return <div className="booking-details-container">
    <div className="booking-details-card">
      <ErrorDisplay />
      <SuccessDisplay />
      <h2 className="booking-details-title">Booking Details</h2>

      <div className="booking-details-summary">
        <div className="booking-details-flight-info">
          <div className="booking-details-flight-number">
            Flight: {booking.flight.flightNumber}
          </div>
          <div className="booking-details-route">
            <span className="booking-details-departure">{booking.flight.departureAirport.iataCode} - {booking.flight.arrivalAirport.iataCode}</span>
            <span className="booking-details-date">{booking.flight.departureTime}</span>
          </div>
        </div>

          <div className="booking-details-price">${calculateTotalPrice().toFixed(2)}</div>
      </div>


      <div className="booking-details-info-section">
        <div className="booking-details-info-card">
          <h3 className="booking-details-subtitle">Booking Information</h3>
          <div className="booking-details-info-row">
            <span className="booking-details-label">Reference Number:</span>
            <span className="booking-details-value">{booking.bookingReference}</span>
          </div>
           <div className="booking-details-info-row">
            <span className="booking-details-label">Booking Date:</span>
            <span className="booking-details-value">{booking.bookingDate}</span>
          </div>
           <div className="booking-details-info-row">
            <span className="booking-details-label">Status:</span>
            <span className="booking-details-value">{booking.status}</span>
          </div>
        </div>

        <div className="booking-detatils-flight-card">
          <h3>Flight Details</h3>
          <div className="booking-details-info-row">
            <span className="booking-details-label">Departure:</span>
            <span className="booking-details-value">{booking.flight.departureAirport?.name}({booking.flight.departureAirport?.iataCode})</span>
          </div>
          <div className="booking-details-info-row">
            <span className="booking-details-label">Departure Time:</span>
            <span className="booking-details-value">{formatDate(booking.flight.departureTime)}</span>
          </div>
          <div className="booking-details-info-row">
            <span className="booking-details-label">Arrival:</span>
            <span className="booking-details-value">{booking.flight.arrivalAirport?.name}({booking.flight.arrivalAirport?.iataCode})</span>
          </div>
          <div className="booking-details-info-row">
            <span className="booking-details-label">Arrival Time:</span>
            <span className="booking-details-value">{formatDate(booking.flight.arrivalTime)}</span>
          </div>
          <div className="booking-details-info-row">
            <span className="booking-details-label">Pilot:</span>
            <span className="booking-details-value">{booking.flight?.assignedPilot?.name}</span>
          </div>
        </div>

        <div className="booking-details-passengers-section"></div>
      </div>
    </div>
  </div>;
}

export default ViewBookingDetails;
