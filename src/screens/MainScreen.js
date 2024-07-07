import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainMap from './MainMap';
import { useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { SearchContextProvider, useSearchContext } from '../contexts/SearchContext';

const MainScreen = () => {
    const { selectedBusiness, setSelectedBusiness, visitedFilter, setVisitedFilter, isOpenFilter, setIsOpenFilter } = useSearchContext();

    return (
        <View style={{ flex: 1 }}>
            <SearchContextProvider>
                <MainMap 
                    setSelectedBusiness={setSelectedBusiness} 
                    filteredBusinesses={filteredBusinesses} 
                />
                <BottomSheet
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
                    <SearchSheet
                        visitedFilter={visitedFilter}
                        setVisitedFilter={setVisitedFilter}
                        isOpenFilter={isOpenFilter}
                        setIsOpenFilter={setIsOpenFilter}
                    />
                </BottomSheet>
                <BottomSheet
                    ref={bottomSheetRef}
                    onChange={handleSheetChanges}
                    snapPoints={snapPoints}
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
            </SearchContextProvider>
        </View>
    )
}

export default MainScreen;