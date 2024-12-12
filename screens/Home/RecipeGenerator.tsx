import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import LoadingIcon from '../../components/LoadingIcon'; // Import the LoadingIcon component
import { useAllergyContext } from '../../Context/AllergyContext'; // Import allergy context

export function RecipeGenerator() {
  const { allergies } = useAllergyContext(); // Access allergy information
  const [recipeName, setRecipeName] = useState('');
  const [selectedServings, setSelectedServings] = useState<number | null>(null);
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pickerRef = useRef<RNPickerSelect | null>(null);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchRecipe = async () => {
    if (!recipeName.trim()) {
      Alert.alert('Error', 'Please enter a recipe name.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        recipeName: recipeName.trim(),
        allergies: allergies,
        ...(selectedServings && { servings: selectedServings }),
      };

      const response = await axios.post(`${API_BASE_URL}/newRecipe/generate`, payload);
      const generatedRecipe = response.data.recipe;

      if (generatedRecipe) {
        setRecipe(generatedRecipe);
      } else {
        Alert.alert('No Recipes Found', 'Unable to generate a recipe for the provided input.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch recipe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Generate a Recipe</Text>

        {/* Recipe Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter recipe name"
          value={recipeName}
          onChangeText={setRecipeName}
          placeholderTextColor="#888"
        />

        {/* Servings Dropdown */}
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => pickerRef.current?.togglePicker()}
        >
          <Text style={styles.selectedText}>Servings:</Text>
          <RNPickerSelect
            ref={pickerRef}
            onValueChange={(value) => setSelectedServings(value)}
            items={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
              { label: '4', value: 4 },
              { label: '5', value: 5 },
              { label: '6', value: 6 },
              { label: '7', value: 7 },
              { label: '8', value: 8 },
              { label: '9', value: 9 },
              { label: '10', value: 10 },
            ]}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
          />
        </TouchableOpacity>

        {/* Generate Recipe Button */}
        <TouchableOpacity style={styles.button} onPress={fetchRecipe} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Generating...' : 'Generate Recipe'}
          </Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {isLoading && <LoadingIcon />}

        {/* Display Recipe */}
        {!isLoading && recipe && (
          <View style={styles.recipeContainer}>
            <Text style={styles.recipeTitle}>Recipe:</Text>
            <Text style={styles.recipeText}>{recipe}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingTop: 3,
    textAlign: 'center',
  },
  inputAndroid: {
    paddingTop: 3,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
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
    color: '#000',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
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
  recipeContainer: {
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  recipeText: {
    fontSize: 16,
    color: '#555',
  },
});

export default RecipeGenerator;
