/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { searchPlaces } from '../services/placesService';
import { usePlaces } from '../context/PlacesContext';
import useDebounce from '../hooks/useDebounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { setSearchResults } = usePlaces();
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      searchPlaces(debouncedQuery).then(results => {
        setSearchResults(results);
      });
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, setSearchResults]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for places..."
        value={query}
        onChangeText={setQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});

export default SearchBar;