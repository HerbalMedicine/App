// components/ButtonCamera.js
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ButtonCamera({ icon, onPress, size = 40, color = 'white', style }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <MaterialIcons name={icon} size={size} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
