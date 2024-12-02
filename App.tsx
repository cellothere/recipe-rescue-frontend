import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, TouchableOpacity } from 'react-native';
import RecipeGenerator from './screens/RecipeGenerator';
import { AllergyProvider } from './Context/AllergyContent'; // Import AllergyProvider
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons

// Import the new Tab Navigator and screens
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Allergies from './screens/Allergies'; // This will stay the same
import MyKitchen from './screens/MyKitchen';
import Profile from './screens/Profile';
import Settings from './screens/Settings';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator(); // Declare the tab navigator

// Define the type for navigation structure
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

// Declare global types for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Create the Tab Navigator for Settings
const SettingsTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#36c190', // Active tab color
      tabBarInactiveTintColor: '#000000', // Inactive tab text color
      tabBarLabelStyle: { fontSize: 16, color: '#000000' }, // Label text color
      tabBarStyle: { backgroundColor: '#f7f9fc' }, // Tab bar background color
    }}
  >
    <Tab.Screen name="Allergies" component={Allergies} />
    <Tab.Screen name="Kitchen" component={MyKitchen} />
    <Tab.Screen name="Profile" component={Profile} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

function RootStack() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={RecipeGenerator}
        options={({ navigation }) => ({
          title: 'Recipe Generator',
          headerRight: () => (
<TouchableOpacity
  onPress={() => navigation.navigate('SettingsTabs')}
  style={{ marginRight: 10 }}
>
  <Icon name="settings" size={30} color={isDarkMode ? '#fff' : '#000'} />
</TouchableOpacity>

          ),
        })}
      />
      {/* Update the Settings screen to use SettingsTabs */}
      <Stack.Screen
  name="SettingsTabs"
  component={SettingsTabs}
  options={{ title: 'Settings' }}
/>
    </Stack.Navigator>
  );
}

const App: React.FC = () => {
  return (
    <AllergyProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AllergyProvider>
  );
};

export default App;
