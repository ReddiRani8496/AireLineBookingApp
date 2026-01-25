import React, { useEffect, useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";

function HomePage() {
  const { ErrorDisplay, SuccessDisplay, showError, showSuccess } = useMessage();

  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);
  const [loadingAirports, setLoadingAirports] = useState(true);
  const [searchData, setSearchData] = useState({
    departureIataCode: "",
    arrivalIataCode: "",
    departureDate: "",
  });

  const popularDestinations = [
    {
      id: 1,
      city: "New York",
      country: "USA",
      price: "$450",
      image: "usa.jpg",
    },
    {
      id: 2,
      city: "London",
      country: "UK",
      price: "$380",
      image: "uk.jpg",
    },
    {
      id: 3,
      city: "Dubai",
      country: "UAE",
      price: "$520",
      image: "uae.webp",
    },
    {
      id: 4,
      city: "Tokyo",
      country: "Japan",
      price: "$1200",
      image: "japan.webp",
    },
  ];

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await ApiService.getAllAirports();
        setAirports(response?.data || []);
      } catch (error) {
        showError("Failed to load airports");
      } finally {
        setLoadingAirports(false);
      }
    };

    fetchAirports();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (
      !searchData.departureIataCode ||
      !searchData.arrivalIataCode ||
      !searchData.departureDate
    ) {
      showError("please select departure and arrival aiports and dates");
      return;
    }
    navigate(
      `/flights?departureIataCode=${searchData.departureIataCode}&arrivalIataCode=${searchData.arrivalIataCode}&departureDate=${searchData.departureDate}`,
    );
  };

  const handleSwapAirports = () => {
    searchData({
      ...searchData,
      departureIataCode: searchData.arrivalIataCode,
      arrivalIataCode: searchData.departureIataCode,
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
        </div>
      </div>
    </div>
  );
}

export default HomePage;
