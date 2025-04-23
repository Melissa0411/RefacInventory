// ... imports
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Picker } from '@react-native-picker/picker';

const RefaccionesListScreen = () => {
  const [refacciones, setRefacciones] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRefaccion, setSelectedRefaccion] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [unidadEconomica, setUnidadEconomica] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [revisoPor, setRevisoPor] = useState('');
  const [fecha] = useState(new Date().toLocaleString());

  const [vehiculos, setVehiculos] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [vehiculoDetalles, setVehiculoDetalles] = useState({ placas: '', marca: '', anio: '' });

  useEffect(() => {
    fetch('http://192.168.251.10/getAllProducts.php')
      .then(response => response.json())
      .then(data => {
        if (data.products && Array.isArray(data.products)) {
          const sortedProducts = data.products.sort((a, b) =>
            a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
          );
          setRefacciones(sortedProducts);
        }
      })
      .catch(error => console.error("Error en la petición:", error));
  }, []);

  const filteredRefacciones = refacciones.filter(item =>
    item.nombre.toLowerCase().includes(search.toLowerCase()) ||
    item.codigo.toLowerCase().includes(search.toLowerCase())
  );

  const openReportModal = (refaccion, operacion) => {
    setSelectedRefaccion({ ...refaccion, operacion });
    setMotivo('');
    setUnidadEconomica('');
    setCantidad('');
    setSelectedVehiculo(null);
    setVehiculoDetalles({ placas: '', marca: '', anio: '' });
    setRevisoPor('');

    if (operacion === 'salida') {
      fetch('http://192.168.251.10/getVehiculos.php')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setVehiculos(data.vehiculos);
          } else {
            Alert.alert("Error", "No se pudieron cargar los vehículos.");
          }
        })
        .catch(error => console.error("Error cargando vehículos:", error));
    }

    setModalVisible(true);
  };

  const handleStockUpdate = async () => {
    if (
      (selectedRefaccion.operacion === 'salida' &&
        (!motivo || !unidadEconomica || !cantidad || !revisoPor || isNaN(cantidad) || cantidad <= 0)) ||
      (selectedRefaccion.operacion === 'entrada' &&
        (!cantidad || isNaN(cantidad) || cantidad <= 0))
    ) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos con valores válidos.");
      return;
    }

    const nuevaExistencia =
      selectedRefaccion.operacion === 'entrada'
        ? Number(selectedRefaccion.existencia) + Number(cantidad)
        : Number(selectedRefaccion.existencia) - Number(cantidad);

    if (nuevaExistencia < 0) {
      Alert.alert("Error", "No puedes realizar una salida mayor al stock disponible.");
      return;
    }

    fetch('http://192.168.251.10/updateStock.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedRefaccion.id,
        nuevaExistencia
      })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          Alert.alert("Error", "No se pudo actualizar el stock.");
          return;
        }

        setRefacciones(prevState =>
          prevState.map(ref =>
            ref.id === selectedRefaccion.id
              ? { ...ref, existencia: nuevaExistencia }
              : ref
          )
        );

        generatePDF();
      })
      .catch(error => console.error("Error al actualizar el stock:", error));
  };

  const generatePDF = async () => {
    const vehiculoSeleccionado = vehiculos.find(v => v.numero_economico === unidadEconomica);

    fetch('http://192.168.251.10/saveReport.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: selectedRefaccion.nombre,
        codigo: selectedRefaccion.codigo,
        movimiento: selectedRefaccion.operacion,
        motivo,
        unidad_economica: unidadEconomica,
        cantidad,
        fecha,
        nombre_chofer: selectedRefaccion.operacion === 'salida' ? revisoPor : '',
        placas: vehiculoSeleccionado?.placas || '',
        marca: vehiculoSeleccionado?.marca || '',
        anio: vehiculoSeleccionado?.anio || ''
      })
    })
      .then(response => response.json())
      .then(async data => {
        if (!data.success) {
          Alert.alert("Error", "No se pudo guardar el reporte.");
          return;
        }

        const htmlContent = `
          <h1 style="text-align: center;">Reporte de Refacción</h1>
          <table border="1" style="width: 100%; text-align: left;">
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Movimiento</th>
              <th>Motivo</th>
              <th>Unidad Económica</th>
              <th>Placas</th>
              <th>Marca</th>
              <th>Año</th>
              <th>Cantidad</th>
              <th>Revisó</th>
              <th>Fecha</th>
            </tr>
            <tr>
              <td>${selectedRefaccion.nombre}</td>
              <td>${selectedRefaccion.codigo}</td>
              <td>${selectedRefaccion.operacion === 'entrada' ? 'Entrada' : 'Salida'}</td>
              <td>${motivo}</td>
              <td>${unidadEconomica}</td>
              <td>${vehiculoSeleccionado?.placas || ''}</td>
              <td>${vehiculoSeleccionado?.marca || ''}</td>
              <td>${vehiculoSeleccionado?.anio || ''}</td>
              <td>${cantidad}</td>
              <td>${selectedRefaccion.operacion === 'salida' ? revisoPor : ''}</td>
              <td>${fecha}</td>
            </tr>
          </table>
        `;

        let file = await RNHTMLtoPDF.convert({
          html: htmlContent,
          fileName: `Reporte_Refaccion_${selectedRefaccion.codigo}_${new Date().getTime()}`,
          directory: 'Documents',
        });

        Alert.alert("PDF generado", `El reporte se ha guardado en: ${file.filePath}`);
        setModalVisible(false);
      })
      .catch(error => console.error("Error al guardar el reporte:", error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Buscar por nombre o código"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredRefacciones}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.nombre}</Text>
            <Text>Código: {item.codigo}</Text>
            <Text>Existencia: {item.existencia}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.buttonEntrada} onPress={() => openReportModal(item, 'entrada')}>
                <Text style={styles.buttonText}>Entrada</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSalida} onPress={() => openReportModal(item, 'salida')}>
                <Text style={styles.buttonText}>Salida</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRefaccion && (
              <>
                <Text style={styles.title}>
                  {selectedRefaccion.operacion === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
                </Text>

                {selectedRefaccion.operacion === 'salida' && (
                  <>
                    <View style={[styles.formInput, { paddingVertical: 0, paddingHorizontal: 0 }]}>
                      <Picker
                        selectedValue={selectedVehiculo}
                        onValueChange={(itemValue) => {
                          setSelectedVehiculo(itemValue);
                          setUnidadEconomica(itemValue);
                        }}
                        style={{ color: selectedVehiculo ? 'black' : '#999' }}
                      >
                        <Picker.Item label="Seleccione No. ECO" value={null} color="#999" />
                        {vehiculos.map(vehiculo => (
                          <Picker.Item
                            key={vehiculo.id}
                            label={vehiculo.numero_economico}
                            value={vehiculo.numero_economico}
                            color="black"
                          />
                        ))}
                      </Picker>
                    </View>

                    <TextInput
                      style={styles.formInput}
                      placeholder="Descripción de servicio"
                      value={motivo}
                      onChangeText={setMotivo}
                    />
                    <TextInput
                      style={styles.formInput}
                      placeholder="Nombre chofer"
                      value={revisoPor}
                      onChangeText={setRevisoPor}
                    />
                  </>
                )}

                <TextInput
                  style={styles.formInput}
                  placeholder="Cantidad"
                  value={cantidad}
                  onChangeText={setCantidad}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.buttonGenerarReporte} onPress={handleStockUpdate}>
                  <Text style={styles.buttonText}>Generar reporte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCancelar} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
    paddingHorizontal: 10
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 5
  },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  buttonEntrada: { backgroundColor: '#ff8c69', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  buttonSalida: { backgroundColor: '#ff6347', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  buttonGenerarReporte: { backgroundColor: '#ff8c69', padding: 15, borderRadius: 8, width: '80%', alignItems: 'center', marginVertical: 5 },
  buttonCancelar: { backgroundColor: '#ff6347', padding: 15, borderRadius: 8, width: '80%', alignItems: 'center', marginVertical: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { padding: 20, backgroundColor: 'white', borderRadius: 10, width: '80%', alignItems: 'center' },
  formInput: {
    borderWidth: 1,
    borderColor: '#ff8c69',
    borderRadius: 5,
    paddingVertical: 11,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
    fontSize: 14
  }
});

export default RefaccionesListScreen;
