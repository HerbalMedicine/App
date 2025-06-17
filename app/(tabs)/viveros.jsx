import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import Colors from '../../shared/Colors';
import CardVivero from './../../components/shared/CardVivero';
import { db } from './../../shared/firebase';

export default function Viveros() {
    const [viveros, setViveros] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchViveros = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'HM-Viveros')); // tu colección de Viveros
            const viverosData = [];
            querySnapshot.forEach((doc) => {
                viverosData.push({ id: doc.id, ...doc.data() });
            });
            setViveros(viverosData);
        } catch (error) {
            console.error('Error al obtener viveros:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchViveros();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#2E7D32" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={viveros}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CardVivero vivero={item} />}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Viveros</Text>
                    </View>
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay viveros disponibles.</Text>
                }
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F3F0', // gris claro de fondo
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    headerContainer: {
        backgroundColor: Colors.GREEN,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.HONEY,
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontSize: 16,
    },
    listContent: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
});
