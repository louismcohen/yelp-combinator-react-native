import { useState, useReducer } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import ColorPalette from '../styles/ColorPalette';
import { hexToRgba } from '../utils/utils';

const FilterButton = ({ icon, iconSource, text, color, state, onPress }) => {
    const defaultColor = 'rgba(0,0,0,0.15)';
    const accentColor = color || defaultColor;

    let borderColor;
    let backgroundColor;
    let contentColor;

    switch (state) {
        case 0:
        default:
            borderColor = defaultColor;
            contentColor = defaultColor;
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
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {iconComponent}
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const VisitedButton = ({ visitedFilter, onPress }) => {
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
        <FilterButton icon={icon} iconSource={'Ionicons'} text={text} color={color} state={visitedFilter} onPress={onPress} />
    )
}

const IsOpenButton = ({ isOpenFilter, onPress }) => {
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
        <FilterButton icon={icon} iconSource='FontAwesome6' text={text} color={color} state={isOpenFilter} onPress={onPress} />
    )   
}

const SearchSheet = ({ searchQuery, visitedFilter, setVisitedFilter, isOpenFilter, setIsOpenFilter }) => {
    const nextFilterButtonState = (button, setButton) => {
        // 0 = disabled, 1 = on, 2 = off
        button < 2 ? setButton(button + 1) : setButton(0);
      }

    // const [visitedFilter, setVisitedFilter] = useState(0);
    // const [isOpenFilter, setIsOpenFilter] = useState(0);
    const insets = useSafeAreaInsets();
    

    const styles = StyleSheet.create({
        container: {
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 16,

            flexDirection: 'column',
            gap: 8,
        },
        textInput: {
            width: '100%',
            height: 48,
            borderColor: 'rgba(0,0,0,0.15)',
            borderRadius: 10,
            borderWidth: 1,

            backgroundColor: 'rgba(0,0,0,0.05)',

            paddingVertical: 12,
            paddingHorizontal: 16,

            fontSize: 17,

        },
        filterContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            gap: 8,
        }
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <BottomSheetView style={styles.container}>
                <TextInput 
                    clearButtonMode='always'
                    style={styles.textInput}
                    placeholder='Search for businesses'
                />
                <View style={styles.filterContainer}>
                    <VisitedButton visitedFilter={visitedFilter} onPress={() => nextFilterButtonState(visitedFilter, setVisitedFilter)} />
                    <IsOpenButton isOpenFilter={isOpenFilter} onPress={() => nextFilterButtonState(isOpenFilter, setIsOpenFilter)} />
                </View>
            </BottomSheetView>
        </TouchableWithoutFeedback>
    )
};

export default SearchSheet;