import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookDetailsScreen = ({ route }) => {
  const { book } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{book.name}</Text>
      <Text style={styles.label}>Author: {book.author}</Text>
      <Text style={styles.label}>Category: {book.category}</Text>
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
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default BookDetailsScreen;
