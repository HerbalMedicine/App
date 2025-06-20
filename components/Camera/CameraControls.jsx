import Slider from '@react-native-community/slider';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Button from './ButtonCamera';

export default function CameraControls({ onPictureTaken, onClose }) {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();

    const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [cameraProps, setCameraProps] = useState({
        zoom: 0,
        facing: 'back',
        flash: 'on',
        animateShutter: false,
        enableTorch: false
    });
    const [image, setImage] = useState(null);
    const [previousImage, setPreviousImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const cameraRef = useRef(null);

    useEffect(() => {
        if (
            cameraPermission?.granted &&
            mediaLibraryPermissionResponse?.status === 'granted'
        ) {
            getLastSavedImage();
        }
    }, [cameraPermission, mediaLibraryPermissionResponse]);

    if (!cameraPermission || !mediaLibraryPermissionResponse) return <View />;
    if (!cameraPermission.granted || mediaLibraryPermissionResponse.status !== 'granted') {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                    Se requieren permisos de cámara y galería.
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        requestCameraPermission();
                        requestMediaLibraryPermission();
                    }}
                >
                    <Text style={styles.buttonText}>Conceder permisos</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openSettings()}>
                    <Text style={{ color: 'blue', marginTop: 10, textAlign: 'center' }}>
                        Abrir configuración del sistema
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleProperty = (prop, option1, option2) => {
        setCameraProps((current) => ({
            ...current,
            [prop]: current[prop] === option1 ? option2 : option1
        }));
    };

    const zoomIn = () => {
        setCameraProps((current) => ({
            ...current,
            zoom: Math.min(current.zoom + 0.1, 1)
        }));
    };

    const zoomOut = () => {
        setCameraProps((current) => ({
            ...current,
            zoom: Math.max(current.zoom - 0.1, 0)
        }));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const picture = await cameraRef.current.takePictureAsync();
                setImage(picture.uri);
            } catch (err) {
                console.log('Error while taking the picture: ', err);
            }
        }
    };

    const savePicture = async () => {
        if (image) {
            try {
                setIsSaving(true);

                // 🚫 Ya no intentamos guardar en galería ni acceder a assetInfo
                onPictureTaken?.(image);
                onClose?.();

                setImage(null);
            } catch (err) {
                console.log('Error al procesar la imagen:', err);
                Alert.alert('Error', 'No se pudo procesar la imagen.');
            } finally {
                setIsSaving(false);
            }
        }
    };



    const getLastSavedImage = async () => {
        const dcimAlbum = await MediaLibrary.getAlbumAsync('DCIM');
        if (dcimAlbum) {
            const { assets } = await MediaLibrary.getAssetsAsync({
                album: dcimAlbum,
                sortBy: [[MediaLibrary.SortBy.creationTime, false]],
                mediaType: MediaLibrary.MediaType.photo,
                first: 1
            });

            if (assets.length > 0) {
                const assetInfo = await MediaLibrary.getAssetInfoAsync(assets[0].id);
                setPreviousImage(assetInfo.localUri || assetInfo.uri);
            } else {
                setPreviousImage(null);
            }
        }
    };

    return (
        <View style={styles.container}>
            {!image ? (
                <>
                    <View style={styles.topControlsContainer}>
                        <Button icon={cameraProps.flash === 'on' ? 'flash-on' : 'flash-off'} onPress={() => toggleProperty('flash', 'on', 'off')} />
                        <Button icon="animation" color={cameraProps.animateShutter ? 'white' : '#404040'} onPress={() => toggleProperty('animateShutter', true, false)} />
                        <Button icon={cameraProps.enableTorch ? 'flashlight-on' : 'flashlight-off'} onPress={() => toggleProperty('enableTorch', true, false)} />
                    </View>

                    <CameraView
                        style={styles.camera}
                        zoom={cameraProps.zoom}
                        facing={cameraProps.facing}
                        flash={cameraProps.flash}
                        animateShutter={cameraProps.animateShutter}
                        enableTorch={cameraProps.enableTorch}
                        ref={cameraRef}
                    />

                    <View style={styles.sliderContainer}>
                        <Button icon="zoom-out" onPress={zoomOut} />
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1}
                            value={cameraProps.zoom}
                            onValueChange={(value) => setCameraProps((current) => ({ ...current, zoom: value }))}
                            step={0.1}
                        />
                        <Button icon="zoom-in" onPress={zoomIn} />
                    </View>

                    <View style={styles.bottomControlsContainer}>
                        <TouchableOpacity onPress={() => previousImage && setImage(previousImage)}>
                            <Image source={{ uri: previousImage }} style={styles.previousImage} />
                        </TouchableOpacity>
                        <Button icon="camera" size={60} style={{ height: 60 }} onPress={takePicture} />
                        <Button icon="flip-camera-ios" size={40} onPress={() => toggleProperty('facing', 'front', 'back')} />
                    </View>
                </>
            ) : (
                <>
                    <Image source={{ uri: image }} style={styles.camera} />
                    <View style={styles.bottomControlsContainer}>
                        <Button icon="flip-camera-android" onPress={() => setImage(null)} />
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 60, width: 60 }}>
                            {isSaving ? (
                                <ActivityIndicator size="large" color="#64AF46" />
                            ) : (
                                <Button icon="check" onPress={savePicture} />
                            )}
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', marginTop: 30 },
    topControlsContainer: {
        height: 100,
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: { backgroundColor: 'blue', padding: 10, margin: 10, borderRadius: 5 },
    buttonText: { color: 'white', fontSize: 16 },
    camera: { flex: 1, width: '100%' },
    slider: { flex: 1, marginHorizontal: 10 },
    sliderContainer: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
        flexDirection: 'row',
    },
    bottomControlsContainer: {
        height: 100,
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    previousImage: { width: 60, height: 60, borderRadius: 50 },
});
