import axios from "axios";
import { envVars } from "../config/env";

export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const apiKey = envVars.OPEN_CASE_MAPS_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&countrycode=bd&key=${apiKey}`;

    const response = await axios.get(url);

    if (!response.data || response.data.results.length === 0) {
      throw new Error(`Geocoding failed for: ${address}`);
    }

    const location = response.data.results[0].geometry;

    return {
      lat: location.lat,
      lng: location.lng,
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Invalid OpenCage API key. Please check your OPEN_CASE_MAPS_API_KEY environment variable.");
    } else if (error.response?.status === 429) {
      throw new Error("OpenCage API rate limit exceeded. Please try again later.");
    } else {
      throw new Error(`Geocoding failed: ${error.message || "Unknown error"}`);
    }
  }
};
