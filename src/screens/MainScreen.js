/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapDisplay from '../components/MapDisplay';
import { searchPlaces, getPlaceDetails } from '../services/placesService';
import AsyncStorage from '@react-native-community/async-storage';

const MainScreen = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history on component mount
  useEffect(() => {
    const loadHistory = async () => {
      const savedHistory = await AsyncStorage.getItem('placesHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    };
    loadHistory();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(async () => {
        const results = await searchPlaces(query);
        setSuggestions(results);
        setShowHistory(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowHistory(true);
    }
  }, [query]);

  const handlePlaceSelect = async (place) => {
    const details = await getPlaceDetails(place.place_id);
    const newHistory = [
      { ...details, id: place.place_id },
      ...history.filter(item => item.id !== place.place_id)
    ].slice(0, 10);
    
    setSelectedPlace(details);
    setHistory(newHistory);
    setQuery('');
    setSuggestions([]);
    await AsyncStorage.setItem('placesHistory', JSON.stringify(newHistory));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for places..."
          value={query}
          onChangeText={setQuery}
          onFocus={() => setShowHistory(true)}
        />
        
        {/* Show suggestions or history */}
        {(suggestions.length > 0 || showHistory) && (
          <View style={styles.listContainer}>
            <FlatList
              data={showHistory && suggestions.length === 0 ? history : suggestions}
              keyExtractor={(item) => item.id || item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.item} 
                  onPress={() => handlePlaceSelect(item)}
                >
                  <Text style={styles.itemText}>
                    {item.description || item.formatted_address || item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapDisplay place={selectedPlace} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flex: 1,
    zIndex: 1,
  },
  mapContainer: {
    flex: 2,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  listContainer: {
    maxHeight: 200,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
});

export default MainScreen;