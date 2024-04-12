import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';

const ClusterMarker = ({ properties, geometry, id, onPress, tracksViewChanges }) => {
  const points = properties.point_count

  let size;
  if (points < 100) {
    size = 40;
  } else if (points < 1000) {
    size = 48;
  } else {
    size = 54;
  }

    const styles = StyleSheet.create({
      container: {
        borderRadius: 999,
        borderWidth: 3,
        // borderColor: 'rgba(20,10,255,0.2)',
        borderColor: 'rgba(0,0,0,0.5',

        backgroundColor: 'rgba(0,0,0,0.75)',

        width: size,
        height: size,

        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: 'rgba(0,0,0,1.0)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.7,
        shadowRadius: 10,

        elevation: 5,
      },
      text: {
        fontSize: 17,
        lineHeight: 17,
        fontWeight: '700',
        textAlign: 'center',
        color: 'white',
      }
    });
    

    const coordinates = {
      longitude: geometry.coordinates[0],
      latitude: geometry.coordinates[1],
    }

    return (
      <Marker
        key={id}
        coordinate={coordinates}
        onPress={onPress}
        style={{ zIndex: points + 1 }}
        tracksViewChanges={tracksViewChanges}
      >
        <TouchableOpacity>
            <View style={styles.container}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'transparent']}
                  locations={[0, 0.9]}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    height: size,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 999,
                  }}
                  >
                  <Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>{points}</Text>
                </LinearGradient>
            </View>
            
        </TouchableOpacity>
      </Marker>
    )
}

export default ClusterMarker;
