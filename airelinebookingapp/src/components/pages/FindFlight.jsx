import React, { useState, useEffect } from "react";
import { useMessage } from "../common/MessageDisplay";
import "./FindFlight.css";
import ApiService from "../../services/ApiService";
import { Link, useLocation, useNavigate } from "react-router-dom";

function FindFlight() {
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [searchData, setSearchData] = useState({
    departureIataCode: "",
    arrivalIataCode: "",
    departureDate: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAirports = async () => {
      try {
        console.log("inside try block");
        const response = await ApiService.getAllAirports();
        setAirports(response.data || []);
      } catch (error) {
        showError("Failed to fetch airports");
      }
    };

    fetchAllAirports();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log("params", params);
    console.log("departureIataCode", params.get("departureIataCode"));
    console.log("arrivalIataCode", params.get("arrivalIataCode"));
    console.log("departureDate", params.get("departureDate"));
    const initialParams = {
      departureIataCode: params.get("departureIataCode") || "",
      arrivalIataCode: params.get("arrivalIataCode") || "",
      departureDate: params.get("departureDate") || "",
    };

    setSearchData(initialParams);
    if (
      initialParams.departureIataCode ||
      initialParams.arrivalIataCode ||
      initialParams.departureDate
    ) {
      console.log("initialParams useEffect", initialParams);
      fetchFlights(initialParams);
    }
  }, [location]);

  const fetchFlights = async (initialParams) => {
    console.log("initialParams", initialParams);
    try {
      const response = await ApiService.searchFlights(
        initialParams.departureIataCode,
        initialParams.arrivalIataCode,
        initialParams.departureDate,
      );
      setFlights(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSearch = async (e) => {
    console.log("searchData", searchData);
    e.preventDefault(); // Prevent form submission

    if (
      !searchData.departureIataCode ||
      !searchData.arrivalIataCode ||
      !searchData.departureDate
    ) {
      showError(
        "Please select departure and arrival airports and departure date",
      );
      return;
    }

    // Build URL params and navigate
    const query = new URLSearchParams();
    query.append("departureIataCode", searchData.departureIataCode);
    query.append("arrivalIataCode", searchData.arrivalIataCode);
    query.append("departureDate", searchData.departureDate);

    navigate(`?${query.toString()}`);
  };

  const handleSwapAirports = () => {
    setSearchData({
      ...searchData,
      departureIataCode: searchData.arrivalIataCode,
      arrivalIataCode: searchData.departureIataCode,
    });
  };

  const formatAirportOption = (airport) => {
    return `${airport.iataCode} (${airport.city}) - ${airport.name}`;
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    const dep = new Date(departureTime);
    const arr = new Date(arrivalTime);
    const diff = arr - dep;

    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="find-flight-page">
      <div className="flight-container">
        <ErrorDisplay />
        <SuccessDisplay />

        <div className="search-box">
          <h2>Find Your Flight</h2>
          <form onSubmit={handleSearch}>
            <div className="search-fields">
              <div className="form-group">
                <label>From</label>
                <select
                  value={searchData.departureIataCode}
                  onChange={(e) =>
                    setSearchData({
                      ...searchData,
                      departureIataCode: e.target.value,
                    })
                  }
                >
                  <option>Select Departure Airport</option>
                  {airports.map((airport) => {
                    return (
                      <option key={airport.iataCode} value={airport.iataCode}>
                        {formatAirportOption(airport)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="swap-cities">
                <button onClick={handleSwapAirports} className="swap-button">
                  <i class="fa-solid fa-arrows-left-right"></i>
                </button>
              </div>

              <div className="form-group">
                <label>To</label>
                <select
                  value={searchData.arrivalIataCode}
                  onChange={(e) =>
                    setSearchData({
                      ...searchData,
                      arrivalIataCode: e.target.value,
                    })
                  }
                >
                  <option>Select Arrival Airport</option>
                  {airports
                    .filter(
                      (airport) =>
                        airport.iataCode != searchData.departureIataCode,
                    )
                    .map((airport) => {
                      return (
                        <option key={airport.iataCode} value={airport.iataCode}>
                          {formatAirportOption(airport)}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="form-group">
                <label>Departure Date</label>
                <input
                  type="date"
                  required
                  value={searchData.departureDate}
                  onChange={(e) =>
                    setSearchData({
                      ...searchData,
                      departureDate: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <button className="search-button">Search Flights</button>
          </form>
        </div>

        <div className="results-container">
          {console.log("flights", flights)}
          {flights.length > 0 ? (
            <div className="flights-list">
              {flights.map((flight) => (
                <div className="flight-card">
                  <div className="flight-card-header">
                    <div className="flight-number"> {flight.flightNumber}</div>
                    <div className="flight-status"> {flight.status}</div>
                  </div>

                  <div className="flight-details">
                    <div className="departure-details">
                      <div className="time">
                        {formatTime(flight.departureTime)}
                      </div>
                      <div className="date">
                        {formatDate(flight.departureTime)}
                      </div>
                      <div className="airport">
                        {flight.departureAirport.iataCode} -{" "}
                        {flight.departureAirport.name}
                      </div>
                    </div>

                    <div className="duration">
                      <div className="line"></div>
                      <div className="duration-text">
                        {calculateDuration(
                          flight.departureTime,
                          flight.arrivalTime,
                        )}
                      </div>
                      <div className="line"></div>
                    </div>

                    <div className="arrival-details">
                      <div className="time">
                        {formatTime(flight.arrivalTime)}
                      </div>
                      <div className="date">
                        {formatDate(flight.arrivalTime)}
                      </div>
                      <div className="airport">
                        {flight.arrivalAirport.iataCode} -{" "}
                        {flight.arrivalAirport.name}
                      </div>
                    </div>

                    <div className="price">${flight.basePrice.toFixed(2)}</div>
                  </div>

                  <div className="flight-actions">
                    <Link
                      to={`/book-flight/${flight.id}`}
                      className="book-button"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-flights">
              <p>No Flights found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindFlight;
