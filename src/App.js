import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGeolocated } from "react-geolocated";
import "./index.css";

const API_KEY = process.env.REACT_APP_API_KEY;

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user's location using react-geolocated
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  // Fetch weather data by city name
  const fetchWeatherByCity = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`,
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false);
      if (error.response && error.response.status === 400) {
        setError("City not found. Please check the spelling and try again.");
      } else {
        setError(
          "An error occurred while fetching weather data. Please try again later.",
        );
      }
      setWeatherData(null);
    }
  };

  // Fetch weather data by geolocation
  useEffect(() => {
    if (coords) {
      const { latitude, longitude } = coords;
      fetchWeatherByCity(`${latitude},${longitude}`);
    }
  }, [coords]);

  // Handle input change
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  // Handle form submit for user input
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchWeatherByCity(city);
    }
  };

  // Render weather data in a user-friendly way
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-300 to-purple-300">
      <h1 className="text-4xl font-bold mb-8 text-white">WEATHERIZER</h1>

      {/* User input for city */}
      <form onSubmit={handleSubmit} className="mb-6 relative">
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city name"
          className="p-3 pr-10 rounded-md shadow-md text-gray-700 w-64"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-purple-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>

      {/* Display Loading State */}
      {loading && <p className="text-white text-xl">Loading...</p>}

      {/* Display Error Message */}
      {error && <p className="text-red-500 text-xl mb-4">{error}</p>}

      {/* Display Weather Data */}
      {weatherData && (
        <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg text-center text-white">
          <h2 className="text-2xl font-semibold mb-4">
            {weatherData.location.name}, {weatherData.location.country}
          </h2>
          <p className="text-lg mb-2">
            <span className="font-bold">Temperature: </span>
            {weatherData.current.temp_c}°C
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold">Condition: </span>
            {weatherData.current.condition.text}
          </p>
          <img
            src={weatherData.current.condition.icon}
            alt="Weather Icon"
            className="mx-auto fill-"
          />
          <p className="text-lg mt-4">
            <span className="font-bold">Feels like: </span>
            {weatherData.current.feelslike_c}°C
          </p>
        </div>
      )}

      {/* Geolocation status */}
      {!isGeolocationAvailable ? (
        <p className="text-red-500">
          Your browser does not support Geolocation
        </p>
      ) : !isGeolocationEnabled ? (
        <p className="text-red-500">Geolocation is not enabled</p>
      ) : coords ? null : (
        <p className="text-white">Getting your location...</p>
      )}
    </div>
  );
};

export default App;
