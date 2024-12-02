import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface RecipeLine {
  original: string;
  substitution: string;
}

interface RecipeLinesProps {
  recipeTitle: string;
  recipeLines: RecipeLine[];
  substituteIngredient: (index: number) => void;
}

const cleanIngredientText = (text: string) => {
    if (text.toLowerCase().includes('ingredients:')) {
      return text.replace(/[*~_#-]/g, '').replace(/^- /, '').trim();
    }
    return text.replace(/^- /, '').trim();
  };
  

const cleanInstructionText = (text: string) => {
  if (text.toLowerCase().includes('instructions:')) {
    return text.replace(/[*~_#-]/g, '');
  }
  return text;
};

const RecipeLines: React.FC<RecipeLinesProps> = ({ recipeTitle, recipeLines, substituteIngredient }) => {
  return (
    <View style={styles.recipeContainer}>
      {recipeTitle && recipeTitle.trim() !== '' ? (
        <Text style={styles.recipeTitle}>{recipeTitle}</Text>
      ) : (
        <Text style={styles.recipeTitle}>Untitled Recipe</Text>
      )}

      {recipeLines && recipeLines.length > 0 ? (
        recipeLines.slice(1).map((line, index) => {
          const isIngredient = line.original.toLowerCase().includes('ingredients');
          const isInstruction = line.original.toLowerCase().includes('instructions');
          const textStyle = isIngredient || isInstruction ? styles.boldText : styles.recipeText;

          return (
            <View key={index} style={styles.recipeLine}>
              {line.original.startsWith('- ') && (
                <TouchableOpacity onPress={() => substituteIngredient(index + 1)}>
                  <Icon name="repeat" size={20} color="#36c190" style={styles.redoIcon} />
                </TouchableOpacity>
              )}
              <Text style={textStyle}>
                {isInstruction
                  ? cleanInstructionText(line.substitution || '')
                  : cleanIngredientText(line.substitution || '')}
              </Text>
            </View>
          );
        })
      ) : (
        <Text style={styles.recipeText}>No recipe lines available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  boldText: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold', // Apply bold style
    flex: 1,
  },
  redoIcon: {
    fontSize: 26,
    color: '#36c190',
    marginRight: 5,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
});

export default RecipeLines;
