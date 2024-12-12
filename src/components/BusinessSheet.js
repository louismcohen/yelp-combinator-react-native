import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SectionList,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  Pressable,
} from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import ColorPalette from '../styles/ColorPalette';
import { FontAwesome6 } from '@expo/vector-icons';

import { parseHours } from '../utils/utils';
import { Add } from '../icons/svg';
import React, { useEffect, useState } from 'react';
import {
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const DEBUG_BORDER = {};
// {
//     borderColor: 'red',
//     borderWidth: 1,
// }

const InfoListItem = ({
  icon,
  iconStyles,
  iconColor,
  color,
  content,
  state = true,
  onPress,
  children,
}) => {
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
      justifyContent: 'center',
      alignItems: 'center',
      height: 32,
      width: 32,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: state ? 'rgba(0,0,0,0.15)' : iconColor,

      backgroundColor: color,

      ...iconStyles,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
  });

  const InnerView = () => (
    <View style={styles.container}>
      <View style={styles.icon}>
        <FontAwesome6
          name={icon}
          size={14}
          color={state ? 'white' : iconColor}
        />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress}>
      <InnerView />
    </TouchableOpacity>
  ) : (
    <View>
      <InnerView />
    </View>
  );
};

const listStyles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.8)',
    textAlign: 'right',
  },
  textInput: {
    width: '100%',
  },
  warningText: {
    fontWeight: '700',
    color: ColorPalette.getHexColorByName('yelpRed'),
  },
  successText: {
    fontWeight: '700',
    color: ColorPalette.getHexColorByName('kellyGreen'),
  },
});

const Hours = ({ openingMessage, hours }) => {
  console.log(hours[0].is_open_now);
  const styledMessage = hours[0].is_open_now ? (
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ ...listStyles.text, ...listStyles.successText }}>
        Open
      </Text>
      <Text style={listStyles.text}>{openingMessage.replace('Open', '')}</Text>
    </View>
  ) : (
    <View style={{ flexDirection: 'column' }}>
      <Text style={{ ...listStyles.text, ...listStyles.warningText }}>
        Closed
      </Text>
      <Text style={listStyles.text}>{openingMessage}</Text>
    </View>
  );

  return (
    <InfoListItem icon='clock' color={ColorPalette.getHexColorByName('mango')}>
      {styledMessage}
    </InfoListItem>
  );
};

const Address = ({ formattedAddress, onPress }) => {
  return (
    <InfoListItem
      icon='map-location-dot'
      color={ColorPalette.getHexColorByName('englishViolet')}
      onPress={onPress}
    >
      <Text selectable numberOfLines={2} style={listStyles.text}>
        {formattedAddress}
      </Text>
    </InfoListItem>
  );
};

const Note = ({ note }) => {
  return (
    <InfoListItem
      icon='note-sticky'
      color={ColorPalette.getHexColorByName('sealBrown')}
    >
      <TextInput
        editable
        multiline
        style={{ ...listStyles.text, ...listStyles.textInput }}
        placeholder='Add a note about this place'
        value={note?.trim()}
      />
    </InfoListItem>
  );
};

const Visited = ({ visited, onPress }) => {
  const greenColor = ColorPalette.getHexColorByName('kellyGreen');
  return (
    <InfoListItem
      icon='check'
      iconColor={visited ? 'white' : greenColor}
      color={visited ? greenColor : 'white'}
      state={visited}
      onPress={onPress}
    >
      <Text style={listStyles.text}>
        {visited ? "I've been here" : "I haven't been here yet"}
      </Text>
    </InfoListItem>
  );
};

const OpenInYelp = ({ onPress }) => {
  return (
    <InfoListItem
      icon='yelp'
      color={ColorPalette.getHexColorByName('yelpRed')}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={listStyles.text}>Open in Yelp</Text>
        <FontAwesome6
          name='up-right-from-square'
          size={listStyles.text.fontSize}
          color={listStyles.text.color}
        />
      </View>
    </InfoListItem>
  );
};

const ItemSeparatorComponent = (
  <View
    style={{
      height: 1,
      backgroundColor: 'rgba(0,0,0,0.15)',
      marginHorizontal: 12,
    }}
  />
);

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
  );
};

const formattedAddress = (location, coordinates) => {
  if (!location) return null;

  const { address1, city, state, zip_code } = location;

  let address = [];
  if (address1) {
    address.push(location.address1, '\n');
  } else if (!address1) {
    address.push(
      coordinates.latitude.toFixed(5),
      ', ',
      coordinates.longitude.toFixed(5),
      '\n'
    );
  }
  if (city) {
    address.push(city);
  }
  if (!city && state) {
    address.push(state, ' ');
  } else if (city && state) {
    address.push(', ', state, ' ');
  }
  if (zip_code) {
    address.push(zip_code);
  }

  return address.join('').trim();
};

const PHOTO_HEIGHT = 180;

export const BusinessImageBackground = ({ business }) => {
  if (!business) return;

  const [isPressed, setIsPressed] = useState(false);

  const styles = StyleSheet.create({
    heroImage: {
      width: '100%',
      height: PHOTO_HEIGHT,
      resizeMode: 'cover',
      position: 'relative',
    },
    handleContainer: {
      position: 'absolute',
      //   top: 8,
      flex: 1,
      paddingVertical: 8,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    handle: {
      height: 5,
      width: 72,
      backgroundColor: 'rgba(0, 0, 0, 1.0)',
      borderRadius: 999,
      opacity: isPressed ? 0.67 : 0.5,
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
      ...DEBUG_BORDER,
    },
    subHeaderText: {
      color: 'white',
      fontSize: 17,
      opacity: 0.5,
    },
    categoryText: {
      fontSize: 17,
      alignSelf: 'flex-start',
    },
  });

  const { image_url, name, categories } = business;

  return (
    <ImageBackground style={styles.heroImage} source={{ uri: image_url }}>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        locations={[0, 0.8]}
        style={{
          ...StyleSheet.absoluteFillObject,
          height: PHOTO_HEIGHT,
        }}
      >
        <View style={styles.infoContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{name}</Text>
            {categories ? (
              <Text style={styles.subHeaderText}>
                {categories.map((category) => category.title).join(', ')}
              </Text>
            ) : null}
          </View>
        </View>
      </LinearGradient>
      <Pressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={styles.handleContainer}
      >
        <View style={styles.handle} />
      </Pressable>
    </ImageBackground>
  );
};

const BusinessSheet = ({ selectedBusiness }) => {
  if (!selectedBusiness) return null;
  console.log({ selectedBusiness });
  const {
    alias,
    name,
    coordinates,
    categories,
    image_url,
    location,
    display_address,
    openingMessage,
    hours,
  } = selectedBusiness;
  console.log({ openingMessage, hours });
  const [note, setNote] = useState(selectedBusiness.note);
  const [visited, setVisited] = useState(selectedBusiness.visited || false);

  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    bottomSheetContainer: {
      // flex: 1,
      borderRadius: 16,
      overflow: 'hidden',
      paddingBottom: insets.bottom,
      alignItems: 'center',
      // paddingHorizontal: 16,
      ...DEBUG_BORDER,
    },
  });

  const INFO_LIST_SECTIONS_DATA = [
    {
      title: 'details',
      data: [
        <FlatList
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={[
            <Address
              formattedAddress={formattedAddress(location, coordinates)}
              // onPress={() => Linking.openURL(encodeURI(`https://www.google.com/maps/@?api=1&map_action=map&query=${location.address1}+${location.city}+${location.state}+${location.zip_code}&${coordinates.latitude},${coordinates.longitude}`))}
            />,
            <Hours openingMessage={openingMessage} hours={hours} />,
          ]}
          renderItem={({ item }) => item}
          style={{
            borderRadius: 10,
            borderColor: 'rgba(0,0,0,0.15)',
            borderWidth: 1,
            backgroundColor: 'rgba(0,0,0,0.05)',
            paddingVertical: 4,
          }}
        />,
      ],
    },
    {
      title: 'additional info',
      data: [
        <FlatList
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={[
            <Note note={note} />,
            <Visited visited={visited} onPress={() => setVisited(!visited)} />,
            <OpenInYelp
              onPress={() =>
                Linking.openURL(`https://www.yelp.com/biz/${alias}`)
              }
            />,
          ]}
          renderItem={({ item }) => item}
          style={{
            borderRadius: 10,
            borderColor: 'rgba(0,0,0,0.15)',
            borderWidth: 1,
            backgroundColor: 'rgba(0,0,0,0.05)',
            paddingVertical: 4,
          }}
        />,
      ],
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BottomSheetView style={styles.bottomSheetContainer}>
        <BusinessImageBackground business={selectedBusiness} />
        <View
          style={{
            padding: 16,
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: 16,
            width: '100%',
          }}
        >
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
            renderSectionHeader={({ section: { title } }) => (
              <SectionHeader title={title} />
            )}
            renderSectionFooter={() => <View style={{ height: 16 }} />}
            sections={INFO_LIST_SECTIONS_DATA}
            renderItem={({ item }) => item}
            scrollEnabled={false}
          />
        </View>
      </BottomSheetView>
    </TouchableWithoutFeedback>
  );
};

export default BusinessSheet;
