import React, { useState, useReducer } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import ColorPalette from '../styles/ColorPalette';
import { hexToRgba } from '../utils/utils';
import { useSearchContext } from '../contexts/SearchContext';

const FilterButton = ({ style, icon, iconSource, text, color, state, onPress }) => {
    const defaultColor = '#000';
    const accentColor = color || defaultColor;

    let borderColor;
    let backgroundColor;
    let contentColor;

    switch (state) {
        case 0:
        default:
            borderColor = hexToRgba(defaultColor, 0.15);
            contentColor = hexToRgba(defaultColor, 0.5);
            break;
        case 1:
            borderColor = defaultColor;
            contentColor = 'white';
            backgroundColor = hexToRgba(accentColor, 0.90);
            break;
        case 2:
            borderColor = accentColor;
            contentColor = accentColor;
            break;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            borderRadius: 8,
            borderColor,
            borderWidth: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,

            flexDirection: 'row',
            gap: 8,
            justifyContent: 'flex-start',
            alignItems: 'center',

            backgroundColor,
        },
        text: {
            fontSize: 14,
            color: contentColor,
        }
    });

    const iconProps = {
        name: icon,
        size: 24,
        color: contentColor,
    }

    let iconComponent;
    switch (iconSource) {
        case 'Ionicons':
        default:
            iconComponent = <Ionicons {...iconProps} />
            break;
        case 'FontAwesome6':
            iconComponent = <FontAwesome6 {...iconProps} />
            break;
    }

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            {iconComponent}
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

export const VisitedButton = ({ style, visitedFilter, onPress }) => {
    let icon = '';
    let text = '';
    const color = ColorPalette.getHexColorByName('kellyGreen');

    switch (visitedFilter) {
        case 0:
        default:
            icon = 'checkbox';
            text = 'Show all';
            break;
        case 1:
            icon = 'checkbox';
            text = 'Already visited';
            break;
        case 2:
            icon = 'checkbox-outline';
            text = 'Not visited yet';
            break;
    }

    return (
        <FilterButton style={style} icon={icon} iconSource={'Ionicons'} text={text} color={color} state={visitedFilter} onPress={onPress} />
    )
}

export const IsOpenButton = ({ style, isOpenFilter, onPress }) => {
    let icon = '';
    let text = '';
    const color = ColorPalette.getHexColorByName('englishViolet');

    switch (isOpenFilter) {
        case 0:
        default:
            icon = 'door-open';
            text = 'Show all';
            break;
        case 1:
            icon = 'door-open';
            text = 'Currently open';
            break;
        case 2:
            icon = 'door-closed';
            text = 'Currently closed';
            break;
    }

    return (
        <FilterButton style={style} icon={icon} iconSource='FontAwesome6' text={text} color={color} state={isOpenFilter} onPress={onPress} />
    )   
}

export const SearchBar = ({ style }) => {
    const { setSearchQuery } = useSearchContext();

    const styles = StyleSheet.create({
        search: {
            flexDirection: 'row',
            gap: 12,
            height: 48,
            borderColor: 'rgba(0,0,0,0.15)',
            borderRadius: 999,
            borderWidth: 1,

            backgroundColor: 'rgba(0,0,0,0.05)',

            paddingVertical: 12,
            paddingHorizontal: 16,

            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 6,
            },
            // shadowOpacity: 1,
            shadowRadius: 12,
        },
        leftIcon: {
            height: 20,
            width: 20,
            color: 'rgba(0,0,0, 0.5)',
        },
        textInput: {
            flexGrow: 1,
            fontSize: 17,
        },
    })

    return (
        <View style={[styles.search, style]}>
            <FontAwesome6 name='magnifying-glass' size={20} color='rgba(0,0,0, 0.5)' />
            <TextInput 
                clearButtonMode='always'
                style={styles.textInput}
                placeholder='Search for businesses'
                autoCorrect={false}
                onChangeText={(text) => setSearchQuery(text)}
        />
        </View> 
    )
}

const SearchSheet = ({ visitedFilter, setVisitedFilter, isOpenFilter, setIsOpenFilter, isBottomSheet }) => {
    const nextFilterButtonState = (button, setButton) => {
        // 0 = disabled, 1 = on, 2 = off
        button < 2 ? setButton(button + 1) : setButton(0);
      }

    // const [visitedFilter, setVisitedFilter] = useState(0);
    // const [isOpenFilter, setIsOpenFilter] = useState(0);
    const insets = useSafeAreaInsets();

    const styles = StyleSheet.create({
        container: {
            paddingBottom: isBottomSheet ? insets.bottom : 0,
            paddingHorizontal: 16,

            flexDirection: 'column',
            gap: 12,
        },
        search: {
            flexDirection: 'row',
            gap: 12,
            height: 48,
            borderColor: 'rgba(0,0,0,0.15)',
            borderRadius: 999,
            borderWidth: 1,

            backgroundColor: 'rgba(0,0,0,0.05)',

            paddingVertical: 12,
            paddingHorizontal: 16,

            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 6,
            },
            // shadowOpacity: 1,
            shadowRadius: 12,
        },
        leftIcon: {
            height: 20,
            width: 20,
            color: 'rgba(0,0,0, 0.5)',
        },
        textInput: {
            flexGrow: 1,
            fontSize: 17,
        },
        filterContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            gap: 12,
        }
    });

    

    const ViewContainer = ({ style, children }) => {
        if (isBottomSheet) {
            return <BottomSheetView style={style}>{children}</BottomSheetView>;
        } else {
            return <View styles={style}>{children}</View>;
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ViewContainer style={styles.container}>
                
                
                <View style={styles.filterContainer}>
                    <VisitedButton visitedFilter={visitedFilter} onPress={() => nextFilterButtonState(visitedFilter, setVisitedFilter)} />
                    <IsOpenButton isOpenFilter={isOpenFilter} onPress={() => nextFilterButtonState(isOpenFilter, setIsOpenFilter)} />
                </View>
            </ViewContainer>
        </TouchableWithoutFeedback>
    )
};

export default SearchSheet;