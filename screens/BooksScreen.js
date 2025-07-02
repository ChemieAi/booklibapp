import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BooksScreen = ({ navigation, route }) => {
  const { books, shelfName } = route.params;
  const [shelfBooks, setShelfBooks] = useState(books);

  const removeBookFromShelf = async (bookIndex) => {
    const updatedBooks = shelfBooks.filter((_, index) => index !== bookIndex);
    setShelfBooks(updatedBooks);

    // Update the specific shelf in AsyncStorage (remove book from shelf but not globally)
    const shelvesData = await AsyncStorage.getItem('shelves');
    const shelves = shelvesData ? JSON.parse(shelvesData) : [];

    const shelfIndex = shelves.findIndex((shelf) => shelf.name === shelfName);
    if (shelfIndex !== -1) {
      shelves[shelfIndex].books = updatedBooks;
      await AsyncStorage.setItem('shelves', JSON.stringify(shelves));
      Alert.alert('Success', 'Book removed from shelf.');
    }
  };

  const renderBookItem = ({ item, index }) => (
    <View style={styles.bookItem}>
      <Text>{item.name}</Text>
      <Text>{item.author}</Text>
      <Button title="Remove" onPress={() => removeBookFromShelf(index)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{shelfName}</Text>
      {shelfBooks.length > 0 ? (
        <FlatList
          data={shelfBooks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBookItem}
        />
      ) : (
        <Text>No books in this shelf.</Text>
      )}
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
  bookItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default BooksScreen;
