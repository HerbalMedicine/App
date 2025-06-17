import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview'; // import WebView
import Colors from './../../shared/Colors';

const { width } = Dimensions.get('window');

export default function DetallePlanta() {
    const params = useLocalSearchParams();
    const planta = JSON.parse(params.planta);

    const {
        nombreComun,
        nombreCientifico,
        descripcion,
        propiedades,
        usosComunes,
        cuidados,
        imagen,
        video, // añadimos video
    } = planta;

    const router = useRouter();

    // FILTRAMOS SOLO IMÁGENES VÁLIDAS
    const validImages = imagen.filter(img => img && img !== '');

    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event) => {
        const slide = Math.ceil(
            event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
        );
        if (slide !== activeIndex) {
            setActiveIndex(slide);
        }
    };

    // State para controlar si mostramos el WebView
    const [showVideo, setShowVideo] = useState(false);

    // Función para obtener el ID del video de YouTube
    const extractYoutubeID = (url) => {
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    return (
        <View style={styles.container}>
            {/* Botón Volver + Nombre planta */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    {nombreComun}
                </Text>
            </View>

            {/* Carrusel de imágenes */}
            <View style={styles.carouselContainer}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    ref={scrollRef}
                    style={styles.carousel}
                >
                    {validImages.map((img, index) => (
                        <Image
                            key={index}
                            source={{ uri: img }}
                            style={styles.carouselImage}
                        />
                    ))}
                </ScrollView>

                {/* Dots */}
                <View style={styles.dotsContainer}>
                    {validImages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index ? styles.activeDot : null,
                            ]}
                        />
                    ))}
                </View>
            </View>

           

            {/* Contenido */}
            <ScrollView style={styles.content}>
                <Text style={styles.title}>{nombreComun}</Text>
                <Text style={styles.subtitle}>{nombreCientifico}</Text>
                <Text style={styles.description}>{descripcion}</Text>

                {propiedades && propiedades.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Propiedades:</Text>
                        {propiedades.map((prop, index) => (
                            <Text key={index} style={styles.listItem}>• {prop}</Text>
                        ))}
                    </>
                )}

                {usosComunes && usosComunes.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Usos Comunes:</Text>
                        {usosComunes.map((uso, index) => (
                            <Text key={index} style={styles.listItem}>• {uso}</Text>
                        ))}
                    </>
                )}

                {cuidados && (
                    <>
                        <Text style={styles.sectionTitle}>Cuidados:</Text>
                        <Text style={styles.listItem}>{cuidados}</Text>
                    </>
                )}
                 {/* Video Preview */}
            {video && video !== '' && extractYoutubeID(video) && (
                <View style={styles.videoContainer}>
                    {showVideo ? (
                        // Si showVideo = true → mostramos el WebView
                        <WebView
                            style={styles.webView}
                            source={{
                                uri: `https://www.youtube.com/embed/${extractYoutubeID(video)}?autoplay=1&modestbranding=1`,
                            }}
                            allowsFullscreenVideo
                        />
                    ) : (
                        // Si showVideo = false → mostramos la miniatura con botón Play
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => setShowVideo(true)}
                        >
                            <Image
                                source={{
                                    uri: `https://img.youtube.com/vi/${extractYoutubeID(video)}/0.jpg`,
                                }}
                                style={styles.videoThumbnail}
                            />
                            <View style={styles.playIconOverlay}>
                                <Ionicons name="play-circle" size={64} color="#FFFFFF" />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F3F0', // gris verdoso suave
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
    carouselContainer: {
        position: 'relative',
    },
    carousel: {
        height: 250,
    },
    carouselImage: {
        width: width,
        height: 250,
        resizeMode: 'cover',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#888',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#2E7D32',
        width: 10,
        height: 10,
    },
    videoContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom:40,
        marginTop:10
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    playIconOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    webView: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#555',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
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
        marginBottom: 2,
    },
});
