import React, { useEffect, useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";

function BookingPage() {
  const { id: flightId } = useParams();
  const { state } = useLocation();
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
  const navigate = useNavigate();

  const [flight, setFlight] = useState({});
  const [loading, setLoading] = useState(true);

  const [availableSeats, setAvailableSeats] = useState([]);
  const [passengers, setPassengers] = useState({
    firstName: "",
    lastName: "",
    passportNumber: "",
    type: "ADULT",
    seatNumber: "",
    specialRequests: "",
  });

  useEffect(() => {
    if (state?.flight) {
      setFlight(state.flight);
      setLoading(false);
      generatedAvailableSeats(state.flight);
    } else {
      fetchFlightDetails();
    }
  }, [flightId]);

  const fetchFlightDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiService.findFlightById(flightId);
      setFlight(response.data);
      generatedAvailableSeats(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generatedAvailableSeats = (flightData) => {
    const seats = [];
    for (let i = 1; i <= 20; i++) {
      for (let j = 0; j <= 4; j++) {
        const seatLetter = String.fromCharCode(65 + j);
        seats.push(`${i}${seatLetter}`);
      }
    }

    setAvailableSeats(seats);
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      {
        firstName: "",
        lastName: "",
        passportNumber: "",
        type: "ADULT",
        seatNumber: "",
        specialRequests: "",
      },
    ]);
  };

  const removePassenger = (index) => {
    if (passengers.length <= 1) return;

    const updatedPassengers = [...passengers];
    updatedPassengers.splice(index, 1);
    setPassengers(updatedPassengers);
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const calculateTotalPrice = () => {
    if (!flight) return 0;
    return passengers.reduce((total, passenger) => {
      let price = flight.basePrice;
      if (passenger.type === "CHILD") {
        price *= 0.75;
      } else if (passenger.type === "INFANT") {
        price *= 0.1;
      }

      return total + price;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName || !p.passportNumber || !p.seatNumber) {
        showError("please fill all required fields for passenger");
        return;
      }

      try {
        const bookingData = {
          flightId: parseInt(flightId),
          passengers: passengers,
        };

        const response = await ApiService.createBooking(bookingData);

        if (response.statusCode == 200) {
          showSuccess("Flight Booked SuccessFully");
          navigate("/profile");
        }
      } catch (error) {
        showError("Failed to book flight");
      }
    }
  };

  return <div>BookingPage</div>;
}

export default BookingPage;
