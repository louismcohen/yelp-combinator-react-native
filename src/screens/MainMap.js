import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { api } from '../services/api';

import { Dimensions } from 'react-native';
import Constants from 'expo-constants';
// import Geolocation from '@react-native-community/geolocation';
import * as Location from 'expo-location';

const initialRegion = {
    latitude: 34.041878080486164,
    longitude: -118.26305772438361,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
}

export default MainMap = () => {
    const [items, setItems] = useState([]);
    const [markers, setMarkers] = useState([]);
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
            setItems(response.data);
        };

        getCollectionItems();
    }, [])

    useEffect(() => {
        console.log({items});
    }, [items]);

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

    // Geolocation.getCurrentPosition(info => console.log(info));

    const mapRef = useRef(null);

    return (
        <View style={styles.viewContainer}>
            <MapView
                style={styles.mapContainer}
                ref={mapRef}
                initialRegion={initialRegion}
            >
                {items.length > 0
                    ? items.map(item => 
                        <Marker 
                            coordinate={item.coordinates}
                            title={item.name}
                            description={item.note}
                            identifier={item.alias}
                            stopPropagation
                        />)
                    : null}
            </MapView>
            <GestureHandlerRootView style={styles.viewContainer}>
                <BottomSheet
                    ref={bottomSheetRef}
                    onChange={handleSheetChanges}
                    snapPoints={snapPoints}
                    // enablePanDownToClose
                    // index={-1}
                >
                    <BottomSheetView style={styles.bottomSheetContainer}>
                        <Text style={{ fontSize: 24, fontWeight: '700', alignSelf: 'flex-start', paddingHorizontal: 16}}>Bottom Sheet Text</Text>
                    </BottomSheetView>
                </BottomSheet>
             </GestureHandlerRootView>
        </View>
    )
}