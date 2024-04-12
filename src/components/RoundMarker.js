import { memo, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import { Icon } from '../icons/IconGenerator';
import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    ReduceMotion
  } from 'react-native-reanimated';

const RoundMarker = ({ business, selectedBusiness, onPress }) => {
    const isSelected = selectedBusiness.alias === business.alias;
    const primaryCategoryAlias = business?.categories[0].alias;

    const iconFillVisited = `#fff`;
    const defaultSize = 16;

    const defaultIconProps = {
        height: `${defaultSize}px`,
        width: `${defaultSize}px`,
      };    

    const markerSize = useSharedValue(32);
    const scaledUp = useSharedValue(1);

    // const iconHexColor = generateHexColorFromCategoryAlias(primaryCategoryAlias);

    const iconFillColor = business.visited ? iconFillVisited : business.iconHexColor

    const styles = StyleSheet.create({
        container: {
            borderRadius: 999,
            borderWidth: 1,
            borderColor: !business.visited ? business.iconHexColor || ColorPalette.getHexColorByName('yelpRed') : `rgba(0,0,0,0.20)`,

            height: markerSize.value,
            width: markerSize.value,

            justifyContent: 'center',
            alignItems: 'center',

            backgroundColor: business.visited ? business.iconHexColor || ColorPalette.getHexColorByName('yelpRed') : `#fff`,

            shadowColor: 'rgba(0,0,0,1.0)',
            shadowOpacity: isSelected ? 0.2 : 0.5,
            shadowRadius: isSelected ? 2 : 4,
            shadowOffset: {
                width: 0,
                height: 2,
            },

            elevation: 3,
        },
        glow: {
            borderRadius: 999,

            shadowColor: business.iconHexColor,
            shadowOpacity: isSelected ? 1.0 : 0.5,
            shadowRadius: isSelected ? 5 : 2,
            shadowOffset: {
                width: 0,
                height: 0,
            },

            elevation: 3,

            zIndex: isSelected ? 100 : 0,

            backgroundColor: business.visited ? business.iconHexColor || ColorPalette.getHexColorByName('yelpRed') : `#fff`,
        },
        icon: {
            fontSize: defaultSize,
            color: iconFillColor,
        },
    });

    const springConfig = {
        mass: isSelected ? 1 : 1.5,
        damping: isSelected ? 8 : 10,
        stiffness: isSelected ? 350 : 150,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
        reduceMotion: ReduceMotion.System,
    }

    const animatedStyle = useAnimatedStyle(() => {
        
        return {
            transform: [{ scale: scaledUp.value }],
        }
    })

    useEffect(() => {
        handleAnimation()
    }, [isSelected])

    const handleAnimation = () => {
        scaledUp.value = isSelected ? withSpring(scaledUp.value * 1.25, springConfig) : withSpring(1, springConfig);
    }

    return (
        <Marker 
            coordinate={business.coordinates}
            // title={biz.name}
            // description={biz.note}
            identifier={business.alias}
            stopPropagation
            onPress={onPress}
        >
            <Animated.View style={animatedStyle}>
                <View style={styles.glow}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.container}>
                        <Icon style={styles.icon} categoryAlias={primaryCategoryAlias} props={{ fill: iconFillColor, height: defaultSize, width: defaultSize }} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Marker>
    )
};

export default memo(RoundMarker);