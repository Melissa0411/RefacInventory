import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Print from 'react-native-print';

const ReportesSalidasScreen = () => {
  const [salidas, setSalidas] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('http://192.168.251.10/getSalidas.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSalidas(data.reportes);
        }
      })
      .catch(error => console.error("Error al obtener salidas:", error));
  }, []);

  const applyFilter = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (filter === 'semana') {
      return salidas.filter(item => new Date(item.fecha) >= startOfWeek);
    }

    if (filter === 'mes') {
      return salidas.filter(item => new Date(item.fecha) >= startOfMonth);
    }

    return salidas;
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const generateHTML = (tipoReporte, items) => {
    const formatFechaHora = (fechaStr) => {
      const date = new Date(fechaStr);
      const fecha = date.toLocaleDateString('es-ES');
      const hora = date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Mexico_City' // o cámbialo a 'Europe/Madrid' si estás en España
      });
      return `${fecha}<br /><span style="font-size: 12px; color: black;">${hora}</span>`;
    };
  
    return `
      <div style="text-align: center;">
      <br /><br />
        <img src="https://i0.wp.com/www.apex.mx/wp-content/uploads/2020/04/danone-bonafont.png?fit=2556%2C1332&ssl=1" 
             alt="Bonafont Logo" 
             style="width: 200px; margin-bottom: 10px;">
        <h1 style="font-family: Arial, sans-serif;">Reporte de ${tipoReporte}</h1>
      </div>
      <br />
      <table border="1" 
             style="margin: 0 auto; max-width: 95%; width: 95%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th style="padding: 8px;">Nombre</th>
            <th style="padding: 8px; white-space: nowrap;">Código</th>
            <th style="padding: 8px;">Descripción</th>
            <th style="padding: 8px;">Unidad ECO</th>
            <th style="padding: 8px; white-space: nowrap;">Placas</th>
            <th style="padding: 8px; text-align: center;">Cantidad</th>
            <th style="padding: 8px; white-space: nowrap;">Fecha y hora</th>
            <th style="padding: 8px;">Chofer</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="padding: 8px;">${item.nombre}</td>
              <td style="padding: 8px; white-space: nowrap;">${item.codigo}</td>
              <td style="padding: 8px;">${item.motivo}</td>
              <td style="padding: 8px;">${item.unidad_economica}</td>
              <td style="padding: 8px; white-space: nowrap;">${item.placas || 'N/A'}</td>
              <td style="padding: 8px; text-align: center;">${item.cantidad}</td>
              <td style="padding: 8px; text-align: center;">${formatFechaHora(item.fecha)}</td>
              <td style="padding: 8px;">${item.nombre_chofer}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <br /><br />
      <div style="margin-top: 50px; text-align: center; font-family: Arial, sans-serif;">
        <p>______________________________</p>
        <p>Firma chofer</p>
        <br /><br />
        <p>______________________________</p>
        <p>Firma mecánico</p>
        <br /><br />
        <p>______________________________</p>
        <p>Firma almacén</p>
      </div>
    `;
  };
  

  const handlePrint = async (tipoReporte, items) => {
    try {
      const htmlContent = generateHTML(tipoReporte, items);
      await Print.print({ html: htmlContent });
    } catch (error) {
      Alert.alert("Error", "No se pudo imprimir el reporte.");
      console.error("Error al imprimir:", error);
    }
  };

  const handleDownload = async (tipoReporte, items) => {
    try {
      const htmlContent = generateHTML(tipoReporte, items);
      await Print.print({ html: htmlContent }); // Para generar PDF, puedes usar RNHTMLtoPDF si necesitas guardar
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al generar el PDF.");
      console.error("Error:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text>Código: {item.codigo}</Text>
        <Text>Descripción: {item.motivo}</Text>
        <Text>No. ECO: {item.unidad_economica}</Text>
        <Text>Placas: {item.placas || 'N/A'}</Text>
        <Text>Cantidad: {item.cantidad}</Text>
        <Text>Fecha: {item.fecha}</Text>
        <Text>Nombre chofer: {item.nombre_chofer}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.printButton} onPress={() => handlePrint("Salida", [item])}>
          <Text style={styles.buttonText}>🖨️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload("Salida", [item])}>
          <Text style={styles.downloadText}>⬇️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredSalidas = applyFilter();

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'semana' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('semana')}
        >
          <Text style={styles.filterText}>Semanal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'mes' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('mes')}
        >
          <Text style={styles.filterText}>Mensual</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === '' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('')}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSalidas}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  filterButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  filterButtonActive: { backgroundColor: '#ff8c69', borderColor: '#ff8c69' },
  filterText: { fontSize: 16, fontWeight: 'bold', color: 'black' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  textContainer: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' },
  printButton: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  downloadButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  downloadText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});

export default ReportesSalidasScreen;
