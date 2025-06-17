import Colors from '@/shared/Colors';
import { Text, TouchableOpacity } from 'react-native';

export default function Button({ title, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                padding: 15,
                backgroundColor: Colors.HONEY,
                width: '100%',
                borderRadius: 20
            }}>
            <Text style={{
                fontSize: 22,
                color: Colors.GREEN,
                textAlign: 'center',
                fontWeight:'bold'
            }}
            >{title}</Text>
        </TouchableOpacity>
    )
}