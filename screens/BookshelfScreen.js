import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const BookshelfScreen = ({ navigation }) => {
  const [shelves, setShelves] = useState([]);
  const [newShelfName, setNewShelfName] = useState('');
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [shelfToRename, setShelfToRename] = useState(null);
  const [newNameForShelf, setNewNameForShelf] = useState('');
  const [user, setUser] = useState(null);

  // Handle user authentication and load shelves
  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadShelves(user.uid); // Load user-specific shelves
      } else {
        navigation.replace('Login'); // Redirect to login if not authenticated
      }
    });

    return unsubscribeAuth;
  }, []);

  // Load shelves from Firestore for the logged-in user
  const loadShelves = (userId) => {
    const shelvesRef = firestore().collection('users').doc(userId).collection('shelves');
    shelvesRef.onSnapshot(querySnapshot => {
      const shelvesList = [];
      querySnapshot.forEach(doc => {
        shelvesList.push({ id: doc.id, ...doc.data() });
      });
      setShelves(shelvesList);
    });
  };

  // Save shelves to Firestore
  const saveShelves = (shelfName) => {
    const shelvesRef = firestore().collection('users').doc(user.uid).collection('shelves');
    shelvesRef.add({
      name: shelfName,
      books: [],
    })
    .then(() => {
      Alert.alert('Success', 'Shelf added successfully');
      setNewShelfName('');
    })
    .catch(error => {
      console.error('Error adding shelf: ', error);
    });
  };

  // Add a new shelf
  const addShelf = () => {
    if (newShelfName.trim() === '') {
      Alert.alert('Error', 'Shelf name cannot be empty');
      return;
    }
    saveShelves(newShelfName);
  };

  // Delete a shelf from Firestore
  const deleteShelf = (shelfId) => {
    const shelfRef = firestore().collection('users').doc(user.uid).collection('shelves').doc(shelfId);
    shelfRef.delete()
      .then(() => {
        Alert.alert('Success', 'Shelf deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting shelf: ', error);
      });
  };

  // Open modal to rename a shelf
  const openRenameModal = (shelfId, shelfName) => {
    setShelfToRename({ id: shelfId, name: shelfName });
    setNewNameForShelf(shelfName);
    setRenameModalVisible(true);
  };

  // Rename a shelf in Firestore
  const renameShelf = () => {
    if (newNameForShelf.trim() === '') {
      Alert.alert('Error', 'Shelf name cannot be empty');
      return;
    }

    const shelfRef = firestore().collection('users').doc(user.uid).collection('shelves').doc(shelfToRename.id);
    shelfRef.update({ name: newNameForShelf })
      .then(() => {
        Alert.alert('Success', 'Shelf renamed successfully');
        setRenameModalVisible(false);
        setShelfToRename(null);
      })
      .catch(error => {
        console.error('Error renaming shelf: ', error);
      });
  };

  const viewShelfBooks = (shelf) => {
    navigation.navigate('Books', { books: shelf.books, shelfName: shelf.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookshelves</Text>
      <FlatList
        data={shelves}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.shelfItem}>
            <Text>{item.name}</Text>
            <Button title="View" onPress={() => viewShelfBooks(item)} />
            <Button title="Rename" onPress={() => openRenameModal(item.id, item.name)} />
            <Button title="Delete" onPress={() => deleteShelf(item.id)} />
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="New Shelf Name"
        value={newShelfName}
        onChangeText={setNewShelfName}
      />
      <Button title="Add Shelf" onPress={addShelf} />

      {/* Modal for renaming a shelf */}
      <Modal
        visible={renameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Rename Shelf</Text>
            <TextInput
              style={styles.input}
              value={newNameForShelf}
              onChangeText={setNewNameForShelf}
              placeholder="Enter new shelf name"
            />
            <Button title="Save" onPress={renameShelf} />
            <Button title="Cancel" onPress={() => setRenameModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  shelfItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default BookshelfScreen;
