/* eslint-disable prettier/prettier */
import axios from 'axios';

const API_KEY = 'AIzaSyDqQjvx-iN5bJK-lCfaGCL83G0QI3m5lsU';

export const searchPlaces = async (input) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}`
    );
    return response.data.predictions || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`
    );
    return response.data.result;
  } catch (error) {
    console.error('Details error:', error);
    return null;
  }
};