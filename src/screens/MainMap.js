/* eslint-disable react/prop-types */
import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Marker } from "react-native-maps";
import MapView from 'react-native-map-clustering';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RoundMarker from '../components/RoundMarker';
import ClusterMarker from '../components/ClusterMarker';

import { api, processRawBusinesses, useBusinessData, useData } from '../services/api';
import apiData from '../services/apiData.json';

import { Dimensions } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

import BusinessSheet from '../components/BusinessSheet';
import SearchSheet from '../components/SearchSheet';
import { generateHexColorFromCategoryAlias } from '../icons/IconGenerator';
import { parseHours } from '../utils/utils';

const USE_API = false;

const initialRegion = {
    latitude: 34.041878080486164,
    longitude: -118.26305772438361,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
}

const MainMap = ({ businesses, selectedBusiness, setSelectedBusiness }) => {
    // const [businesses, setBusinesses] = useState([]);

    const [visitedFilter, setVisitedFilter] = useState(0);
    const [isOpenFilter, setIsOpenFilter] = useState(0);

    const [filteredBusinesses, setFilteredBusinesses] = useState();
    
    const bottomSheetRef = useRef(null);

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setSelectedBusiness();
        }
    }, []);

    const screenHeight = Dimensions.get('window').height;
    const statusBarHeight = Constants.statusBarHeight;
    const topSnapPoint = screenHeight - statusBarHeight;

    // const businessesQuery = useBusinessData(false);
    // const businesses = businessesQuery.data;

    useEffect(() => {
        const isVisited = businesses.filter(business => {
            return visitedFilter === 0
                ? true
                : visitedFilter === 1
                    ? business.visited
                    : !business.visited
        });

        const isOpen = businesses.filter(business => {
            return isOpenFilter === 0
                ? true 
                : isOpenFilter === 1
                    ? business.hours[0].is_open_now
                    : !business.hours[0].is_open_now
        });

        console.log(businesses[Math.round(Math.random() * businesses.length)])

    }, [businesses, visitedFilter, isOpenFilter])

    const snapPoints = [
        // 100,
        // '50%',
        // topSnapPoint
    ]

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
    })

    const [location, setLocation] = useState(null);
    useEffect(() => {
        const loadLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log({locationStatus: status})
            if (status !== 'granted') {
                console.error('Location permission denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        loadLocation();
    }, [])

    // if (location) {
    //     console.log({location});
    // }

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    // useEffect(() => {
    //     console.log({markerRef});
    // }, [markerRef]);

    

    return (
        <MapView
            style={styles.mapContainer}
            ref={mapRef}
            initialRegion={initialRegion}
            userLocationCalloutEnabled
            onPress={(() => {
                setSelectedBusiness();
            })}
            renderCluster={(props) => <ClusterMarker key={props.id} {...props} />}
            mapPadding={{ top: 200 }}
            // maxZoom={40}
        >
            {businesses.length > 0
                ? businesses.map(business => 
                    <RoundMarker 
                        // ref={markerRef}
                        key={business.alias}
                        business={business}
                        coordinate={business.coordinates}
                        selectedBusiness={selectedBusiness}
                        onPress={(() => {
                            setSelectedBusiness(business);
                        })}
                        style={{ zIndex: selectedBusiness?.alias === business.alias ? businesses.length + 1 : 0 }}
                    />)
                : null}
            {location
                ? 
                    <Marker
                        coordinate={location.coords}
                        pinColor='blue'
                    />
                : null}

        </MapView>
    )
}

export default MainMap;