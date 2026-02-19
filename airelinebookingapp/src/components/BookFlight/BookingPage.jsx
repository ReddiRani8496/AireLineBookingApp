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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="booking-page">
      <div className="booking-container">
        <ErrorDisplay />
        <SuccessDisplay />

        <h2 className="booking-title">Book Flight {flight.flightNumber}</h2>
        <div className="flight-summary">
          <div className="route">
            <span className="departure">
              {flight.departureAirport.iataCode} -{" "}
              {flight.arrivalAirport.iataCode}
            </span>
            <span className="date">
              {new Date(flight.departureTime).toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="times">
            <div className="departure-time">
              {new Date(flight.departureTime).toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="departure-time">
              {new Date(flight.arrivalTime).toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div className="price">
            Base Price: ${flight.basePrice.toFixed(2)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="passengers-section">
            <h3>Passenger Details</h3>

            {passengers.map((passenger, index) => (
              <div key={index} className="passenger-card">
                <div className="passenger-header">
                  <h4>Passenger {index + 1}</h4>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(index)}
                      className="remove-passenger"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="passenger-form">
                  <div className="form-group">
                    <label>First Name*</label>
                    <input
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "firstName",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name*</label>
                    <input
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) =>
                        handlePassengerChange(index, "lastName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Passport Number*</label>
                    <input
                      type="text"
                      value={passenger.passportNumber}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "passportNumber",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Passenger Type*</label>
                    <select
                      value={passenger.type}
                      onChange={(e) =>
                        handlePassengerChange(index, "type", e.target.value)
                      }
                    >
                      <option>Adult (12+ years)</option>
                      <option>Child (2-11 years)</option>
                      <option>Infant (0-23 months)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Seat Number*</label>
                    <select
                      value={passenger.type}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "seatNumber",
                          e.target.value,
                        )
                      }
                    >
                      <option>Select Seat</option>
                      {availableSeats.map((seat) => (
                        <option
                          key={`seat-${index}-${seat}`}
                          value={seat}
                          disabled={passengers.passportNumber(
                            (p) => p.seatNumber === seat,
                          )}
                        >
                          {seat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Special Requests</label>
                    <input
                      type="text"
                      value={passenger.specialRequests}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "specialRequests",
                          e.target.value,
                        )
                      }
                      placeholder="Dietary needs, assistance required etc.."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addPassenger}
                    className="add-passenger"
                  >
                    + Add Another Passenger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
