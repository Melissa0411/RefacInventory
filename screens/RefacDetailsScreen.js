import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';

const RefacDetailsScreen = ({ route, navigation }) => {
  const { categoryId } = route.params; // Recibe el ID de la categoría seleccionada
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la búsqueda
  const [filteredProducts, setFilteredProducts] = useState([]); // Estado para los productos filtrados

  useEffect(() => {
    axios.get(`http://192.168.175.10/getProducts.php?categoryId=${categoryId}`)
      .then(response => {
        console.log(response.data.products); // Agrega esto para verificar los datos
        setProducts(response.data.products);
        setFilteredProducts(response.data.products); // Inicializar productos filtrados
      })
      .catch(error => console.error(error));
  }, [categoryId]);

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().startsWith(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('RefaccionInfo', { product: item })}>
      <Card containerStyle={styles.card}>
        <Image source={{ uri: item.imagen }} style={styles.image} />
        <Text style={styles.name}>{item.nombre}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar refacciones..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {filteredProducts.length === 0 ? (
        <Text style={styles.noProductsText}>No hay productos en esta categoría</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={3} // Muestra las tarjetas en 3 columnas
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: 'white' },
  searchInput: { borderColor: '#ff8c69', borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5, backgroundColor: '#ff8c69' },
  cardContainer: { flex: 1 / 3, padding: 5 }, // Ajusta cada tarjeta al 33.3% del ancho
  card: { margin: 0, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ff8c69', borderRadius: 10, },
  image: { width: '100%', height: 100, resizeMode: 'cover' },
  name: { marginTop: 5, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  noProductsText: { textAlign: 'center', fontSize: 16, marginTop: 20, color: 'gray' },
});

export default RefacDetailsScreen;
