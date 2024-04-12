import { StyleSheet, View, Text, Image } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEBUG_BORDER = 
{}
// {
//     borderColor: 'red',
//     borderWidth: 1,
// }

export default BusinessSheet = ({ selectedBusiness }) => {
    const { name, categories, note, image_url } = selectedBusiness;

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
            height: 128,
            resizeMode: 'cover',
        },
        infoContainer: {
            padding: 16,
            width: '100%',
            gap: 16,
            ...DEBUG_BORDER
        },
        headerContainer: {
            flexDirection: 'column',
            alignSelf: 'flex-start',
            ...DEBUG_BORDER
        },
        headerText: {
            fontSize: 24,
            fontWeight: '700',
            alignSelf: 'flex-start',
            flexDirection: 'row',
            ...DEBUG_BORDER
        },
        noteText: {
            fontSize: 17,
            opacity: 0.5,
        },
        categoryText: {
            fontSize: 17,
            alignSelf: 'flex-start',
        }
    });

    return (
        <BottomSheetView style={styles.bottomSheetContainer}>
            <Image style={styles.heroImage} source={{ uri: image_url }} />
            <View style={styles.infoContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{name}</Text>
                    {note ? <Text style={styles.noteText}>{note}</Text> : null}
                </View>
                { categories 
                    ? 
                        <Text style={styles.categoryText}>{categories.map((category) => category.title).join(', ')}</Text>
                    
                    : null
                }
            </View>

        </BottomSheetView>
    )
}