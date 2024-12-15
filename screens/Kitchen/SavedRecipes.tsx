import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../Context/UserContext';

const SavedRecipes: React.FC = () => {
  const { user } = useUser();
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null); // Expanded recipe state
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const navigation = useNavigation();

  useEffect(() => {
    fetchSavedRecipes();
  }, [user.userId]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, savedRecipes]);

  const fetchSavedRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users/${user.userId}/recipes`);
      const recipes = Array.isArray(response.data) ? response.data : [];
      const sortedRecipes = recipes.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setSavedRecipes(sortedRecipes);
      setFilteredRecipes(sortedRecipes);
    } catch (error) {
      handleError(error, 'Failed to fetch saved recipes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(savedRecipes);
    } else {
      const filtered = savedRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  const handleRemoveRecipe = (recipeId: string) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeRecipe(recipeId) },
      ],
      { cancelable: true }
    );
  };

  const removeRecipe = async (recipeId: string) => {
    try {
      setIsLoading(true);
      await axios.patch(`${API_BASE_URL}/recipes/${recipeId}/remove-user`, { userId: user.userId });
      Alert.alert('Success', 'Recipe removed successfully.');
      fetchSavedRecipes();
    } catch (error) {
      handleError(error, 'Failed to remove the recipe.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIngredients = (recipeId: string) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const handleError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn('No recipes found for this user.');
      setSavedRecipes([]);
      setFilteredRecipes([]);
    } else {
      console.error(defaultMessage, error);
      Alert.alert('Error', defaultMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Saved Recipes</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#36c190" />
      ) : filteredRecipes.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredRecipes.map((recipe) => (
            <View key={recipe._id} style={styles.recipeCard}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <TouchableOpacity onPress={() => toggleIngredients(recipe._id)}>
                <Text style={styles.ingredientsText}>
                  {expandedRecipe === recipe._id ? 'Hide Ingredients' : 'Show Ingredients'}
                </Text>
              </TouchableOpacity>
              {expandedRecipe === recipe._id && (
                <View style={styles.ingredientsList}>
                  {recipe.ingredients.map((ingredient: string, index: number) => (
                    <Text key={index} style={styles.ingredientItem}>
                      - {ingredient}
                    </Text>
                  ))}
                </View>
              )}
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('RecipeDetails', { recipeId: recipe._id })}
              >
                <Text style={styles.detailsButtonText}>View Recipe</Text>
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
        <Text style={styles.noRecipesText}>No recipes found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 2,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  scrollContainer: {
    paddingVertical: 10,
    margin: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    margin: 20,
    fontSize: 16,
    elevation: 2,
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
  ingredientsText: {
    fontSize: 16,
    color: '#36c190',
    marginTop: 10,
  },
  ingredientsList: {
    marginTop: 10,
    marginBottom: 10,
  },
  ingredientItem: {
    fontSize: 14,
    color: '#555',
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
