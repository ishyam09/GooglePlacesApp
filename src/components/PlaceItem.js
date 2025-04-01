/* eslint-disable prettier/prettier */
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const PlaceItem = ({ place }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.name}>{place.name}</Text>
//       <Text style={styles.address}>{place.formatted_address}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   name: {
//     fontWeight: 'bold',
//   },
//   address: {
//     color: '#666',
//   },
// });

// export default PlaceItem;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceItem = ({ place }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{place.name}</Text>
      <Text style={styles.address}>{place.formatted_address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontWeight: 'bold',
  },
  address: {
    color: '#666',
  },
});

export default PlaceItem;