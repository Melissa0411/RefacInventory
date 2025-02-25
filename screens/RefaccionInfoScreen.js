// ProductInfoScreen.js

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const RefaccionInfoScreen = ({ route }) => {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imagen }} style={styles.image} />
      <Text style={styles.name}>{product.nombre}</Text>
      <Text style={styles.description}>{product.descripcion}</Text>
      <Text style={styles.code}>Código: {product.codigo}</Text>
      <Text style={styles.stock}>Existencia: {product.existencia}</Text>
      <Text style={styles.barcodeLabel}>Código de Barras:</Text>
      {product.codigo_barras ? (
        <Image source={{ uri: product.codigo_barras }} style={styles.barcodeImage} />
      ) : (
        <Text style={styles.noBarcodeText}>No hay imagen del código de barras disponible</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,backgroundColor: 'white' },
  image: { width: '100%', height: 200, resizeMode: 'contain' },
  barcodeImage: { width: '100%', height: 100, resizeMode: 'contain', marginTop: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  description: { fontSize: 16, marginTop: 10 },
  code: { fontSize: 16, marginTop: 10, color: 'black' },
  stock: { fontSize: 16, marginTop: 10, color: 'black' },
  barcodeLabel: { fontSize: 16, marginTop: 10, color: 'black' },
  noBarcodeText: { fontSize: 16, marginTop: 10, color: 'red' },
});

export default RefaccionInfoScreen;
