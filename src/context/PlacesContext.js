/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlaces, storePlaces } from '../services/storageService';

const PlacesContext = createContext();

export const PlacesProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const loadPlaces = async () => {
      const savedPlaces = await getPlaces();
      if (savedPlaces) setPlaces(savedPlaces);
    };
    loadPlaces();
  }, []);

  const addPlace = async (place) => {
    const newPlaces = [place, ...places.filter(p => p.id !== place.id)].slice(0, 20);
    setPlaces(newPlaces);
    await storePlaces(newPlaces);
    setSelectedPlace(place);
  };

  return (
    <PlacesContext.Provider value={{
      places,
      selectedPlace,
      searchResults,
      setSearchResults,
      addPlace,
      setSelectedPlace
    }}>
      {children}
    </PlacesContext.Provider>
  );
};

export const usePlaces = () => useContext(PlacesContext);