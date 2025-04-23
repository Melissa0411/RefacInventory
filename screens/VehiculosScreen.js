import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const VehiculosScreen = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  useEffect(() => {
    fetch('http://192.168.251.10/getVehiculos.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) setVehiculos(data.vehiculos);
      })
      .catch(err => console.error('Error al obtener vehículos:', err));

    fetch('http://192.168.251.10/getSalidas.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) setSalidas(data.reportes);
      })
      .catch(err => console.error('Error al obtener salidas:', err));
  }, []);

  const mostrarHistorial = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalVisible(true);
  };

  const historialFiltrado = salidas.filter(
    salida => salida.unidad_economica === vehiculoSeleccionado?.numero_economico
  );

  const renderVehiculo = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>No. ECO: {item.numero_economico}</Text>
        <Text>Placas: {item.placas}</Text>
        <Text>Marca: {item.marca}</Text>
      </View>
      <TouchableOpacity
        style={styles.historialButton}
        onPress={() => mostrarHistorial(item)}
      >
        <Text style={styles.buttonText}>Historial</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistorial = ({ item }) => (
    <View style={styles.historialItem}>
      <Text style={styles.refaccionText}>Refacción: {item.nombre}</Text>
      <Text style={styles.historialText}>Código: {item.codigo}</Text>
      <Text style={styles.historialText}>Motivo: {item.motivo}</Text>
      <Text style={styles.historialText}>Cantidad: {item.cantidad}</Text>
      <Text style={styles.historialText}>Chofer: {item.nombre_chofer}</Text>
      <Text style={styles.historialText}>Fecha: {item.fecha}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={vehiculos}
        keyExtractor={item => item.id.toString()}
        renderItem={renderVehiculo}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Historial de salidas</Text>

          {historialFiltrado.length > 0 ? (
            <FlatList
              data={historialFiltrado}
              keyExtractor={item => item.id.toString()}
              renderItem={renderHistorial}
            />
          ) : (
            <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 20, color: 'gray'}}>
              🚫 NO TIENE HISTORIAL DE SALIDAS 🚫
            </Text>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  historialButton: {
    backgroundColor: '#ff8c69',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 15,
    textAlign: 'left',
    color: '#000000',
  },
  historialItem: {
    paddingVertical: 8,
  },
  historialText: {
    fontSize: 14,
    color: '#333',

  },
  refaccionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff8c69',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VehiculosScreen;
