# Google Places Search App

A React Native application that allows users to search for places using Google Maps Places API, view them on a map, and maintain a search history.

## Features

- Real-time place search with suggestions
- Display selected places on an interactive map
- Persistent search history
- Clean and intuitive UI

## Setup

1. Clone the repository
2. Install dependencies: `npm install --force`
3. Set up Google Maps API:
   - Create a project in Google Cloud Console
   - Enable "Maps SDK for Android/iOS" and "Places API"
   - Add your API keys to:
     - Android: `android/app/src/main/AndroidManifest.xml`
     - iOS: `ios/GooglePlacesApp/AppDelegate.mm`
     #### <u>Note</u> The Google API has already been setup in the project
4. Run the app:
   - iOS: `npm run ios`
   - Android: `npm run android`

## Dependencies

- react-native-maps
- @react-native-async-storage/async-storage
- axios