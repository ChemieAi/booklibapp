import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [shelves, setShelves] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      const library = await AsyncStorage.getItem('library');
      if (library) {
        setShelves(JSON.parse(library));
      }
    };
    fetchLibrary();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Your Library</Text>
      <FlatList
        data={shelves}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />
      <Button title="Add Book" onPress={() => navigation.navigate('AddBook')} />
    </View>
  );
};

export default HomeScreen;
