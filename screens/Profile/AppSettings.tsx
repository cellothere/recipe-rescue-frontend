import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'react-native';
import { useAuth } from '../../Context/AuthContext';

const AppSettings: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark'; // Check for dark mode
  const { onLogout } = useAuth(); // Access the logout function from AuthContext

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Settings</Text>
      {/* Add other settings content here */}
      <TouchableOpacity
        onPress={async () => {
          try {
            console.log(process.env.EXPO_PUBLIC_API_URL)
            await onLogout(); // Call the logout function
          } catch (error) {
            console.error('Logout failed:', error); // Handle logout errors
          }
        }}
        style={styles.logoutButton}
      >
        <Icon
          name="log-out-outline"
          size={24}
          color={isDarkMode ? '#fff' : '#000'}
        />
        <Text style={[styles.logoutText, { color: isDarkMode ? '#fff' : '#000' }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#36c190',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default AppSettings;
