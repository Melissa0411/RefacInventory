import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';

const RefaccionesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.175.10/getCategories.php')
      .then(response => setCategories(response.data.categories))
      .catch(error => console.error(error));
  }, []);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('RefacDetailsScreen', { categoryId }); // Envía el ID de la categoría
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCategoryPress(item.id)}>
      <Card containerStyle={styles.card}>
        <Image source={{ uri: item.imagen }} style={styles.image} />
        <Text style={styles.name}>{item.nombre_categoria}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: 'white' },
  image: { width: '100%', height: 150 },
  name: { marginTop: 10, fontSize: 18, fontWeight: 'bold' },
  card: { 
    borderWidth: 1,   // Grosor del borde
    borderColor: '#ff8c69', // Color del borde
    borderRadius: 10, // Opcional: para bordes redondeados
  }
});

export default RefaccionesScreen;
