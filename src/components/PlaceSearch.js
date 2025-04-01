/* eslint-disable prettier/prettier */
import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { usePlaces } from '../context/PlacesContext';
import { getPlaceDetails } from '../services/placesService';

const PlaceSearch = () => {
  const { searchResults, setSearchResults, addPlace } = usePlaces();

  const handleSelectPlace = async (place) => {
    try {
      const placeDetails = await getPlaceDetails(place.place_id);
      if (placeDetails) {
        addPlace(placeDetails);
      }
      setSearchResults([]);
    } catch (error) {
      console.error('Error selecting place:', error);
    }
  };

  if (!searchResults.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => handleSelectPlace(item)}
          >
            <Text style={styles.mainText}>{item.structured_formatting.main_text}</Text>
            <Text style={styles.secondaryText}>{item.structured_formatting.secondary_text}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    zIndex: 1000,
    maxHeight: 200,
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainText: {
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default PlaceSearch;