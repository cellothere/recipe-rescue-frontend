import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, TouchableOpacity } from 'react-native';
import RecipeFinder from './screens/Home/RecipeFinder';
import { AllergyProvider } from './Context/AllergyContext';
import { UserProvider } from './Context/UserContext'; // UserProvider for managing user context
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Allergies from './screens/Kitchen/Allergies';
import MyKitchen from './screens/Kitchen/MyKitchen';
import SubstituteFinder from './screens/Home/SubstituteFinder';
import RecipeGenerator from './screens/Home/RecipeGenerator';
import SavedRecipes from './screens/Kitchen/SavedRecipes';
import Settings from './screens/Kitchen/Settings';
import Login from './screens/Login';
import RecipeDetails from './screens/Kitchen/RecipeDetails';
import { AuthProvider, useAuth } from './Context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

/* Define the navigation types for better type safety */
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Login: undefined;
  SavedRecipes: undefined;
  RecipeDetails: { recipeId: string }; // RecipeDetails expects a recipeId
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/* Tabs for the settings-related screens */
const SettingsTabs = () => (
  <Tab.Navigator id={"settingsTabs" as undefined}
    screenOptions={{
      tabBarActiveTintColor: '#36c190', // Active tab highlight color
      tabBarInactiveTintColor: '#000000',
      tabBarLabelStyle: { fontSize: 16, color: '#000000' },
      tabBarStyle: { backgroundColor: '#f7f9fc' }, // Background color for tabs
    }}
  >
    <Tab.Screen name="Allergies" component={Allergies} />
    <Tab.Screen name="Kitchen" component={MyKitchen} />
    <Tab.Screen name="Recipes" component={SavedRecipes} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

/* Tabs for home-related screens */
const HomeTabs = () => (
  <Tab.Navigator
  id={"mainNav" as undefined}
    screenOptions={{
      tabBarActiveTintColor: '#36c190',
      tabBarInactiveTintColor: '#000000',
      tabBarLabelStyle: { fontSize: 16, color: '#000000' },
      tabBarStyle: { backgroundColor: '#f7f9fc' },
    }}
  >
    <Tab.Screen name="Recipe Finder" component={RecipeFinder} />
    <Tab.Screen name="Recipe Generator" component={RecipeGenerator} />
    <Tab.Screen name="Substitute" component={SubstituteFinder} />
  </Tab.Navigator>
);

/* Root stack for the main app flow */
function RootStack() {
  const isDarkMode = useColorScheme() === 'dark'; // Detect if dark mode is active
  const { onLogout } = useAuth(); // Access logout functionality

  return (
    <Stack.Navigator initialRouteName="MainHome" id={"mainTabs" as undefined} >
      
      <Stack.Screen
        name="MainHome"
        component={HomeTabs}
        options={({ navigation }) => ({
          title: 'Recipe Generator',
          headerLeft: () => (
            <TouchableOpacity
              onPress={async () => {
                await onLogout();
              }}
              style={{ marginLeft: 10 }}
            >
              <Icon name="person-outline" size={30} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('SettingsTabs')}
              style={{ marginRight: 10 }}
            >
              <Icon name="restaurant-outline" size={30} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="SettingsTabs"
        component={SettingsTabs}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
    </Stack.Navigator>
  );
}

/* Stack for authentication screens */
function AuthStack() {
  return (
    <Stack.Navigator id={"loginNav" as undefined}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login' }}
      />
    </Stack.Navigator>
  );
}

/* App content to switch between authenticated and unauthenticated flows */
const AppContent: React.FC = () => {
  const { authState } = useAuth(); // Access authentication state

  return (
    <NavigationContainer>
      {authState.authenticated ? <RootStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

/* Main App component with context providers */
const App: React.FC = () => (
  <UserProvider>
    <AuthProvider>
      <AllergyProvider>
        <AppContent />
      </AllergyProvider>
    </AuthProvider>
  </UserProvider>
);

export default App;
