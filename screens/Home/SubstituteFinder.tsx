import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useAllergyContext } from '../../Context/AllergyContext'; // Import allergy context

const SubstituteFinder: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [substitutes, setSubstitutes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avoidAllergies, setAvoidAllergies] = useState(false); // Track toggle state

  const { allergies } = useAllergyContext(); // Access allergies from context

  const API_BASE_URL = 'http://192.168.1.66:5001/api';

  const fetchSubstitutes = async () => {
    if (!ingredient.trim()) {
      Alert.alert('Error', 'Please enter an ingredient');
      return;
    }

    setIsLoading(true);
    setSubstitutes([]); // Clear previous substitutes

    try {
      const payload: any = { ingredient };
      if (avoidAllergies && allergies.length > 0) {
        payload.allergies = allergies; // Include allergies if toggle is on
      }

      const response = await axios.post(`${API_BASE_URL}/substitute/generate`, payload);
      const substituteData = response.data.substitute || '';
      const substituteArray = substituteData.split('\n').map((item) => item.trim());
      setSubstitutes(substituteArray);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch substitutes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Find Ingredient Substitutes</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter an ingredient"
          placeholderTextColor="#888"
          value={ingredient}
          onChangeText={setIngredient}
        />

        {/* Toggle Button */}
        <TouchableOpacity
          style={[styles.toggleButton, avoidAllergies ? styles.avoid : styles.ignore]}
          onPress={() => setAvoidAllergies((prev) => !prev)}
        >
          <Text style={styles.toggleText}>
            {avoidAllergies ? 'Avoid Allergies' : 'Ignore Allergies'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={fetchSubstitutes} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Find Substitutes'}</Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator size="large" color="#36c190" style={styles.loader} />}

        {substitutes.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Substitutes:</Text>
            {substitutes.map((sub, index) => (
              <Text key={index} style={styles.substitute}>
                {sub}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  innerContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#36c190',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  resultsContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  substitute: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  avoid: {
    backgroundColor: '#36c190', // Green for avoiding
  },
  ignore: {
    backgroundColor: '#ff6f61', // Red for ignoring
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SubstituteFinder;
