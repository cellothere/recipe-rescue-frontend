import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useUser } from '../../Context/UserContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const MyKitchen: React.FC = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState('');
  const [measurementType, setMeasurementType] = useState('');
  const [amount, setAmount] = useState('');
  const { user } = useUser();
  const userId = user.userId;

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
      setIngredients(response.data.kitchen);
      Alert.alert('Success', 'Ingredient added successfully.');
    } catch (error) {
      console.error('Error adding ingredient:', error);
      Alert.alert('Error', 'Failed to add ingredient.');
    }

    setIngredientName('');
    setMeasurementType('');
    setAmount('');
  };

  const deleteIngredient = async (ingredientId: string) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/users/${userId}/kitchen/${ingredientId}`
      );
      setIngredients(response.data.kitchen);
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
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteIngredient(item._id)}
      >
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
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

      <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
        <Text style={styles.addButtonText}>Add Ingredient</Text>
      </TouchableOpacity>

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
  addButton: {
    backgroundColor: '#36c190',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  deleteButton: {
    backgroundColor: '#ff6f61',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default MyKitchen;
