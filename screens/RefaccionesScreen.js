import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';

const RefaccionesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(''); // Estado para el texto de búsqueda

  useEffect(() => {
    axios.get('http://192.168.251.10/getCategories.php')
      .then(response => {
        const sortedCategories = response.data.categories.sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria));
        setCategories(sortedCategories);
      })
      .catch(error => console.error(error));
  }, []);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('RefacDetailsScreen', { categoryId }); 
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCategoryPress(item.id)}>
      <Card containerStyle={styles.card}>
        <Image source={{ uri: item.imagen }} style={styles.image} />
        <Text style={styles.name}>{item.nombre_categoria}</Text>
      </Card>
    </TouchableOpacity>
  );

  // Filtra las categorías según el término de búsqueda
  const filteredCategories = categories.filter(item =>
    item.nombre_categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Buscar por nombre o código"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      <FlatList
        data={filteredCategories} // Usa las categorías filtradas
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff8c69',
    borderRadius: 5,
    marginBottom: 1,
    paddingHorizontal: 10
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 5
  }, 
  container: { flex: 1, padding: 10, backgroundColor: 'white' },
  image: { width: '100%', height: 150 },
  name: { marginTop: 10, fontSize: 18, fontWeight: 'bold' },
  card: { 
    borderWidth: 1,   // Grosor del borde
    borderColor: '#ff8c69', // Color del borde
    borderRadius: 10, // Opcional: para bordes redondeados
  },

});

export default RefaccionesScreen;
