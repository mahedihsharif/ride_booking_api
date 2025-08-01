import axios from "axios";
import { envVars } from "../config/env";

export const getGeoLocation = async () => {
  try {
    const response = await axios.get(envVars.GEO_LOCATION_API);
    if (response.data.success) {
      const location = response.data.city;
      const lat = response.data.latitude;
      const lng = response.data.longitude;

      return { location, lat, lng };
    } else {
      throw new Error("Failed to get Geo Location");
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
