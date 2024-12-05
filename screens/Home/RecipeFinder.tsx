import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import { useAllergyContext } from '../../Context/AllergyContext'; // Import allergy context
import LoadingIcon from '../../components/LoadingIcon';
import RecipeLines from '../../components/RecipeLines'; // Import the RecipeLines component
import { useUser } from '../../Context/UserContext';
import RNPickerSelect from 'react-native-picker-select';

const RecipeFinder: React.FC = () => {
  const { user } = useUser(); 
  //console.log(user)
  const isDarkMode = useColorScheme() === 'dark';
  const pickerRef = useRef<RNPickerSelect | null>(null);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1c1c1c' : '#f2f2f2',
    flex: 1,
  };

  const [ingredients, setIngredients] = useState([]);
  const [originalServings, setOriginalServings] = useState<number | null>(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [alreadyUsed, setAlreadyUsed] = useState<string[]>([]);
  const [recipeTitle, setRecipeTitle] = useState('');
  const { allergies } = useAllergyContext();
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [recipeLines, setRecipeLines] = useState<{ original: string; substitution: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServings, setSelectedServings] = useState<number | null>(null);


  const API_BASE_URL = 'http://192.168.1.66:5001/api';
 
  // Picker Styles
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      paddingTop: 3,
      textAlign: 'center',
    },
    inputAndroid: {
      paddingTop: 3,
      textAlign: 'center',
    }
  });

  // Add Ingredient to List
  const addIngredient = () => {
    if (!currentIngredient.trim()) {
      Alert.alert('Error', 'Please enter an ingredient');
      return;
    }
    setIngredientsList((prevList) => [...prevList, currentIngredient.trim()]);
    setCurrentIngredient('');
  };

  

  // Fetch Recipe Based on Ingredients
  const fetchRecipe = async () => {
    if (ingredientsList.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ingredients: ingredientsList,
        allergies: allergies,
        ...(selectedServings && { servings: selectedServings })
      };

      const response = await axios.post(`${API_BASE_URL}/recipes/generate`, payload);
      const recipe = response.data.recipe || '';
      const recipeArray = recipe.split('\n');

      const updatedRecipeLines = recipeArray.map((line) => ({
        original: line,
        substitution: line,
      }));

      setRecipeLines(updatedRecipeLines);
      setRecipeTitle(recipeArray[0].replace(/[*_#~`]/g, ''));
      setOriginalServings(selectedServings); // Set the initial serving size
      setShowUpdateButton(false); // Reset button visibility
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch recipe');
    } finally {
      setIsLoading(false);
    }
  };

  // Substitute Ingredient in Recipe
  const substituteIngredient = async (lineIndex: number) => {
    const currentLine = recipeLines[lineIndex];
    try {
      const response = await axios.post(`${API_BASE_URL}/recipes/substitute`, {
        ingredient: currentLine.original,
        alreadyUsed: alreadyUsed,
        allergies: allergies,
      });

      const substitute = response.data.substitute || 'No substitute available';

      // Update the specific recipe line
      const updatedLines = [...recipeLines];
      updatedLines[lineIndex] = {
        ...updatedLines[lineIndex],
        substitution: substitute,
      };

      // Update the state
      setRecipeLines(updatedLines);

      // Add the substitute to alreadyUsed list
      setAlreadyUsed((prevList) => [...prevList, substitute]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch substitute');
    }
  };

  //save recipe
  const saveRecipe = async () => {
    const mongoObjectUserId = user.userId
    if (!recipeTitle || ingredientsList.length === 0 || recipeLines.length === 0) {
      Alert.alert('Error', 'Please generate a recipe first.');
      return;
    }
    setIsLoading(true);

    
    try {
      
/// Find the index of the instructions delimiter
const instructionsStartIndex = recipeLines.findIndex((line) =>
  line.original.includes('Instructions')
);

// Filter and clean the ingredients
const recipeIngredients = recipeLines
  .slice(0, instructionsStartIndex) // Get all lines before instructions
  .map((line) => line.original.trim()) // Trim whitespace
  .filter(
    (line) =>
      line && // Exclude empty lines
      !line.startsWith('###') && // Exclude titles
      !line.startsWith('**') // Exclude section headers like "Ingredients:"
  )
  .map((line) => line.replace(/^[-\d.]+/, '').trim()); // Remove prefixes like "-", "1.", "2."

// Process and clean the instructions
const recipeInstructions = recipeLines
  .slice(instructionsStartIndex + 1) // Get all lines after the instructions header
  .map((line) => line.original.trim()) // Trim whitespace
  .join('\n'); // Combine instructions into a single string

const payload = {
  name: recipeTitle.trim(),
  ingredients: recipeIngredients, // Cleaned ingredients
  instructions: recipeInstructions, // Cleaned instructions
  userId: mongoObjectUserId, // Use the fetched userId
};
      // Save the recipe
      const response = await axios.post(`${API_BASE_URL}/recipes/save`, payload);
      const { message } = response.data;

      Alert.alert('Success', message);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save the recipe.');
    } finally {
      setIsLoading(false);
    }
  };

  //update servings
  const updateServings = async () => {
    if (!recipeLines.length) {
      Alert.alert('Error', 'No recipe to update. Please generate a recipe first.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        recipe: recipeLines.map((line) => line.original).join('\n'),
        servings: selectedServings,
      };

      const response = await axios.post(`${API_BASE_URL}/recipes/updateServings`, payload);
      const updatedRecipe = response.data.updatedRecipe || '';
      const updatedRecipeArray = updatedRecipe.split('\n');

      const updatedRecipeLines = updatedRecipeArray.map((line) => ({
        original: line,
        substitution: line,
      }));

      setRecipeLines(updatedRecipeLines);
      setOriginalServings(selectedServings); // Update the reference servings
      setShowUpdateButton(false); // Hide button after successful update
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update recipe');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove Ingredient from List
  const removeIngredient = (index: number) => {
    setIngredientsList((prevList) => prevList.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} >
          <Text style={styles.title}>Type some ingredients...</Text>

          {/* Add Ingredients Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter an ingredient"
              maxLength={25}
              placeholderTextColor="#888"
              value={currentIngredient}
              onChangeText={(text) => {
                if (text.includes(',')) {
                  const trimmedText = text.replace(',', '').trim();
                  if (trimmedText) {
                    setIngredientsList((prevList) => [...prevList, trimmedText]);
                  }
                  setCurrentIngredient('');
                } else {
                  setCurrentIngredient(text);
                }
              }}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addIngredient}
              accessible={true}
              accessibilityLabel="Add allergy"
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Ingredients List */}
          {ingredientsList.length > 0 && (
            <View style={styles.ingredientsList}>
              {ingredientsList.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                  <TouchableOpacity onPress={() => removeIngredient(index)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Servings Dropdown */}
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={() => pickerRef.current?.togglePicker()}
          >
            <Text style={styles.selectedText}>Servings:</Text>
            <RNPickerSelect
              ref={pickerRef}
              onValueChange={(value) => {
                setSelectedServings(value);
                setShowUpdateButton(value !== originalServings && recipeLines.length > 0); // Only show if different and recipe exists
              }}
              items={[
                { label: "1", value: 1 },
                { label: "2", value: 2 },
                { label: "3", value: 3 },
                { label: "4", value: 4 },
                { label: "5", value: 5 },
                { label: "6", value: 6 },
                { label: "7", value: 7 },
                { label: "8", value: 8 },
                { label: "9", value: 9 },
                { label: "10", value: 10 },
              ]}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />

          </TouchableOpacity>
          {showUpdateButton && (
            <TouchableOpacity
              style={styles.buttonUpdate}
              onPress={updateServings}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Update Recipe</Text>
            </TouchableOpacity>
          )}



          {/* Generate Recipe Button */}
          <TouchableOpacity style={styles.button} onPress={fetchRecipe} disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : recipeLines.length > 0 ? 'Generate New Recipe' : 'Generate Recipe'}
            </Text>
          </TouchableOpacity>

          {/* Loading Icon */}
          {isLoading && <LoadingIcon />}

          {/* Clear All Button */}
          {!isLoading && recipeLines.length > 0 && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ff6f61' }]}
              onPress={() => {
                setIngredientsList([]);        // Clear the ingredients list
                setRecipeLines([]);            // Clear the recipe lines
                setCurrentIngredient('');      // Reset the current ingredient input
                setSelectedServings(null);     // Reset the selected servings
                setShowUpdateButton(false);    // Hide the "Update Recipe" button
                setAlreadyUsed([]);            // Clear the already used substitutes
              }}
            >
              <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
          )}

          {/* Display recipe lines */}
          {!isLoading && recipeLines.length > 0 && (
            <RecipeLines
              recipeTitle={recipeTitle}
              recipeLines={recipeLines}
              substituteIngredient={substituteIngredient}
            />
          )}

          {/* Save Recipe Button */}
          {!isLoading && recipeLines.length > 0 && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveRecipe}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : 'Save'} 
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles
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
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#36c190',
    padding: 10,
    marginLeft: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ingredientsList: {
    width: '100%',
    marginBottom: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
  },
  removeText: {
    color: '#ff6f61',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#36c190',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonUpdate: {
    backgroundColor: '#003366', // Dark blue color
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
  recipeLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  redoIcon: {
    fontSize: 20,
    color: '#36c190',
    marginRight: 5,
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
  saveButton: {
    backgroundColor: '#007BFF', // Blue color
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecipeFinder;
