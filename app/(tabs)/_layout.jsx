import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

const commonTabOptions = (label, iconName) => ({
  tabBarLabel: label,
  tabBarIcon: ({ color }) => <Ionicons name={iconName} size={24} color={color} />,
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1B1B1B',
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tabs.Screen
        name="home"
        options={commonTabOptions('Inicio', 'home')}
      />
      <Tabs.Screen
        name="plantas"
        options={commonTabOptions('Plantas', 'leaf-sharp')}
      />
      <Tabs.Screen
        name="viveros"
        options={commonTabOptions('Viveros', 'location-sharp')}
      />
    </Tabs>
  );
}
