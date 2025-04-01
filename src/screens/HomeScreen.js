/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import SearchBar from '../components/SearchBar';
import MapViewComponent from '../components/MapView';
import HistoryList from '../components/HistoryList';
import PlaceItem from '../components/PlaceItem';
import PlaceSearch from '../components/PlaceSearch';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar />
        <PlaceSearch />
      </View>
      <View style={styles.mapContainer}>
        <MapViewComponent />
      </View>
      <View style={styles.historyContainer}>
        <HistoryList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    height: 120,
  },
  mapContainer: {
    flex: 2,
  },
  historyContainer: {
    flex: 1,
  },
});

export default HomeScreen;