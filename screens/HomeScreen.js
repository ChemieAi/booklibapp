import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchBooks(user.uid);
      } else {
        navigation.replace('Login');
      }
    });

    return unsubscribeAuth;
  }, []);

  const fetchBooks = async (userId) => {
    try {
      const userShelvesRef = firestore().collection('users').doc(userId).collection('shelves');
      const snapshot = await userShelvesRef.get();
      
      const allBooks = [];
      snapshot.forEach((doc) => {
        const shelf = doc.data();
        if (shelf.books) {
          allBooks.push(...shelf.books); // Spread all books from the shelves
        }
      });

      setBooks(allBooks);
      setFilteredBooks(allBooks); // Initialize with all books
    } catch (error) {
      console.error('Error fetching books: ', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = books.filter(
      (book) =>
        book.name.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const logout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login');
    } catch (error) {
      console.log('Error logging out: ', error);
    }
  };

  const renderBookItem = ({ item, index }) => (
    <View style={styles.bookItem}>
      <Text
        style={styles.bookTitle}
        onPress={() => navigation.navigate('BookDetails', { book: item })}
      >
        {item.name}
      </Text>
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
      <View style={styles.spacer} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <View style={styles.spacer} />
      <Button title="Logout" onPress={logout} />
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
