import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookshelfScreen = ({ navigation }) => {
  const [shelves, setShelves] = useState([]);
  const [newShelfName, setNewShelfName] = useState('');
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [shelfToRename, setShelfToRename] = useState(null);
  const [newNameForShelf, setNewNameForShelf] = useState('');

  useEffect(() => {
    loadShelves();
  }, []);

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

  const saveShelves = async (updatedShelves) => {
    try {
      await AsyncStorage.setItem('shelves', JSON.stringify(updatedShelves));
      setShelves(updatedShelves);
    } catch (e) {
      console.error('Failed to save shelves.', e);
    }
  };

  const addShelf = () => {
    if (newShelfName.trim() === '') {
      Alert.alert('Error', 'Shelf name cannot be empty');
      return;
    }

    const updatedShelves = [...shelves, { name: newShelfName, books: [] }];
    setNewShelfName('');
    saveShelves(updatedShelves);
  };

  const deleteShelf = (index) => {
    const updatedShelves = shelves.filter((_, i) => i !== index);
    saveShelves(updatedShelves);
  };

  const openRenameModal = (index) => {
    setShelfToRename(index);
    setNewNameForShelf(shelves[index].name);
    setRenameModalVisible(true);
  };

  const renameShelf = () => {
    if (newNameForShelf.trim() !== '') {
      const updatedShelves = shelves.map((shelf, i) =>
        i === shelfToRename ? { ...shelf, name: newNameForShelf } : shelf
      );
      saveShelves(updatedShelves);
      setRenameModalVisible(false);
      setShelfToRename(null);
    } else {
      Alert.alert('Error', 'Shelf name cannot be empty');
    }
  };

  const viewShelfBooks = (shelf) => {
    navigation.navigate('Books', { books: shelf.books, shelfName: shelf.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookshelves</Text>
      <FlatList
        data={shelves}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.shelfItem}>
            <Text>{item.name}</Text>
            <Button title="View" onPress={() => viewShelfBooks(item)} />
            <Button title="Rename" onPress={() => openRenameModal(index)} />
            <Button title="Delete" onPress={() => deleteShelf(index)} />
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
