import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CardPlanta from './../../components/shared/CardPlanta';
import Colors from './../../shared/Colors';
import { db } from './../../shared/firebase';

const { width } = Dimensions.get('window');

export default function DetalleVivero() {
    const params = useLocalSearchParams();
    const vivero = JSON.parse(params.vivero);

    const {
        nombre,
        direccion,
        latitud,
        longitud,
        foto,
        telefono,
        horario,
        descripcion,
        plantasCatalogo,
    } = vivero;

    const router = useRouter();

    const [plantas, setPlantas] = useState([]);
    const [loadingPlantas, setLoadingPlantas] = useState(true);

    const fetchPlantas = async () => {
        try {
            if (plantasCatalogo && plantasCatalogo.length > 0) {
                const plantasRef = collection(db, 'HM-Plantas');
                const q = query(plantasRef, where('__name__', 'in', plantasCatalogo));
                const querySnapshot = await getDocs(q);

                const plantasData = [];
                querySnapshot.forEach((doc) => {
                    plantasData.push({ id: doc.id, ...doc.data() });
                });
                setPlantas(plantasData);
            }
        } catch (error) {
            console.error('Error al obtener plantas del catálogo:', error);
        } finally {
            setLoadingPlantas(false);
        }
    };

    useEffect(() => {
        fetchPlantas();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    {nombre}
                </Text>
            </View>

            {/* Mapa */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: latitud,
                        longitude: longitud,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: latitud,
                            longitude: longitud,
                        }}
                        title={nombre}
                        description={direccion}
                    />
                </MapView>
            </View>

            {/* Datos del vivero */}
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Dirección:</Text>
                <Text style={styles.listItem}>{direccion}</Text>

                {telefono && (
                    <>
                        <Text style={styles.sectionTitle}>Teléfono:</Text>
                        <Text style={styles.listItem}>{telefono}</Text>
                    </>
                )}

                {horario && (
                    <>
                        <Text style={styles.sectionTitle}>Horario:</Text>
                        <Text style={styles.listItem}>{horario}</Text>
                    </>
                )}

                {descripcion && (
                    <>
                        <Text style={styles.sectionTitle}>Descripción:</Text>
                        <Text style={styles.listItem}>{descripcion}</Text>
                    </>
                )}

                {/* Catálogo de plantas */}
                <Text style={styles.sectionTitle}>Catálogo de plantas:</Text>

                {loadingPlantas ? (
                    <Text style={styles.listItem}>Cargando plantas...</Text>
                ) : plantas.length > 0 ? (
                    plantas.map((planta) => (
                        <CardPlanta key={planta.id} planta={planta} />
                    ))
                ) : (
                    <Text style={styles.listItem}>No hay plantas en el catálogo.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F3F0',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: Colors.GREEN,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        flexShrink: 1,
    },
    mapContainer: {
        width: '100%',
        height: 200,
        marginBottom: 16,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginTop: 12,
        marginBottom: 4,
    },
    listItem: {
        fontSize: 15,
        color: '#444',
        marginBottom: 8,
    },
});
