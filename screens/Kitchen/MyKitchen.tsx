import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, Alert } from 'react-native';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL; // Update to your API's base URL
const userId = '674dee46c3be33428e0bfff7'; // Replace with the actual user ID

const MyKitchen: React.FC = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState('');
  const [measurementType, setMeasurementType] = useState('');
  const [amount, setAmount] = useState('');

  // Fetch ingredients on component mount
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/kitchen`);
      setIngredients(response.data.kitchen);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      Alert.alert('Error', 'Failed to fetch ingredients.');
    }
  };

  const addIngredient = async () => {
    if (ingredientName.trim() === '') {
      Alert.alert('Error', 'Ingredient name is required.');
      return;
    }

    const newIngredient = { name: ingredientName, amount, measurement: measurementType };

    try {
      const response = await axios.post(`${API_BASE_URL}/users/${userId}/kitchen/`, newIngredient);
      setIngredients(response.data.kitchen); // Update kitchen with the response
      Alert.alert('Success', 'Ingredient added successfully.');
    } catch (error) {
      console.error('Error adding ingredient:', error);
      Alert.alert('Error', 'Failed to add ingredient.');
    }

    // Reset inputs
    setIngredientName('');
    setMeasurementType('');
    setAmount('');
  };

  const deleteIngredient = async (ingredientId: string) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/users/${userId}/kitchen/${ingredientId}`
      );
      setIngredients(response.data.kitchen); // Update kitchen with the response
      Alert.alert('Success', 'Ingredient removed successfully.');
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      Alert.alert('Error', 'Failed to remove ingredient.');
    }
  };

  const renderIngredient = ({ item }: { item: any }) => (
    <View style={styles.ingredientItem}>
      <Text style={styles.ingredientText}>
        {item.name} {item.amount ? `- ${item.amount}` : ''} {item.measurement || ''}
      </Text>
      <Button title="Remove" color="#ff6f61" onPress={() => deleteIngredient(item._id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Kitchen</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingredient Name (Required)"
        value={ingredientName}
        onChangeText={setIngredientName}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Measurement Type (e.g., ml, lbs, tsp)"
        value={measurementType}
        onChangeText={setMeasurementType}
      />

      <Button title="Add Ingredient" onPress={addIngredient} />

      <FlatList
        data={ingredients}
        keyExtractor={(item) => item._id}
        renderItem={renderIngredient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  ingredientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientText: {
    fontSize: 16,
    flex: 1,
  },
});

export default MyKitchen;
