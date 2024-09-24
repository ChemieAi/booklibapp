import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const shelvesData = await AsyncStorage.getItem('shelves');
      if (shelvesData) {
        const shelves = JSON.parse(shelvesData);
        const allBooks = shelves.flatMap(shelf => shelf.books);
        setBooks(allBooks);
        setFilteredBooks(allBooks); // Show all books initially
      }
    } catch (error) {
      console.log('Error fetching books: ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = books.filter(
      (book) =>
        book.name.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const renderBookItem = ({ item, index }) => (
    <View style={styles.bookItem}>
     <Text style={styles.bookTitle} onPress={() => navigation.navigate('BookDetails', { book: item })}>{item.name}</Text>
     <Text style={styles.bookAuthor}>{item.author}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by book name or author"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredBooks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderBookItem}
      />
      <Button title="Add New Book" onPress={() => navigation.navigate('AddBook')} />
      <View style={styles.spacer} />
      <Button title="View Bookshelves" onPress={() => navigation.navigate('Bookshelf')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  spacer: {
    height: 20,
  },
  bookItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#555',
  },
});

export default HomeScreen;
