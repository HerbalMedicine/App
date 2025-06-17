import { useRouter } from "expo-router"; // 👈 Importante
import { Dimensions, Image, Text, View } from "react-native";
import Button from '../components/shared/Button';
import Colors from '../shared/Colors';

export default function Index() {
  const router = useRouter(); // 👈 Instanciamos router

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Image
        source={require('./../assets/images/Fondo.jpg')}
        style={{
          width: '100%',
          height: Dimensions.get('screen').height
        }}
      />
      <View style={{
        position: 'absolute',
        height: Dimensions.get('screen').height,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: 20
      }}>
        <Image
          source={require('./../assets/images/Logo.png')}
          style={{
            width: 200,
            height: 200,
            marginTop: 100
          }}
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: Colors.HONEY
          }}>AI Plantas Medicinales</Text>
        <Text
          style={{
            textAlign: 'center',
            marginHorizontal: 20,
            fontSize: 20,
            color: Colors.HONEY,
            marginTop: 15,
            opacity: 0.8
          }}>Identidica, diagnostica y decuble los veneficios de las plantas medicinales</Text>
        <View style={{
          position: 'absolute',
          width: '100%',
          bottom: 215,
          padding: 20,
        }}>
          <Button
            title={'Comenzar'}
            onPress={() => router.push('/(tabs)/home')}
          />
        </View>
      </View>
    </View>
  );
}
