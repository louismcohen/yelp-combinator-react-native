import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { api } from '../services/api';

import { Dimensions } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

const initialRegion = {
    latitude: 34.041878080486164,
    longitude: -118.26305772438361,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
}

export default MainMap = () => {
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState({});
    const bottomSheetRef = useRef(null);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
    }, []);

    const screenHeight = Dimensions.get('window').height;
    const statusBarHeight = Constants.statusBarHeight;
    const topSnapPoint = screenHeight - statusBarHeight;

    useEffect(() => {
        const getCollectionItems = async () => {
            const response = await api.get('');
            setBusinesses(response.data);
        };

        getCollectionItems();
    }, [])

    // useEffect(() => {
    //     console.log({businesses});
    // }, [businesses]);

    const snapPoints = [
        100,
        '50%',
        topSnapPoint
    ]

    const styles = StyleSheet.create({
        viewContainer: {
            width: '100%',
            height: '100%',
        },
        mapContainer: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignContent: 'center',
            // width: '100%',
            // height: '100%',
        },
        bottomSheetContainer: {
            flex: 1,
            alignItems: 'center',
        }
    })

    const [location, setLocation] = useState(null);
    useEffect(() => {
        const loadLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log({status})
            if (status !== 'granted') {
                console.error('Location permission denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        loadLocation();
    }, [])

    if (location) {
        console.log({location});
    }

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        console.log({markerRef});
    }, [markerRef]);

    useEffect(() => {
        selectedBusiness.alias 
            ? bottomSheetRef.current?.snapToIndex(0)
            : null;
        // bottomSheetRef.current?.snapToIndex(0);
    }, [selectedBusiness])

    return (
        <GestureHandlerRootView style={styles.viewContainer}>
            <MapView
                style={styles.mapContainer}
                ref={mapRef}
                initialRegion={initialRegion}
                userLocationCalloutEnabled
                onPress={(() => {
                    setSelectedBusiness({});
                    bottomSheetRef.current?.close();
                })}
            >
                {businesses.length > 0
                    ? businesses.map(biz => 
                        <Marker 
                            ref={markerRef}
                            coordinate={biz.coordinates}
                            // title={biz.name}
                            // description={biz.note}
                            key={biz.alias}
                            identifier={biz.alias}
                            stopPropagation
                            pinColor={selectedBusiness.alias === biz.alias ? 'green' : 'red'}
                            onPress={(() => {
                                setSelectedBusiness(biz);
                            })}
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
            <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                snapPoints={snapPoints}
                enablePanDownToClose
                onClose={() => {
                    setSelectedBusiness({});
                }}
            
                index={-1}
            >
                <BottomSheetView style={styles.bottomSheetContainer}>
                    <Text style={{ fontSize: 24, fontWeight: '700', alignSelf: 'flex-start', paddingHorizontal: 16}}>{selectedBusiness.name}</Text>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}