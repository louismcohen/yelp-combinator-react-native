import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MainMap from './MainMap';
import { useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {
  SearchContextProvider,
  useSearchContext,
} from '../contexts/SearchContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBusinessData } from '../services/api';
import SearchSheet, {
  IsOpenButton,
  SearchBar,
  VisitedButton,
} from '../components/SearchSheet';
import BusinessSheet, {
  BusinessImageBackground,
} from '../components/BusinessSheet';
import { nextFilterButtonState } from '../utils/utils';

const MainScreen = () => {
  const {
    filteredBusinesses,
    selectedBusiness,
    setSelectedBusiness,
    visitedFilter,
    setVisitedFilter,
    isOpenFilter,
    setIsOpenFilter,
  } = useSearchContext();

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
      // backgroundColor: 'rgba(255, 255, 255, 1)',

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.33,
      shadowRadius: 8,
    },
    searchBar: {
      backgroundColor: 'rgba(255, 255, 255, 0.97)',
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
    },
  });

  useEffect(() => {
    if (selectedBusiness) {
      selectedBusiness.alias ? bottomSheetRef.current?.expand() : null;
    } else {
      bottomSheetRef.current?.close();
    }

    // bottomSheetRef.current?.snapToIndex(0);
  }, [selectedBusiness]);

  const onMapPress = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <MainMap
          onMapPress={onMapPress}
          businesses={filteredBusinesses}
          selectedBusiness={selectedBusiness}
          setSelectedBusiness={setSelectedBusiness}
        />
        <View style={styles.search}>
          <SearchBar style={[styles.searchFilterControl, styles.searchBar]} />
          <View style={styles.filters}>
            <VisitedButton
              style={[styles.searchFilterControl, styles.filter]}
              visitedFilter={visitedFilter}
              onPress={() =>
                nextFilterButtonState(visitedFilter, setVisitedFilter)
              }
            />
            <IsOpenButton
              style={[styles.searchFilterControl, styles.filter]}
              isOpenFilter={isOpenFilter}
              onPress={() =>
                nextFilterButtonState(isOpenFilter, setIsOpenFilter)
              }
            />
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          onClose={() => setSelectedBusiness()}
          handleComponent={() => null}
          snapPoints={[180]}
          enablePanDownToClose
          enableDynamicSizing
          index={0}
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
  );
};

export default MainScreen;
