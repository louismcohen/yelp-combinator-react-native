import { StyleSheet, View, Text, FlatList, SectionList, ImageBackground, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Linking } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient} from 'expo-linear-gradient';

import ColorPalette from '../styles/ColorPalette';
import { FontAwesome6 } from '@expo/vector-icons';

import { parseHours } from '../utils/utils';
import { Add } from '../icons/svg';
import { useEffect, useState } from 'react';

const DEBUG_BORDER = 
{}
// {
//     borderColor: 'red',
//     borderWidth: 1,
// }

const InfoListItem = ({ icon, iconStyles, iconColor, color, content, state = true, onPress }) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
        },
        icon: {
            flexShrink: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 32,
            width: 32,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: state ? 'rgba(0,0,0,0.15)' : iconColor,

            backgroundColor: color,

            ...iconStyles
        },
        content: {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
    })

    const InnerView = () => (
        <View style={styles.container}>
            <View style={styles.icon}>
                <FontAwesome6 name={icon} size={14} color={state ? 'white' : iconColor} />
            </View>
            <View style={styles.content}>
                {content}
            </View>
        </View>
    )

    return (
        onPress 
            ? <TouchableOpacity onPress={onPress}><InnerView /></TouchableOpacity>
            : <View><InnerView /></View>            
    )
};

const listStyles = StyleSheet.create({
    text: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.8)',
        textAlign: 'right',
    },
    textInput: {
        width: '100%',
    }
})

const Hours = ({ openingHours }) => {
    return (
        <InfoListItem 
            icon='clock'
            color={ColorPalette.getHexColorByName('mango')}
            content={
                <Text style={listStyles.text}>
                    {openingHours}
                </Text>
            }
        />
    )
} 

const Address = ({ formattedAddress }) => {
    return (
        <InfoListItem 
            icon='map-location-dot'
            color={ColorPalette.getHexColorByName('englishViolet')}
            content={
                <Text numberOfLines={2} style={listStyles.text}>
                    {formattedAddress}
                </Text>
            }
        />
    )
}

const Note = ({ note }) => {
    return (
        <InfoListItem 
            icon='note-sticky'
            color={ColorPalette.getHexColorByName('sealBrown')}
            content={
                <TextInput 
                    editable
                    multiline
                    style={{...listStyles.text, ...listStyles.textInput}} 
                    placeholder='Add a note about this place' 
                    value={note?.trim()} 
                />
            }
        />
    )
}

const Visited = ({ visited, onPress }) => {
    const greenColor = ColorPalette.getHexColorByName('kellyGreen'); 
    return (
        <InfoListItem 
            icon='check'
            iconColor={visited ? 'white' : greenColor}
            color={visited ? greenColor : 'white'}
            state={visited}
            content={
                <Text style={listStyles.text}>{visited ? 'I\'ve been here' : 'I haven\'t been here yet'}</Text>
            }
            onPress={onPress}
        />
    )
}

const OpenInYelp = ({ onPress }) => {
    return (
        <InfoListItem
            icon='yelp'
            color={ColorPalette.getHexColorByName('yelpRed')}
            content={
                <Text style={listStyles.text}>
                    Open in Yelp
                </Text>
            }
            onPress={onPress}
        />
    )
}

const ItemSeparatorComponent = <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.15)', marginHorizontal: 12 }} />

const SectionHeader = ({ title, auxComponent }) => {
    const styles = StyleSheet.create({
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 7,
            // borderColor: 'green',
            // borderWidth: 1,
        },
        sectionHeaderText: {
            flexShrink: 1,
            fontSize: 13,
            color: 'rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
        },
        sectionAuxComponent: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
            <View style={styles.sectionAuxComponent}>{auxComponent}</View>
        </View>     
    )
}

export default BusinessSheet = ({ selectedBusiness }) => {
    console.log({selectedBusiness})
    const { alias, name, coordinates, categories, image_url, location } = selectedBusiness;
    const [note, setNote] = useState(selectedBusiness.note);
    const [visited, setVisited] = useState(selectedBusiness.visited);

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
            fontSize: 30,
            fontWeight: '700',
            alignSelf: 'flex-start',
            flexDirection: 'row',
            ...DEBUG_BORDER
        },
        subHeaderText: {
            color: 'white',
            fontSize: 17,
            opacity: 0.5,
        },
        categoryText: {
            fontSize: 17,
            alignSelf: 'flex-start',
        }
    });

    const INFO_LIST_SECTIONS_DATA = [
        {
            title: 'details',
            data: [
                <FlatList 
                    ItemSeparatorComponent={ItemSeparatorComponent}
                    data={[
                        <Address formattedAddress={formattedAddress} />,
                        <Hours openingHours={openingHours} />,
                    ]}
                    renderItem={({ item }) => item}
                    style={{
                        borderRadius: 10,
                        borderColor: 'rgba(0,0,0,0.15)',
                        borderWidth: 1,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        paddingVertical: 4,
                    }}  
                />
            ]
        },
        {
            title: 'your info',
            data: [
                <FlatList 
                    ItemSeparatorComponent={ItemSeparatorComponent}
                    data={[
                        <Note note={note} />,
                        <Visited visited={visited} onPress={() => setVisited(!visited)} />,
                        <OpenInYelp onPress={() => Linking.openURL(`https://www.yelp.com/biz/${alias}`)} />,
                    ]}
                    renderItem={({ item }) => item}
                    style={{
                        borderRadius: 10,
                        borderColor: 'rgba(0,0,0,0.15)',
                        borderWidth: 1,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        paddingVertical: 4,
                    }}  
                />
            ]
        }
    ]

    const INFO_LIST_DATA = [
        {
            icon: 'map-location-dot',
            color: ColorPalette.getHexColorByName('englishViolet'),
            content: <Text numberOfLines={2} style={{ fontSize: 14, color: 'rgba(0,0,0,0.8)', textAlign: 'right'}}>{formattedAddress}</Text>
        },
        { 
            icon: 'clock',
            color: ColorPalette.getHexColorByName('mango'),
            content: <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.8)' }}>{openingHours}</Text>,
        },
        { 
            icon: 'note-sticky',
            color: ColorPalette.getHexColorByName('sealBrown'),
            content: <TextInput style={{ width: '100%', textAlign: 'right', fontSize: 14, color: 'rgba(0,0,0,0.8)' }} placeholder='Add a note about this place' value={note ? note?.trim() : null} />,
        },
        { 
            icon: 'check',
            color: ColorPalette.getHexColorByName('kellyGreen'),
            content: <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.8)' }}>{visited ? 'I\'ve been here' : 'I haven\'t been here'}</Text>,
        },
        { 
            icon: 'yelp',
            color: ColorPalette.getHexColorByName('yelpRed'),
            content: <OpenInYelp />,
        },
    ]

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                gap: 16,
                width: '100%',
            }}>
                {/* <View style={{
                    gap: 8,
                }}>
                    <Text style={{ textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)'}}>details</Text>
                    <FlatList 
                        ItemSeparatorComponent={<View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.15)', marginHorizontal: 12,}} />}
                        data={INFO_LIST_DATA.slice(0, 2)}
                        renderItem={({ item }) => <InfoListItem {...item} />}
                        style={{
                            borderRadius: 10,
                            borderColor: 'rgba(0,0,0,0.15)',
                            borderWidth: 1,
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            paddingVertical: 4,

                            // shadowColor: 'black',
                            // shadowOpacity: 0.33,
                            // shadowOffset: {
                            //     width: 0,
                            //     height: 2,
                            // },
                            // shadowRadius: 4,
                        }}       
                    />
                </View>
                <View style={{
                    gap: 8,
                }}>
                    <Text style={{ textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)'}}>additional info</Text>
                    <FlatList 
                        ItemSeparatorComponent={<View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.15)', marginHorizontal: 12,}} />}
                        data={INFO_LIST_DATA.slice(2, 5)}
                        renderItem={({ item }) => <InfoListItem {...item} />}
                        style={{
                            borderRadius: 10,
                            borderColor: 'rgba(0,0,0,0.15)',
                            borderWidth: 1,
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            paddingVertical: 4,
                        }}       
                    />
                </View> */}
                <SectionList 
                    // SectionSeparatorComponent={() => <View style={{ paddingVertical: 12, }} />}
                    renderSectionHeader={({ section: { title }}) => <SectionHeader title={title} />}
                    renderSectionFooter={() => <View style={{ height: 16}} />}
                    sections={INFO_LIST_SECTIONS_DATA}
                    renderItem={({ item }) => item}
                />
            </View>
        </BottomSheetView>
        </TouchableWithoutFeedback>
    )
}