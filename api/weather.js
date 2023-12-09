import axios from "axios";
import { apiKey } from "../constants/index.js";

const forecastEndpoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=f634f82ebdb44e8f8d2185222230712&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationsEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=f634f82ebdb44e8f8d2185222230712&q=${params.cityName}`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchWeatherForecast = (params) => {
  let forecasteUrl = forecastEndpoint(params);
  return apiCall(forecasteUrl);
};

export const fetchLocation = (params) => {
  let locationUrl = locationsEndpoint(params);
  return apiCall(locationUrl);
};
