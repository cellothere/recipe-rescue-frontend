import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../Context/UserContext';


const SavedRecipes: React.FC = () => {
  const { user } = useUser(); // Access the user context
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]); // State to store recipes
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const API_BASE_URL = 'http://192.168.1.66:5001/api'; // Update to your API's base URL
  const navigation = useNavigation(); // Navigation hook

  useEffect(() => {
    fetchSavedRecipes();
  }, [user.userId]);

  const fetchSavedRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users/${user.userId}/recipes`);
      setSavedRecipes(response.data);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      Alert.alert('Error', 'Failed to fetch saved recipes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRecipe = (recipeId: string) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you wish to remove this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeRecipe(recipeId),
        },
      ],
      { cancelable: true }
    );
  };

  const removeRecipe = async (recipeId: string) => {
    try {
      setIsLoading(true);
      await axios.patch(`${API_BASE_URL}/recipes/${recipeId}/remove-user`, { userId: user.userId });
      Alert.alert('Success', 'Recipe removed successfully.');
      fetchSavedRecipes(); // Refresh the list
    } catch (error) {
      console.error('Error removing recipe:', error);
      Alert.alert('Error', 'Failed to remove the recipe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Saved Recipes</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#36c190" />
      ) : savedRecipes.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {savedRecipes.map((recipe) => (
            <View key={recipe._id} style={styles.recipeCard}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('RecipeDetails', { recipeId: recipe._id })}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveRecipe(recipe._id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noRecipesText}>You have no saved recipes.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  detailsButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#36c190',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ff6f61',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  noRecipesText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});

export default SavedRecipes;
