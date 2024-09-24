import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Updated import

const AddBookScreen = ({ navigation }) => {
  const [bookName, setBookName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedShelf, setSelectedShelf] = useState('');
  const [category, setCategory] = useState('');
  const [shelves, setShelves] = useState([]);

  useEffect(() => {
    // Fetch available shelves to ensure we have the correct list when adding books
    const loadShelves = async () => {
      try {
        const shelvesData = await AsyncStorage.getItem('shelves');
        if (shelvesData !== null) {
          setShelves(JSON.parse(shelvesData));
        }
      } catch (e) {
        console.error('Failed to load shelves.', e);
      }
    };

    loadShelves();
  }, []);

  const saveBook = async () => {
    try {
      if (bookName.trim() === '' || authorName.trim() === '') {
        Alert.alert('Error', 'Both book name and author name are required.');
        return;
      }

      if (category.trim() === '') {
        Alert.alert('Error', 'Please select a category.');
        return;
      }

      // Find the selected shelf to add the book
      const shelfIndex = shelves.findIndex(shelf => shelf.name === selectedShelf);
      if (shelfIndex !== -1) {
        const newBook = { name: bookName, author: authorName, category: category };
        shelves[shelfIndex].books.push(newBook);
        await AsyncStorage.setItem('shelves', JSON.stringify(shelves));
        Alert.alert('Success', 'Book added successfully');
        navigation.goBack(); // Go back to the previous screen after adding
      } else {
        Alert.alert('Error', 'Please select a valid shelf.');
      }
    } catch (e) {
      console.error('Failed to save book.', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Book</Text>
      <TextInput
        style={styles.input}
        placeholder="Book Name"
        value={bookName}
        onChangeText={setBookName}
      />
      <TextInput
        style={styles.input}
        placeholder="Author Name"
        value={authorName}
        onChangeText={setAuthorName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Shelf Name"
        value={selectedShelf}
        onChangeText={setSelectedShelf}
      />
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Fiction" value="Fiction" />
        <Picker.Item label="Non-Fiction" value="Non-Fiction" />
        <Picker.Item label="Science Fiction" value="Science Fiction" />
        <Picker.Item label="Biography" value="Biography" />
      </Picker>
      <Button title="Save Book" onPress={saveBook} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  picker: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default AddBookScreen;
