import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, TouchableOpacity } from 'react-native';
import RecipeFinder from './screens/Home/RecipeFinder';
import { AllergyProvider } from './Context/AllergyContext';
import { UserProvider } from './Context/UserContext'; // UserProvider for managing user context
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Allergies from './screens/Kitchen/Allergies';
import MyKitchen from './screens/Kitchen/MyKitchen';
import SubstituteFinder from './screens/Home/SubstituteFinder';
import RecipeGenerator from './screens/Home/RecipeGenerator';
import SavedRecipes from './screens/Kitchen/SavedRecipes';
import Login from './screens/Login';
import RecipeDetails from './screens/Kitchen/RecipeDetails';
import ProfileNavigation from './screens/Profile/ProfileNavigation';
import Home from './screens/Home';
import AppSettings from './screens/Profile/AppSettings'
import ProfileSettings from './screens/Profile/ProfileSettings'
import { AuthProvider, useAuth } from './Context/AuthContext';
import Register from './screens/Register';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();

/* Define the navigation types for better type safety */
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Login: undefined;
  Register: undefined;
  SavedRecipes: undefined;
  RecipeDetails: { recipeId: string }; // RecipeDetails expects a recipeId
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/* Tabs for the kitchen-related screens */
const KitchenTabs = () => (
  <Tab.Navigator id={"KitchenTabs" as undefined}
    screenOptions={{
      tabBarActiveTintColor: '#36c190', // Active tab highlight color
      tabBarInactiveTintColor: '#000000',
      tabBarLabelStyle: { fontSize: 16, color: '#000000' },
      tabBarStyle: { backgroundColor: '#f7f9fc' }, // Background color for tabs
    }}
  >
    <Tab.Screen name="Allergies" component={Allergies} />
    <Tab.Screen name="My Pantry" component={MyKitchen} />
    <Tab.Screen name="My Recipes" component={SavedRecipes} />
  </Tab.Navigator>
);

/* Tabs for the settings-related screens */
const ProfileTabs = () => (
  <Tab.Navigator id={"ProfileTabs" as undefined}
    screenOptions={{
      tabBarActiveTintColor: '#36c190', // Active tab highlight color
      tabBarInactiveTintColor: '#000000',
      tabBarLabelStyle: { fontSize: 16, color: '#000000' },
      tabBarStyle: { backgroundColor: '#f7f9fc' }, // Background color for tabs
    }}
  >
    <Tab.Screen name="AppSettings" component={AppSettings} />
    <Tab.Screen name="ProfileSettings" component={ProfileSettings} />
  </Tab.Navigator>
);

/* Tabs for home-related screens */
/* Tabs for home-related screens */
const CookingTabs = () => (
  <Tab.Navigator
    id={"mainNav" as undefined}
    screenOptions={{
      tabBarActiveTintColor: '#36c190', // Active tab highlight color
      tabBarInactiveTintColor: '#000000',
      tabBarLabelStyle: { fontSize: 16, color: '#000000' },
      tabBarStyle: { backgroundColor: '#f7f9fc' }, // Background color for tabs
    }}
  >
    <Tab.Screen name="Recipe Finder" component={RecipeFinder} />
    <Tab.Screen name="Recipe Generator" component={RecipeGenerator} />
  </Tab.Navigator>
);

const BottomTabs = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <BottomTab.Navigator
      id={"bottomTabs" as undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconComponent = Icon;
          let iconName;

          if (route.name === 'Home') {
            iconName = 'pot-mix-outline';
            iconComponent = MaterialIcon; // Use MaterialCommunityIcons for 'pot-mix'
          } else if (route.name === 'Kitchen') {
            iconName = 'restaurant-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else if (route.name === 'Substitute') {
            iconName = 'swap-horizontal';
          }

          return React.createElement(iconComponent, { name: iconName, size, color });
        },
        tabBarActiveTintColor: '#36c190',
        tabBarInactiveTintColor: isDarkMode ? '#ccc' : '#000',
        tabBarStyle: { backgroundColor: isDarkMode ? '#000' : '#f7f9fc' },
      })}
    >
            <BottomTab.Screen
        name="Home"
        component={CookingTabs}
        options={{ title: 'Cook' }}
      />
            <BottomTab.Screen
        name="Substitute"
        component={SubstituteFinder}
        options={{ title: 'Substitute' }}
      />
      <BottomTab.Screen
        name="Kitchen"
        component={KitchenTabs}
        options={{ title: 'My Kitchen' }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileTabs}
        options={{ title: 'Profile' }}
      />
    </BottomTab.Navigator>
  );
};


/* Root stack for the main app flow */
function RootStack() {
  const isDarkMode = useColorScheme() === 'dark';
  const { onLogout } = useAuth();

  return (
    <Stack.Navigator initialRouteName="BottomTabs" id={"bottomTabNav" as undefined}>
      {/* Bottom Tabs */}
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={({ navigation }) => ({
          title: 'Dashboard',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileTabs')}
              style={{ marginLeft: 10 }}
            >
              <Icon name="person-outline" size={30} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('KitchenTabs')}
              style={{ marginRight: 10 }}
            >
              <Icon name="restaurant-outline" size={30} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          ),
          headerShown: false, // Ensures the BottomTab header is used
        })}
      />

      {/* Home Tabs */}
      <Stack.Screen
        name="CookingTabs"
        component={CookingTabs}
        options={{ headerShown: true }}
      />

      {/* Profile Tabs */}
      <Stack.Screen
        name="ProfileTabs"
        component={ProfileTabs}
        options={{ title: 'Settings' }}
      />

      {/* Kitchen Tabs */}
      <Stack.Screen
        name="KitchenTabs"
        component={KitchenTabs}
        options={{ title: 'Kitchen' }}
      />

      {/* Recipe Details */}
      <Stack.Screen
        name="RecipeDetails"
        component={RecipeDetails}
        options={{ title: 'Recipe Details' }}
      />
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
      <Stack.Screen 
      name="Register" 
      component={Register} 
      options={{ title: 'Register' }} />
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
