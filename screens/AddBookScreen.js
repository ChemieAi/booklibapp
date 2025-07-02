import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddBookScreen = ({ navigation }) => {
  const [bookName, setBookName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedShelf, setSelectedShelf] = useState('');
  const [category, setCategory] = useState('');
  const [shelves, setShelves] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadShelves(user.uid); // Load shelves for the logged-in user
      } else {
        navigation.replace('Login');
      }
    });

    return unsubscribeAuth;
  }, []);

  const loadShelves = (userId) => {
    const shelvesRef = firestore().collection('users').doc(userId).collection('shelves');
    shelvesRef.onSnapshot(querySnapshot => {
      const shelvesList = [];
      querySnapshot.forEach(doc => {
        shelvesList.push({ id: doc.id, ...doc.data() });
      });
      setShelves(shelvesList);
      if (shelvesList.length > 0) {
        setSelectedShelf(shelvesList[0].id); // Select the first shelf by default
      }
    });
  };

  const saveBook = () => {
    if (bookName.trim() === '' || authorName.trim() === '') {
      Alert.alert('Error', 'Both book name and author name are required.');
      return;
    }

    if (category.trim() === '') {
      Alert.alert('Error', 'Please select a category.');
      return;
    }

    const shelfRef = firestore().collection('users').doc(user.uid).collection('shelves').doc(selectedShelf);
    shelfRef.update({
      books: firestore.FieldValue.arrayUnion({ name: bookName, author: authorName, category })
    })
    .then(() => {
      Alert.alert('Success', 'Book added successfully');
      navigation.goBack();
    })
    .catch(error => {
      console.error('Error adding book: ', error);
    });
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
      <Picker
        selectedValue={selectedShelf}
        onValueChange={(itemValue) => setSelectedShelf(itemValue)}
        style={styles.picker}
      >
        {shelves.map((shelf) => (
          <Picker.Item key={shelf.id} label={shelf.name} value={shelf.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Horror" value="Horror" />
        <Picker.Item label="Romance&Love" value="Romance&Love" />
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
