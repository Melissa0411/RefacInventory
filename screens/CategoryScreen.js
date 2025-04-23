import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';

const CategoryScreen = () => {
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [imagenUri, setImagenUri] = useState(null);

  const handleChoosePhoto = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Usuario canceló la selección de imagen');
      } else if (response.error) {
        console.log('Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImagenUri(source);
      }
    });
  };

  const handleSubmit = () => {
    if (nombreCategoria === '' || !imagenUri) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
  
    const formData = new FormData();
    formData.append('nombre_categoria', nombreCategoria);
    formData.append('imagen', {
      uri: imagenUri.uri,
      type: 'image/jpeg',
      name: imagenUri.fileName || 'image.jpg', // Usa el nombre original de la imagen
    });
  
    axios.post('http://192.168.251.10/addCategory.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(response => {
        if (response.data.success) {
          Alert.alert('Éxito', 'Categoría agregada exitosamente');
          setNombreCategoria('');
          setImagenUri(null);
        } else {
          Alert.alert('Error, la categoria ya existe!', response.data.message);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un error al agregar la categoría');
      });
  };
  
  return (
    <View style={styles.container}>
<Text style={styles.label}>Nombre de la Categoría:</Text>
<TextInput
        style={styles.input}
        value={nombreCategoria}
        onChangeText={setNombreCategoria}
      />
      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {imagenUri && (
        <Image source={{ uri: imagenUri.uri }} style={styles.image} />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Añadir Categoría</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold', // Texto en negritas
  },
  input: { borderWidth: 1, borderColor: '#ff8c69', padding: 10, borderRadius: 5 },
  button: { backgroundColor: '#ff8c69', padding: 10, borderRadius: 5, marginVertical: 10 },
  buttonText: { color: 'white', textAlign: 'center', },
  image: { width: 200, height: 200, resizeMode: 'cover', alignSelf: 'center', marginVertical: 10 },
  addButton: { backgroundColor: '#ff8c69', padding: 8, borderRadius: 5, marginVertical: 10, alignSelf: 'center', width: 150 },  
  addButtonText: { color: 'white', textAlign: 'center' },
});

export default CategoryScreen;
