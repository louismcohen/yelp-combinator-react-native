import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, TextInput, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MainMap from './MainMap';
import { useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { SearchContextProvider, useSearchContext } from '../contexts/SearchContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBusinessData } from '../services/api';
import SearchSheet, { IsOpenButton, SearchBar, VisitedButton } from '../components/SearchSheet';
import BusinessSheet from '../components/BusinessSheet';

const MainScreen = () => {
    const { businesses, selectedBusiness, setSelectedBusiness } = useSearchContext();

    const bottomSheetRef = useRef();

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setSelectedBusiness();
        }
    }, []);

    const insets = useSafeAreaInsets(); 

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'relative',

            flexDirection: 'column',
            gap: 8,
        },
        search: {
            ...StyleSheet.absoluteFillObject,
            pointerEvents: 'box-none',
            top: insets.top,
            flexDirection: 'column',
            gap: 8,
            flexShrink: 1,
            justifyContent: 'flex-start',
            paddingHorizontal: 16,

            // borderColor: 'red',
            // borderWidth: 1,
        },
        searchFilterControl: {
            backgroundColor: 'rgba(255, 255, 255, 1)',

            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.33,
            shadowRadius: 8,
        },
        searchBar: {
            flexShrink: 1,
            
            borderRadius: 999,
            borderColor: 'rgba(0,0,0,0.15)',
            borderWidth: 1,
        },
        filters: {
            flexDirection: 'row',
            gap: 8,
        },
        filter: {
            flexShrink: 1,
        }
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <MainMap 
                    businesses={businesses}
                />
                <View style={styles.search}>
                    <SearchBar style={[styles.searchFilterControl, styles.searchBar]} />
                    <View style={styles.filters}>
                        <VisitedButton style={[styles.searchFilterControl, styles.filter]} />
                        <IsOpenButton style={[styles.searchFilterControl, styles.filter]} />
                    </View>
                </View>
                {/* <BottomSheet
                    enableDynamicSizing
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.7,
                        shadowOffset: {
                            width: 0, 
                            height: 6,
                        },
                        shadowRadius: 12,

                        elevation: 5,
                    }}
                >
                    <SearchSheet isBottomSheet />
                </BottomSheet> */}
                <BottomSheet
                    ref={bottomSheetRef}
                    onChange={handleSheetChanges}
                    snapPoints={[]}
                    enablePanDownToClose     
                    enableDynamicSizing       
                    index={-1}
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.7,
                        shadowOffset: {
                            width: 0, 
                            height: 6,
                        },
                        shadowRadius: 12,

                        elevation: 5,
                    }}
                >
                    <BusinessSheet selectedBusiness={selectedBusiness} />
                </BottomSheet>
            </View>
        </TouchableWithoutFeedback>

    )
}

export default MainScreen;