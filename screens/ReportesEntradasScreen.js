import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Print from 'react-native-print';

const ReportesEntradasScreen = () => {
  const [entradas, setEntradas] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('http://192.168.251.10/getEntradas.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setEntradas(data.reportes);
        }
      })
      .catch(error => console.error("Error al obtener entradas:", error));
  }, []);

  const applyFilter = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Inicio de la semana
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Inicio del mes

    if (filter === 'semana') {
      return entradas.filter(item => {
        const reportDate = new Date(item.fecha); 
        return reportDate >= startOfWeek;
      });
    }

    if (filter === 'mes') {
      return entradas.filter(item => {
        const reportDate = new Date(item.fecha);
        return reportDate >= startOfMonth;
      });
    }

    return entradas; 
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const handlePrint = async (tipoReporte, items) => {
    try {
      let htmlContent = `
        <div style="text-align: center;">
        <br /><br />
          <img src="https://i0.wp.com/www.apex.mx/wp-content/uploads/2020/04/danone-bonafont.png?fit=2556%2C1332&ssl=1" 
               alt="Bonafont Logo" 
               style="width: 200px; margin-bottom: 5px;">
          <h1 style="text-align: center; font-family: Arial, sans-serif;">Reporte de ${tipoReporte}</h1>
        </div>
   <br />
        <table border="1" style="width: 100%; text-align: left; border-collapse: collapse; font-family: Arial, sans-serif;">
          <thead style="background-color: #f2f2f2;">
            <tr>
              <th style="padding: 8px;">Nombre</th>
              <th style="padding: 8px;">Código</th>
              <th style="padding: 8px;">Cantidad</th>
              <th style="padding: 8px;">Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(item => `
                <tr>
                  <td style="padding: 8px;">${item.nombre}</td>
                  <td style="padding: 8px;">${item.codigo}</td>
                  <td style="padding: 8px;">${item.cantidad}</td>
                  <td style="padding: 8px;">${item.fecha}</td>
                </tr>
              `)
              .join('')}
          </tbody>
        </table>
  
        <div style="margin-top: 50px; text-align: center; font-family: Arial, sans-serif;">
        <br />
          <p>______________________________</p>
        <p>Firma de autorizacion</p>
           
        </div>
      `;
  
      // Enviar directamente a la vista de impresión
      await Print.print({ html: htmlContent });
  
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al imprimir.");
      console.error("Error al imprimir:", error);
    }
  };

  const handleDownload = async (tipoReporte, items) => {
    try {
      let htmlContent = generateHTML(tipoReporte, items);
      await Print.print({ html: htmlContent });
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al generar el PDF.");
      console.error("Error:", error);
    }
  };

  const generateHTML = (tipoReporte, items) => {
    return `
      <div style="text-align: center;">
      <br />
      <br />
        <img src="https://i0.wp.com/www.apex.mx/wp-content/uploads/2020/04/danone-bonafont.png?fit=2556%2C1332&ssl=1" 
             alt="Bonafont Logo" 
             style="width: 200px; margin-bottom: 5px;">
        <h1 style="text-align: center; font-family: Arial, sans-serif;">Reporte de ${tipoReporte}</h1>
      </div>

      <table border="1" style="width: 100%; text-align: left; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th style="padding: 8px;">Nombre</th>
            <th style="padding: 8px;">Código</th>
            <th style="padding: 8px;">Cantidad</th>
            <th style="padding: 8px;">Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(item => `
              <tr>
                <td style="padding: 8px;">${item.nombre}</td>
                <td style="padding: 8px;">${item.codigo}</td>
                <td style="padding: 8px;">${item.cantidad}</td>
                <td style="padding: 8px;">${item.fecha}</td>
              </tr>
            `)
            .join('')}
        </tbody>
      </table>

      <div style="margin-top: 50px; text-align: center; font-family: Arial, sans-serif;">
        <p>______________________________</p>
        <p>Firma del Responsable</p>
      </div>
    `;
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text>Código: {item.codigo}</Text>
        <Text>Cantidad: {item.cantidad}</Text>
        <Text>Fecha: {item.fecha}</Text>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.printButton} onPress={() => handlePrint("Entrada", [item])}>
          <Text style={styles.buttonText}>🖨️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload("Entrada", [item])}>
          <Text style={styles.downloadText}>⬇️</Text>
        </TouchableOpacity>


      </View>
    </View>
  );

  const filteredEntradas = applyFilter();

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
        data={filteredEntradas}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
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
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  textContainer: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' },
  printButton: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  downloadButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  downloadText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});

export default ReportesEntradasScreen;
