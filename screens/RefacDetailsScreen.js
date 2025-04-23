import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';

const RefacDetailsScreen = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://192.168.251.10/getProducts.php?categoryId=${categoryId}`)
      .then(response => {
        console.log("Datos recibidos:", response.data.products);
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      })
      .catch(error => console.error("Error al obtener productos:", error));
  }, [categoryId]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().startsWith(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={() => navigation.navigate('RefaccionInfo', { product: item })}
    >
      <Card containerStyle={styles.card}>
        {item.imagen ? (
          <Image source={{ uri: item.imagen }} style={styles.image} onError={() => console.log("Error cargando imagen:", item.imagen)} />
        ) : (
          <Text style={styles.noImageText}>Imagen no disponible</Text>
        )}
        <Text style={styles.name}>{item.nombre}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre o código"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {filteredProducts.length === 0 ? (
        <Text style={styles.noProductsText}>No hay productos en esta categoría</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: 'white' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff8c69',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center', // Centra todo el contenido en la pantalla
    marginTop: 15, // Agrega un pequeño margen superior

  },
  searchIcon: {
    fontSize: 18,
    marginRight: 5
  },
  input: { flex: 1, padding: 10 },
  cardContainer: { flex: 1 / 3, padding: 5},
  card: { 
    width: 110, // Tamaño fijo para cada tarjeta
    height: 160, // Tamaño fijo para mantener consistencia
    margin: 2, 
    padding: 10, 
    alignItems: 'center', 
    justifyContent: 'center', // Centra los elementos dentro de la tarjeta
    borderWidth: 1, 
    borderColor: '#ff8c69', 
    borderRadius: 10 
  },
  image: { 
    width: 100, 
    height: 100, 
    resizeMode: 'contain', // Para que la imagen no se recorte
    borderRadius: 10 
  },  
  name: { marginTop: 5, fontSize: 12, textAlign: 'center', color: 'black',   flexWrap: 'wrap'},
  noImageText: { fontSize: 12, color: 'gray', textAlign: 'center', marginTop: 18 },
  noProductsText: { textAlign: 'center', fontSize: 16, marginTop: 20, color: 'gray' },
});

export default RefacDetailsScreen;
