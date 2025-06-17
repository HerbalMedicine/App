import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CardPlanta({ planta }) {
    const { nombreComun, descripcion, imagen } = planta;
    const router = useRouter();

    const onCardPress = () => {
        router.push({
            pathname: 'plantas/DetallePlanta',
            params: { planta: JSON.stringify(planta) },
        });
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onCardPress}
            activeOpacity={0.8}
        >
            <Image
                source={{
                    uri: imagen && imagen.length > 0
                        ? imagen[0]
                        : 'https://via.placeholder.com/100',
                }}
                style={styles.cardImage}
            />
            <View style={styles.overlay}>
                <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{nombreComun}</Text>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                        {descripcion}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        height: 160,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#1B1B1B',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
    },
    textContainer: {
        alignItems: 'center',
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    cardDescription: {
        color: '#DDDDDD',
        fontSize: 14,
        textAlign: 'center',
    },
});
