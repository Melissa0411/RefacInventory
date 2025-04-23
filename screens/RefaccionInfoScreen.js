import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RefaccionInfoScreen = ({ route }) => {
  const { product } = route.params;
  const [producto, setProducto] = useState(product);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fetchProducto = () => {
      fetch(`http://192.168.251.10/getProductById.php?id=${product.id}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setProducto(data.product);
          } else {
            console.error("Error al obtener producto:", data.message);
          }
        })
        .catch(error => console.error("Error en la petición:", error));
    };

    fetchProducto();
    const interval = setInterval(fetchProducto, 5000);
    return () => clearInterval(interval);
  }, [product.id]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomReset = () => {
    setScale(1); // vuelve al tamaño original
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageCard}>
        <Image
          source={{ uri: producto.imagen }}
          style={[styles.image, { transform: [{ scale }] }]}
        />

        <View style={styles.zoomButtonsOverlay}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Text style={styles.zoomText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomReset}>
            <Text style={styles.zoomText}>⤾</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>{producto.nombre}</Text>
        <Text style={styles.description}>{producto.descripcion}</Text>
        <Text style={styles.infoText}>Código: {producto.codigo}</Text>
        <Text style={styles.infoText}>Existencia: {producto.existencia}</Text>

        <View style={styles.barcodeContainer}>
          <Text style={styles.barcodeLabel}>Código de Barras:</Text>
          {producto.codigo_barras ? (
            <Image source={{ uri: producto.codigo_barras }} style={styles.barcodeImage} />
          ) : (
            <Text style={styles.noBarcodeText}>No disponible</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCard: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  zoomButtonsOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  zoomButton: {
    backgroundColor: '#ddd',
    borderRadius: 25,
    padding: 10,
    marginLeft: 5,
    elevation: 3,
  },
  zoomText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    color: '#444',
    marginTop: 10,
    textAlign: 'center',
  },
  barcodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  barcodeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  barcodeImage: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  noBarcodeText: {
    fontSize: 16,
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
});

export default RefaccionInfoScreen;
