import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

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
    axios.get('http://192.168.251.10/getCategories.php')
      .then(response => {
        if (response.data.categories) {
          // Ordena las categorías alfabéticamente
          const sortedCategories = response.data.categories.sort((a, b) => {
            if (a.nombre_categoria.toLowerCase() < b.nombre_categoria.toLowerCase()) return -1;
            if (a.nombre_categoria.toLowerCase() > b.nombre_categoria.toLowerCase()) return 1;
            return 0;
          });
          setCategorias(sortedCategories);
        }
      })
      .catch(error => console.error('Error al obtener categorías', error));
  }, []);

  const seleccionarImagen = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        setImagen(response.assets[0]); // Guarda el objeto completo para usar la URI
      }
    });
  };

  const seleccionarCodigoBarras = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        setCodigoBarras(response.assets[0]); // Se guarda, pero no se previsualiza
      }
    });
  };

  const enviarDatos = async () => {
    if (!nombre || !imagen || !codigoBarras || !existencia || !codigo || !descripcion || !categoriaId) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('imagen', { 
      uri: imagen.uri, 
      type: imagen.type || 'image/jpeg', 
      name: imagen.fileName || imagen.uri.split('/').pop() 
    });
    formData.append('codigo_barras', { 
      uri: codigoBarras.uri, 
      type: codigoBarras.type || 'image/jpeg', 
      name: codigoBarras.fileName || codigoBarras.uri.split('/').pop() 
    });
    formData.append('existencia', existencia);
    formData.append('codigo', codigo);
    formData.append('descripcion', descripcion);
    formData.append('categoria_id', categoriaId);

    try {
      const response = await axios.post('http://192.168.251.10/refaccionesNew.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      alert('Refacción añadida con éxito');
      setNombre('');
      setImagen(null);
      setCodigoBarras(null);
      setExistencia('');
      setCodigo('');
      setDescripcion('');
      setCategoriaId('');
    } catch (error) {
      console.error(error);
      alert('Error al añadir refacción');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        <TouchableOpacity onPress={seleccionarCodigoBarras} style={styles.button}>
          <Text style={styles.buttonText}>{codigoBarras ? 'Código de barras seleccionado' : 'Seleccionar Código de Barras'}</Text>
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

        {imagen && (
          <Image source={{ uri: imagen.uri }} style={styles.image} />
        )}

<TouchableOpacity style={styles.addButton} onPress={enviarDatos}>
  <Text style={styles.addButtonText}>Añadir Refacción</Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ff8c69',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fefefe',
    marginBottom: 15,
    fontSize: 15,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ff8c69',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fefefe',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#ff8c69',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#ff8c69',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    marginTop: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddRefaccionScreen;
