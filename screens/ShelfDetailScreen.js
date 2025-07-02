// screens/ShelfDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShelfDetailScreen = ({ route, navigation }) => {
  const { shelf } = route.params;
  const [books, setBooks] = useState([]);
  const [shelves, setShelves] = useState([]);

  const fetchBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('books');
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
    } catch (error) {
      console.log('Error fetching books: ', error);
    }
  };

  const fetchShelves = async () => {
    try {
      const storedShelves = await AsyncStorage.getItem('shelves');
      if (storedShelves) {
        setShelves(JSON.parse(storedShelves));
      }
    } catch (error) {
      console.log('Error fetching shelves: ', error);
    }
  };

  const addBookToShelf = async (book) => {
    try {
      const updatedShelves = shelves.map((s) => {
        if (s.name === shelf.name) {
          return { ...s, books: [...s.books, book] };
        }
        return s;
      });
      await AsyncStorage.setItem('shelves', JSON.stringify(updatedShelves));
      fetchShelves();
    } catch (error) {
      console.log('Error adding book to shelf: ', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchShelves();
  }, []);

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.name}</Text>
      <Button title="Add to Shelf" onPress={() => addBookToShelf(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.shelfName}>Books in {shelf.name}:</Text>
      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderBookItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  shelfName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShelfDetailScreen;
