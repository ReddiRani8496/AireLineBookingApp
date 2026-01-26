import React, { useEffect, useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";

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
    const fetchAllAirports = async () => {
      try {
        const response = await ApiService.getAllAirports();
        setAirports(response.data || []);
      } catch (error) {
        showError("Failed to fetch airports");
      } finally {
        setLoadingAirports(false);
      }
    };
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

  return <div>HomePage</div>;
}

export default HomePage;
