import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView from "react-native-maps";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import Geolocation from '@react-native-community/geolocation';
import * as Location from 'expo-location';

const initialRegion = {
    latitude: 34.041878080486164,
    longitude: -118.26305772438361,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
}

export default MainMap = () => {
    const bottomSheetRef = useRef(null);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
    }, []);

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
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log({status})
            if (status !== 'granted') {
                console.error('Location permission denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })
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

            </MapView>
            <GestureHandlerRootView style={styles.viewContainer}>
                <BottomSheet
                    ref={bottomSheetRef}
                    onChange={handleSheetChanges}
                    snapPoints={['10%', '25%', '50%', '100%']}
                    // enablePanDownToClose
                    // index={-1}
                >
                    <BottomSheetView style={styles.bottomSheetContainer}>
                        <Text>Bottom Sheet Text</Text>
                    </BottomSheetView>
                </BottomSheet>
             </GestureHandlerRootView>
        </View>
    )
}