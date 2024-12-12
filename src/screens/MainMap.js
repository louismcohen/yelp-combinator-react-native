/* eslint-disable react/prop-types */
import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';

import RoundMarker from '../components/RoundMarker';
import ClusterMarker from '../components/ClusterMarker';

import { Dimensions } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

const USE_API = false;

const initialRegion = {
  latitude: 34.041878080486164,
  longitude: -118.26305772438361,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const MainMap = ({
  businesses,
  selectedBusiness,
  setSelectedBusiness,
  onMapPress,
}) => {
  const styles = StyleSheet.create({
    viewContainer: {
      // flex: 1,
    },
    mapContainer: {
      flex: 1,
      // ...StyleSheet.absoluteFillObject,
      // flex: 1,
      // justifyContent: 'center',
      // alignContent: 'center',
      // width: '100%',
      // // height: '100%',
    },
  });

  const [location, setLocation] = useState(null);
  useEffect(() => {
    const loadLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log({ locationStatus: status });
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };

    loadLocation();
  }, []);

  const mapRef = useRef(null);

  return (
    <MapView
      style={styles.mapContainer}
      ref={mapRef}
      initialRegion={initialRegion}
      userLocationCalloutEnabled
      onPress={onMapPress}
      renderCluster={(props) => <ClusterMarker key={props.id} {...props} />}
      mapPadding={{ top: 200 }}
      showsMyLocationButton
      spiralEnabled={false}
      // maxZoom={40}
    >
      {businesses.length > 0
        ? businesses.map((business) => (
            <RoundMarker
              // ref={markerRef}
              key={business.alias}
              business={business}
              coordinate={business.coordinates}
              isSelected={selectedBusiness?.alias === business.alias}
              onPress={() => {
                setSelectedBusiness(business);
              }}
              style={{
                zIndex:
                  selectedBusiness?.alias === business.alias
                    ? businesses.length + 1
                    : 0,
              }}
            />
          ))
        : null}
      {location ? (
        <Marker coordinate={location.coords} pinColor='blue' />
      ) : null}
    </MapView>
  );
};

export default MainMap;
