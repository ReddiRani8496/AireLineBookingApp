import React, { useEffect, useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import ApiService from "../../services/ApiService";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
  const [airports, setAirports] = useState([]);
  const [loadingAirports, setLoadingAirports] = useState(true);
  const [searchData, setSearchData] = useState({
    departureIataCode: "",
    arrivalIataCode: "",
    departureDate: "",
  });

  const navigate = useNavigate();

  const popularDestinations = [
    {
      id: 1,
      city: "Bangalore",
      country: "India",
      price: "$350",
      image: "bangalore.jpg",
    },
    {
      id: 2,
      city: "New York",
      country: "USA",
      price: "$450",
      image: "usa.jpg",
    },
    {
      id: 3,
      city: "London",
      country: "UK",
      price: "$380",
      image: "uk.jpg",
    },
    {
      id: 4,
      city: "Tokyo",
      country: "Japan",
      price: "$800",
      image: "japan.webp",
    },
  ];

  useEffect(() => {
    console.log("inside use effect");
    const fetchAllAirports = async () => {
      try {
        console.log("inside try block");
        const response = await ApiService.getAllAirports();
        setAirports(response.data || []);
      } catch (error) {
        showError("Failed to fetch airports");
      } finally {
        setLoadingAirports(false);
      }
    };

    fetchAllAirports();
  }, []);

  const handleSearch = async (e) => {
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

    navigate(
      `/flights?departureIataCode=${searchData.departureIataCode}&arrivalIataCode=${searchData.arrivalIataCode}&departureDate=${searchData.departureDate}`,
    );
  };

  const handleSwapAirports = () => {
    searchData({
      ...searchData,
      departureIataCode: arrivalIatacode,
      arrivalIataCode: departureIataCode,
    });
  };

  const formatAirportOption = (airport) => {
    return `${airport.iataCode} (${airport.city}) - ${airport.name}`;
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Book Your Flight with Rani Airlines</h1>
          <p>Find the best deals for your journey</p>
        </div>
        <div className="search-box">
          <ErrorDisplay />
          <SuccessDisplay />
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
                  value={searchData.departureIataCode}
                  onChange={(e) =>
                    setSearchData({
                      ...searchData,
                      departureIataCode: e.target.value,
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
                {console.log(new Date().toISOString())}
                <input
                  type="date"
                  required
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
          </form>
          <button className="search-button">Search Flights</button>
        </div>
      </div>

      {/**Popular destinations */}
      <div className="popular-destinations">
        <h2 className="popular-destination-title">Popular Destinations</h2>
        <p className="popular-destination-para">
          Explore our most booked flight routes
        </p>

        <div className="destination-card-container">
          {popularDestinations.map((destination) => (
            <div key={destination.id} className="destination-card">
              <div
                className="destination-card-image"
                style={{
                  backgroundImage: `url(/images/${destination.image})`,
                }}
              >
                <div className="destination-card-city">
                  <h3>{destination.city}</h3>
                  <p>{destination.country}</p>
                </div>
              </div>

              <div className="destination-card-price-container">
                <span className="destination-card-price">
                  From {destination.price}
                </span>
                <Link to="/flights" className="book-button">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
