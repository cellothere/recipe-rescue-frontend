import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../Context/UserContext';

const Home: React.FC = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.username}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomeTabs', { screen: 'Recipe Finder' })}
      >
        <View style={styles.iconTextContainer}>
      <MaterialIcon name="silverware-clean" size={30} color={isDarkMode ? '#fff' : '#000'} />
        <Text style={styles.buttonText}>Generate a Recipe</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomeTabs', { screen: 'Substitute' })}
      >
        <View style={styles.iconTextContainer}>
        <Icon name="swap-horizontal" size={30} color={isDarkMode ? '#fff' : '#000'} />
        <Text style={styles.buttonText}>Substitute Finder</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('KitchenTabs', { screen: 'Recipes' })}
      >
        <View style={styles.iconTextContainer}>
          <Icon name="heart-outline" size={30} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={styles.buttonText}>View Saved Recipes (7)</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('KitchenTabs', { screen: 'Recipes' })}
      >
        <View style={styles.iconTextContainer}>
          <Icon name="trending-up-sharp" size={30} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={styles.buttonText}>Popular recipes</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#36c190',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
    flexDirection: 'row', // Ensure the button layout is horizontal
    alignItems: 'center', // Vertically align icon and text
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1, // Take up the remaining space
    textAlign: 'center', // Center the text
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically align items
  },
});


export default Home;
