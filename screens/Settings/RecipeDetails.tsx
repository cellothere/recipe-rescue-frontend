import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import RecipeLines from '../../components/RecipeLines';

const RecipeDetails: React.FC = ({ route }: any) => {
  const { recipeId } = route.params; // Extract the recipe ID from route params
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const API_BASE_URL = 'http://192.168.1.66:5001/api';

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/recipes/${recipeId}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        Alert.alert('Error', 'Failed to fetch recipe details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#36c190" />
      ) : recipe ? (
        <ScrollView>
          <RecipeLines
            recipeTitle={recipe.name}
            recipeLines={[
              { original: 'Ingredients:', substitution: 'Ingredients:' },
              ...recipe.ingredients.map((ingredient: string) => ({
                original: `- ${ingredient}`,
                substitution: `- ${ingredient}`,
              })),
              { original: 'Instructions:', substitution: 'Instructions:' },
              { original: recipe.instructions, substitution: recipe.instructions },
            ]}
            substituteIngredient={() => {}}
          />
        </ScrollView>
      ) : (
        <Text style={styles.errorText}>Recipe not found.</Text>
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
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
    marginTop: 20,
  },
});

export default RecipeDetails;
