/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-community/async-storage';

const PLACES_KEY = 'AIzaSyDqQjvx-iN5bJK-lCfaGCL83G0QI3m5lsU';

export const getPlaces = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(PLACES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading places', e);
    return [];
  }
};

export const storePlaces = async (places) => {
  try {
    const jsonValue = JSON.stringify(places);
    await AsyncStorage.setItem(PLACES_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving places', e);
  }
};