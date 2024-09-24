import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddBookScreen = ({ navigation }) => {
  const [bookName, setBookName] = useState('');

  const addBook = async () => {
    const newBook = { id: Math.random().toString(), name: bookName };
    let library = await AsyncStorage.getItem('library');
    library = library ? JSON.parse(library) : [];
    library.push(newBook);
    await AsyncStorage.setItem('library', JSON.stringify(library));
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Add a Book</Text>
      <TextInput
        placeholder="Enter book name"
        value={bookName}
        onChangeText={(text) => setBookName(text)}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Add" onPress={addBook} />
    </View>
  );
};

export default AddBookScreen;
