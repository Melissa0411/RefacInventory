import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const AddRefaccionScreen = () => {
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState(null);
  const [codigoBarras, setCodigoBarras] = useState(null);
  const [existencia, setExistencia] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.175.10/getCategories.php')
      .then(response => {
        if (response.data.categories) {
          setCategorias(response.data.categories);
        }
      })
      .catch(error => console.error('Error al obtener categorías', error));
  }, []);

  const seleccionarImagen = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        setImagen(response.assets[0].uri);
      }
    });
  };

  const tomarFoto = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        setCodigoBarras(response.assets[0].uri);
      }
    });
  };

  const enviarDatos = async () => {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('imagen', { uri: imagen, type: 'image/jpeg', name: imagen.split('/').pop() });
    formData.append('codigo_barras', { uri: codigoBarras, type: 'image/jpeg', name: codigoBarras.split('/').pop() });
    formData.append('existencia', existencia);
    formData.append('codigo', codigo);
    formData.append('descripcion', descripcion);
    formData.append('categoria_id', categoriaId);

    try {
      const response = await axios.post('http://192.168.137.78/refaccionesNew.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      alert('Refacción añadida con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al añadir refacción');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput value={nombre} onChangeText={setNombre} style={styles.input} />
      <Text style={styles.label}>Existencia:</Text>
      <TextInput value={existencia} onChangeText={setExistencia} keyboardType="numeric" style={styles.input} />
      <Text style={styles.label}>Código:</Text>
      <TextInput value={codigo} onChangeText={setCodigo} style={styles.input} />
      <Text style={styles.label}>Descripción:</Text>
      <TextInput value={descripcion} onChangeText={setDescripcion} style={styles.input} />
      <Text style={styles.label}>Código de Barras:</Text>
      <TouchableOpacity onPress={tomarFoto} style={styles.button}>
        <Text style={styles.buttonText}>{codigoBarras ? 'Código de barras tomado' : 'Tomar foto'}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Categoría:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoriaId}
          onValueChange={(itemValue) => setCategoriaId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona una categoría" value="" />
          {categorias.map((categoria) => (
            <Picker.Item key={categoria.id} label={categoria.nombre_categoria} value={categoria.id} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity onPress={seleccionarImagen} style={styles.button}>
        <Text style={styles.buttonText}>{imagen ? 'Imagen seleccionada' : 'Seleccionar Imagen'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={enviarDatos} style={styles.smallButton}>
        <Text style={styles.smallButtonText}>Añadir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ff8c69',
    marginBottom: 10,
    padding: 5,
  },
  button: {
    backgroundColor: '#ff8c69',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ff8c69',
    marginBottom: 10,
  },
  picker: {
    color: '#000',
  },
  smallButton: {
    backgroundColor: '#ff8c69',
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5,
    width: '50%', // Hacemos el botón más pequeño en términos de ancho
    alignSelf: 'center', // Centrar el botón
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default AddRefaccionScreen;
