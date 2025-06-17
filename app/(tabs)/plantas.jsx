import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import CardPlanta from './../../components/shared/CardPlanta';
import Colors from './../../shared/Colors';
import { db } from './../../shared/firebase';

export default function Plantas() {
    const [plantas, setPlantas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlantas = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'HM-Plantas')); // tu colección
            const plantasData = [];
            querySnapshot.forEach((doc) => {
                plantasData.push({ id: doc.id, ...doc.data() });
            });
            setPlantas(plantasData);
        } catch (error) {
            console.error('Error al obtener plantas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlantas();
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
                data={plantas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CardPlanta planta={item} />}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Catalogo</Text>
                    </View>
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay plantas disponibles.</Text>
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
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.GREEN,
        textAlign: 'center',
        marginVertical: 16,
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
    headerContainer: {
        backgroundColor: Colors.GREEN,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:10
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color:Colors.HONEY,
        textAlign: 'center',
    },

});
