import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';

const ScannerScreen = () => {
  const [barcode, setBarcode] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureAndScan = async () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchCamera(options, async (response) => {
      if (response.didCancel || response.errorCode || !response.assets) {
        Alert.alert('Error', 'No se pudo capturar la imagen.');
        return;
      }

      const imageUri = response.assets[0].uri;
      const imagePath = imageUri.replace('file://', '');

      try {
        const imageBase64 = await RNFS.readFile(imagePath, 'base64');
        await scanBarcode(imageBase64);
      } catch (err) {
        console.error('Error al leer imagen:', err);
        Alert.alert('Error', 'No se pudo leer la imagen.');
      }
    });
  };

  const scanBarcode = async (imageBase64) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCdC_2wCnMMGQmdAiZi6FfkHSwnRU82sOU',
        {
          requests: [
            {
              image: { content: imageBase64 },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }
      );

      const detectedText =
        response.data.responses[0]?.textAnnotations?.[0]?.description;

      if (detectedText) {
        const cleanedText = detectedText.trim();
        setBarcode(cleanedText);
        await searchProduct(cleanedText);
      } else {
        Alert.alert('No se detectó un código de barras.');
      }
    } catch (error) {
      console.error('Error al procesar la imagen:', error.response?.data || error);
      Alert.alert(
        'Error',
        'No se pudo procesar la imagen. ¿La API KEY es válida y tienes facturación activa?'
      );
    } finally {
      setLoading(false);
    }
  };

  const searchProduct = async (barcodeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://192.168.251.10/refacciones.php?codigo_barras=${barcodeData}`
      );
      setProduct(response.data);
    } catch (err) {
      setError(
        'Error al buscar el producto. Verifica el código de barras y la conexión.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.captureButton}
        onPress={captureAndScan}
      >
        <Text style={styles.buttonText}>Capturar Código</Text>
      </TouchableOpacity>

      {product && (
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>Información del Producto</Text>
          <Text style={styles.productText}>Nombre: {product.nombre}</Text>
          <Text style={styles.productText}>
            Descripción: {product.descripcion}
          </Text>
          <Text style={styles.productText}>
            Existencia: {product.existencia}
          </Text>
          {product.imagen && (
            <Image
              source={{ uri: product.imagen }}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="blue" />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center' },
  captureButton: {
    backgroundColor: 'blue',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  productInfo: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  productTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  productText: { fontSize: 16, marginBottom: 5 },
  productImage: { width: 200, height: 200, marginTop: 10 },
  error: { color: 'red', fontSize: 16, margin: 20 },
});

export default ScannerScreen;
