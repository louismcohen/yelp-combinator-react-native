import { StyleSheet, View, Text, FlatList, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient} from 'expo-linear-gradient';

import ColorPalette from '../styles/ColorPalette';
import { FontAwesome6 } from '@expo/vector-icons';

import { parseHours } from '../utils/utils';

const DEBUG_BORDER = 
{}
// {
//     borderColor: 'red',
//     borderWidth: 1,
// }

const InfoListItem = (props) => {
    const { icon, iconStyles, color, content } = props
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
        icon: {
            flexShrink: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            width: 40,
            color: 'white',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.15)',

            backgroundColor: color,

            ...iconStyles
        },
        content: {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
    })

    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <FontAwesome6 name={icon} size={17} color={'white'} />
            </View>
            <View style={styles.content}>
                {content}
            </View>
        </View>
    )
};

const Hours = ({ openingHours }) => {
    return (
        <InfoListItem 
            icon='clock'
            color={ColorPalette.getHexColorByName('mango')}
            content={
                <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.5)'}}>
                    {openingHours}
                </Text>
            }
        />
    )
} 

export default BusinessSheet = ({ selectedBusiness }) => {
    const { name, coordinates, categories, note, image_url, visited, location } = selectedBusiness;
    console.log({coordinates});

    const openingHours = coordinates ? parseHours(selectedBusiness) : null;
    const formattedAddress = `${location?.address1}\n${location?.city}, ${location?.state} ${location?.zip_code}`;

    const insets = useSafeAreaInsets();
    
    const styles = StyleSheet.create({
        bottomSheetContainer: {
            // flex: 1,
            paddingBottom: insets.bottom,
            alignItems: 'center',
            // paddingHorizontal: 16,
            ...DEBUG_BORDER
        },
        heroImage: {
            width: '100%',
            height: 200,
            resizeMode: 'cover',
        },
        infoContainer: {
            flex: 1,
            padding: 16,
            width: '100%',
            justifyContent: 'flex-end',
            gap: 16,
            // borderColor: 'blue',
            // borderWidth: 1,
        },
        headerContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            // borderColor: 'green',
            // borderWidth: 1,
        },
        headerText: {
            color: 'white',
            fontSize: 24,
            fontWeight: '700',
            alignSelf: 'flex-start',
            flexDirection: 'row',
            ...DEBUG_BORDER
        },
        subHeaderText: {
            color: 'white',
            opacity: 0.85,
            fontSize: 17,
            opacity: 0.5,
        },
        categoryText: {
            fontSize: 17,
            alignSelf: 'flex-start',
        }
    });

    const INFO_LIST_DATA = [
        {
            icon: 'map-location-dot',
            color: ColorPalette.getHexColorByName('englishViolet'),
            content: <Text numberOfLines={2} style={{ fontSize: 17, color: 'rgba(0,0,0,0.5)', textAlign: 'right'}}>{formattedAddress}</Text>
        },
        { 
            icon: 'clock',
            color: ColorPalette.getHexColorByName('mango'),
            content: <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.5)' }}>{openingHours}</Text>,
        },
        { 
            icon: 'note-sticky',
            color: ColorPalette.getHexColorByName('sealBrown'),
            content: <TextInput style={{ fontSize: 17, color: 'rgba(0,0,0,0.8)' }} defaultValue={note?.trim()} />,
        },
        { 
            icon: 'check',
            color: ColorPalette.getHexColorByName('kellyGreen'),
            content: <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.8)' }}>{visited ? 'I\'ve been here' : 'I haven\'t been here'}</Text>,
        },
        { 
            icon: 'yelp',
            color: ColorPalette.getHexColorByName('yelpRed'),
            content: <TouchableOpacity><Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.8)' }}>Open in Yelp</Text></TouchableOpacity>,
        },
    ]

    return (
        <BottomSheetView style={styles.bottomSheetContainer}>
            <ImageBackground style={styles.heroImage} source={{ uri: image_url }}>
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    locations={[0, 0.8]}
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        height: 200,
                    }}
                >
                    <View style={styles.infoContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>{name}</Text>
                            { categories 
                    ? 
                        <Text style={styles.subHeaderText}>{categories.map((category) => category.title).join(', ')}</Text>
                    
                    : null
                }
                            
                        </View>
                </View>
                </LinearGradient>
            </ImageBackground>
            <View style={{
                padding: 16,
                justifyContent: 'center',
                alignItems: 'stretch',
                gap: 8,
                width: '100%',
            }}>
                <FlatList 
                    ItemSeparatorComponent={<View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.15)', marginHorizontal: 12,}} />}
                    data={INFO_LIST_DATA}
                    renderItem={({ item }) => <InfoListItem {...item} />}
                    style={{
                        borderRadius: 10,
                        borderColor: 'rgba(0,0,0,0.15)',
                        borderWidth: 1,
                        backgroundColor: 'rgba(0,0,0,0.05)'

                    }}       
                />
            </View>
        </BottomSheetView>
    )
}