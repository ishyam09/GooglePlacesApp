/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { searchPlaces, getPlaceDetails } from '../services/placesService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GooglePlacesSearch = () => {
    // Refs
    const mapRef = useRef(null);
    const textInputRef = useRef(null);
    const resultsRef = useRef(null);

    // State management
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [selectedPlace, setSelectedPlace] = useState(null);

    // Load history on mount
    useEffect(() => {
        loadSearchHistory();
    }, []);

    const loadSearchHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('placesHistory');
            if (history) setSearchHistory(JSON.parse(history));
        } catch (error) {
            console.error('Failed to load history', error);
        }
    };

    // Handle search with debounce
    useEffect(() => {
        if (searchText.length > 2) {
            const timer = setTimeout(() => {
                searchPlaces(searchText).then(results => {
                    setSearchResults(results);
                });
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [searchText]);

    const handlePlaceSelect = async (place) => {
        try {
            Keyboard.dismiss();

            // Get full place details
            const details = await getPlaceDetails(place.place_id);
            if (!details) return;

            // Update selected place
            setSelectedPlace(details);
            setSearchText(details.name);
            setShowResults(false);

            // Update search history
            const newHistory = [
                { ...details, id: place.place_id },
                ...searchHistory.filter(item => item.id !== place.place_id)
            ].slice(0, 10);

            setSearchHistory(newHistory);
            await AsyncStorage.setItem('placesHistory', JSON.stringify(newHistory));

            // Animate map to selected location
            if (mapRef.current && details.geometry?.location) {
                mapRef.current.animateToRegion({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }, 1000);
            }
        } catch (error) {
            console.error('Error selecting place:', error);
        }
    };

    const handleSearchSubmit = async () => {
        if (searchText.trim().length === 0) return;

        try {
            Keyboard.dismiss();

            // Check if this matches any existing results
            const existingMatch = searchResults.find(
                r => r.description.toLowerCase() === searchText.toLowerCase()
            );

            if (existingMatch) {
                handlePlaceSelect(existingMatch);
                return;
            }

            // Perform a new search and select first result
            const results = await searchPlaces(searchText);
            if (results.length > 0) {
                handlePlaceSelect(results[0]);
            }
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleOutsideTouch = () => {
        // Only hide results if the touch is outside both the input and results
        if (textInputRef.current && !textInputRef.current.isFocused() && showResults) {
            setShowResults(false);
        }
    };

    return (
        <View style={styles.container} onStartShouldSetResponder={handleOutsideTouch}>
            {/* Map View - Takes full screen */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={currentLocation}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {selectedPlace?.geometry?.location && (
                    <Marker
                        coordinate={{
                            latitude: selectedPlace.geometry.location.lat,
                            longitude: selectedPlace.geometry.location.lng,
                        }}
                        title={selectedPlace.name}
                        description={selectedPlace.formatted_address}
                    />
                )}
            </MapView>

            {/* Search Bar - Positioned absolutely over map */}
            <View style={styles.searchContainer}>
                <TextInput
                    ref={textInputRef}
                    style={styles.searchInput}
                    placeholder="Search for places..."
                    value={searchText}
                    onChangeText={setSearchText}
                    onFocus={() => setShowResults(true)}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                />

                {/* Search Results Dropdown */}
                {showResults && (
                    <View
                        style={styles.resultsContainer}
                        ref={resultsRef}
                    >
                        {searchResults.length > 0 ? (
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item.place_id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.resultItem}
                                        onPress={() => handlePlaceSelect(item)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.resultMainText}>{item.structured_formatting.main_text}</Text>
                                        <Text style={styles.resultSecondaryText}>{item.structured_formatting.secondary_text}</Text>
                                    </TouchableOpacity>
                                )}
                                keyboardShouldPersistTaps="always"
                            />
                        ) : searchHistory.length > 0 ? (
                            <>
                                <Text style={styles.sectionTitle}>Recent Searches</Text>
                                <FlatList
                                    data={searchHistory}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.resultItem}
                                            onPress={() => handlePlaceSelect({
                                                place_id: item.id,
                                                structured_formatting: {
                                                    main_text: item.name,
                                                    secondary_text: item.formatted_address
                                                }
                                            })}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.resultMainText}>{item.name}</Text>
                                            <Text style={styles.resultSecondaryText}>{item.formatted_address}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </>
                        ) : (
                            <Text style={styles.noResultsText}>No recent searches</Text>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    searchContainer: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        zIndex: 1,
    },
    searchInput: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    resultsContainer: {
        maxHeight: 300,
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    resultItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    resultMainText: {
        fontSize: 16,
        fontWeight: '500',
    },
    resultSecondaryText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    sectionTitle: {
        padding: 15,
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    noResultsText: {
        padding: 15,
        textAlign: 'center',
        color: '#999',
    },
});

export default GooglePlacesSearch;
