import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  FlatList,
  LayoutAnimation,
} from 'react-native';
import { useAllergyContext } from '../../Context/AllergyContext';

const Allergies: React.FC = () => {
  const { allergies, setAllergies } = useAllergyContext();
  const [currentAllergy, setCurrentAllergy] = useState('');

  const addAllergy = () => {
    if (!currentAllergy.trim()) {
      Alert.alert('Error', 'Please enter an allergy');
      return;
    }
    if (allergies.includes(currentAllergy.trim())) {
      Alert.alert('Error', 'This allergy is already added');
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAllergies([...allergies, currentAllergy.trim()]);
    setCurrentAllergy('');
  };
  

  const removeAllergy = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Allergies</Text>

      {/* Input for adding allergies */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter an allergy (e.g., peanuts)"
          placeholderTextColor="#aaa"
          value={currentAllergy}
          onChangeText={setCurrentAllergy}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addAllergy}
          accessible={true}
          accessibilityLabel="Add allergy"
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* List of current allergies */}
      {allergies.length > 0 ? (
        <FlatList
          data={allergies}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.allergyList}
          renderItem={({ item, index }) => (
            <View style={styles.allergyItem}>
              <Text style={styles.allergyText}>{item}</Text>
              <TouchableOpacity
                onPress={() => removeAllergy(index)}
                accessible={true}
                accessibilityLabel={`Remove ${item}`}
              >
                <Text style={styles.removeText}>  Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No allergies added yet.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
    alignItems: 'center', // Centers content horizontally
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%', // Ensures the input container spans the full width
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginLeft: 5
  },
  addButton: {
    backgroundColor: '#36c190',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 5
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  allergyList: {
    marginTop: 20,
    width: '100%', // Ensures the list spans the full width
  },
  allergyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  allergyText: {
    fontSize: 16,
    color: '#333',
  },
  removeText: {
    fontSize: 14,
    color: '#ff6f61',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Allergies;
