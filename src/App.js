/* eslint-disable prettier/prettier */
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MainScreen from './screens/MainScreen';
import { PlacesProvider } from './context/PlacesContext';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    //<MainScreen/>

    <PlacesProvider>
      <HomeScreen />
    </PlacesProvider>
    // <SafeAreaView style={styles.statusbarHeight}>
    //   <View style={styles.viewStyle}>
    //     <Text>Google Places App</Text>
    //     <MapView style={styles.map}
    //     initialRegion={{
    //       latitude: 37.78825,
    //       longitude: -122.4324,
    //       latitudeDelta: 0.0922,
    //       longitudeDelta: 0.0421,
    //     }} >
    //       <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
    //     </MapView>
    //   </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statusbarHeight: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 0 : StatusBar.currentHeight,
  },
  viewStyle: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default App;

/// AIzaSyDqQjvx-iN5bJK-lCfaGCL83G0QI3m5lsU

// import React from 'react';
// import { PlacesProvider } from './context/PlacesContext';
// import HomeScreen from './screens/HomeScreen';

// const App = () => {
//   return (
    // <PlacesProvider>
    //   <HomeScreen />
    // </PlacesProvider>
//   );
// };

// export default App;