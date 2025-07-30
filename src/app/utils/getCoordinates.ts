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
    throw new Error(error);
  }
};
