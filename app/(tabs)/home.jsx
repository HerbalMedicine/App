import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraControls from '../../components/Camera/CameraControls';
import CardPlanta from './../../components/shared/CardPlanta';
import { db } from './../../shared/firebase';

const nameMap = {
  "Alstonia_Scholaris_(P2)_diseased": "Alstonia enferma",
  "Alstonia_Scholaris_(P2)_healthy": "Alstonia sana",
  "Arjun_(P1)_diseased": "Arjun enfermo",
  "Arjun_(P1)_healthy": "Arjun sano",
  "Chinar_(P11)_diseased": "Chinar enfermo",
  "Chinar_(P11)_healthy": "Chinar sano",
  "Gauva_(P3)_diseased": "Guayaba enferma",
  "Gauva_(P3)_healthy": "Guayaba sana",
  "Jamun_(P5)_diseased": "Jamun enfermo",
  "Jamun_(P5)_healthy": "Jamun sano",
  "Jatropha_(P6)_diseased": "Jatropha enferma",
  "Jatropha_(P6)_healthy": "Jatropha sana",
  "Lemon_(P10)_diseased": "Limón enfermo",
  "Lemon_(P10)_healthy": "Limón",
  "Mango_(P0)_diseased": "Mango enfermo",
  "Mango_(P0)_healthy": "Mango",
  "Pomegranate_(P9)_diseased": "Granada enferma",
  "Pomegranate_(P9)_healthy": "Granada",
  "Pongamia_Pinnata_(P7)_diseased": "Pongamia enferma",
  "Pongamia_Pinnata_(P7)_healthy": "Pongamia"
};

export default function Home() {
  const [showCamera, setShowCamera] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [imageFadeAnim] = useState(new Animated.Value(0));
  const [planta, setPlanta] = useState(null);
  const [estadoHoja, setEstadoHoja] = useState(null);
  const [nombreDetectado, setNombreDetectado] = useState(null);

  const getBorderColor = () => {
    if (estadoHoja === 'Sana') return '#4CAF50'; // verde
    if (estadoHoja === 'Enferma') return '#E53935'; // rojo
    return '#ddd'; // neutro por defecto
  };


  const animateImage = () => {
    Animated.timing(imageFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleImageSet = (uri) => {
    console.log("Imagen recibida URI:", uri); // 👈 para depurar
    setImageUri(uri);
    imageFadeAnim.setValue(0);
    animateImage();
    sendToModel(uri);
  };


  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleImageSet(result.assets[0]?.uri || null);
    } else {
      Alert.alert('Imagen no seleccionada', 'No se seleccionó ninguna imagen.');
    }
  };


  useEffect(() => {
    if (permissionsGranted) {
      // getLocation(); // <-- si tienes la función, descoméntala
    }
  }, [permissionsGranted]);


  const sendToModel = async (uri) => {
    const formData = new FormData();
    formData.append('image', {
      uri,
      name: 'leaf.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await fetch('http://192.168.151.146:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      const predOriginal = result.prediccion;

      // 🧠 Mapear al nombre visible
      const nombreMapeado = nameMap[predOriginal] || predOriginal;

      // 🩺 Separar el diagnóstico (sano o enfermo)
      const esSano = predOriginal.includes('healthy') ? 'Sana' : 'Enferma';
      setEstadoHoja(esSano);

      // 🔎 Eliminar palabras como "enfermo" o "sana" para buscar solo por el nombre base
      const nombreComun = nombreMapeado.replace(/ enferma| enfermo| sana/i, '').trim();

      // 🔍 Buscar por el campo "nombreComun" en Firestore
      const q = query(
        collection(db, 'HM-Plantas'),
        where('nombreComun', '==', nombreComun)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const plantaData = querySnapshot.docs[0].data();
        setPlanta(plantaData);
      } else {
        Alert.alert('No encontrado', `No se encontró información para "${nombreComun}"`);
        setPlanta(null);
      }
    } catch (error) {
      console.error('Error al enviar imagen o consultar Firestore:', error);
      Alert.alert('Error', 'No se pudo completar la operación.');
    }
  };



  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerLogin}>
          <Text style={styles.welcomeText}>Herbal Medicine</Text>
        </View>

        <View style={{ padding: 10, width: '85%', alignSelf: 'center' }}>
          <TouchableOpacity
            style={[styles.buttonPH, { backgroundColor: '#141414' }]}
            onPress={() => setShowCamera(true)}
          >
            <Ionicons name="camera" size={30} color="white" style={{ marginRight: 15 }} />
            <Text style={styles.buttonTextPH}>Tomar Foto</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 10, width: '85%', alignSelf: 'center' }}>
          <TouchableOpacity
            style={[styles.buttonPH, { backgroundColor: '#234f37' }]}
            onPress={selectImage}
          >
            <Ionicons name="cloud-upload" size={30} color="white" style={{ marginRight: 15 }} />
            <Text style={styles.buttonTextPH}>Cargar Imagen</Text>
          </TouchableOpacity>
        </View>

        {imageUri && (
          <View style={[styles.imageContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: estadoHoja === 'Sana' ? '#E8F5E9' :
              estadoHoja === 'Enferma' ? '#FFEBEE' : 'black',
          }]}>
            <Animated.Image
              source={{ uri: imageUri }}
              style={[styles.image, { opacity: imageFadeAnim }]}
            />
          </View>
        )}
        {estadoHoja && (
          <View
            style={[
              styles.diagnosticoBox,
              {
                backgroundColor: estadoHoja === 'Sana' ? '#E8F5E9' : '#FFEBEE',
                borderColor: estadoHoja === 'Sana' ? '#4CAF50' : '#E53935',
              }
            ]}
          >
            <Text
              style={[
                styles.diagnosticoTexto,
                { color: estadoHoja === 'Sana' ? '#2E7D32' : '#C62828' }
              ]}
            >
              {estadoHoja === 'Sana' ? '✅' : '⚠️'} Diagnóstico: {estadoHoja}
            </Text>
          </View>
        )}

        {planta && (

          <CardPlanta planta={planta} />

        )}
        <Modal
          visible={showCamera}
          animationType="slide"
          onRequestClose={() => setShowCamera(false)}
        >
          <CameraControls
            onPictureTaken={(uri) => handleImageSet(uri)}
            onClose={() => setShowCamera(false)}
          />
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F3FDEC',
  },
  headerLogin: {
    backgroundColor: '#234f37',
    width: '100%',
    height: 75,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 30,
    color: '#f6e8bf',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  buttonPH: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 17,
    borderRadius: 15,
  },
  buttonTextPH: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: 'black',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginHorizontal: 20,
  },
  image: {
    width: 250,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  diagnosticoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  diagnosticoTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  diagnosticoBox: {
  marginTop: 15,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 12,
  borderWidth: 1.5,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '80%',
  marginBottom:15
},
diagnosticoTexto: {
  fontSize: 18,
  fontWeight: '600',
  textAlign: 'center',
},


});
