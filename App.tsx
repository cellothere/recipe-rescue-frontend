import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, TouchableOpacity } from 'react-native';
import RecipeGenerator from './screens/RecipeGenerator';
import { AllergyProvider } from './Context/AllergyContext';
import { UserProvider } from './Context/UserContext'; // Import UserProvider
import Icon from 'react-native-vector-icons/Ionicons';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Allergies from './screens/Allergies';
import MyKitchen from './screens/MyKitchen';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import Login from './screens/Login';
import { AuthProvider, useAuth } from './Context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Login: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const SettingsTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#36c190',
      tabBarInactiveTintColor: '#000000',
      tabBarLabelStyle: { fontSize: 16, color: '#000000' },
      tabBarStyle: { backgroundColor: '#f7f9fc' },
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
  const { onLogout } = useAuth(); // Access the logout function

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={RecipeGenerator}
        options={({ navigation }) => ({
          title: 'Recipe Generator',
          headerLeft: () => (
            <TouchableOpacity
              onPress={async () => {
                await onLogout(); // Clear authentication state
                // No manual navigation needed; state will handle screen switching
              }}
              style={{ marginLeft: 10 }}
            >
              <Icon name="log-out-outline" size={30} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          ),
          
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
      <Stack.Screen
        name="SettingsTabs"
        component={SettingsTabs}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}


function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login' }}
      />
    </Stack.Navigator>
  );
}

const AppContent: React.FC = () => {
  const { authState } = useAuth();
  console.log(authState.authenticated); // Debugging

  return (
    <NavigationContainer>
      {authState.authenticated ? <RootStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App: React.FC = () => (
  <UserProvider> {/* UserProvider should wrap AuthProvider */}
    <AuthProvider>
      <AllergyProvider>
        <AppContent />
      </AllergyProvider>
    </AuthProvider>
  </UserProvider>
);

export default App;
