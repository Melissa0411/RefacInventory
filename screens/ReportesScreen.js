import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform, Share, Linking } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Print from 'react-native-print';
const ReportesScreen = ({ route }) => {
  const { reportType } = route.params; // Recibe el tipo de reporte (entradas o salidas)
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);
  useEffect(() => {
    fetch('http://192.168.251.10/getEntradas.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setEntradas(data.reportes);
        }
      })
      .catch(error => console.error("Error al obtener entradas:", error));

    fetch('http://192.168.251.10/getSalidas.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSalidas(data.reportes);
        }
      })
      .catch(error => console.error("Error al obtener salidas:", error));
  }, []);

  // Función para generar el PDF con imagen y línea de firma
  const generatePDF = async (tipo, datos) => {
    const fechaActual = new Date().toLocaleString();
    let htmlContent = `
      <div style="text-align: center;">
        <img src="https://i0.wp.com/www.apex.mx/wp-content/uploads/2020/04/bonafont-logo.png?ssl=1" width="200" />
        <h1>📋 Reporte de ${tipo}</h1>
      </div>
      <table border="1" style="width: 100%; text-align: left; border-collapse: collapse;">
        <tr>
          <th>Nombre</th>
          <th>Código</th>
          <th>Motivo</th>
          <th>Unidad Económica</th>
          <th>Cantidad</th>
          <th>Fecha</th>
        </tr>
    `;

    datos.forEach(item => {
      htmlContent += `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.codigo}</td>
          <td>${item.motivo}</td>
          <td>${item.unidad_economica}</td>
          <td>${item.cantidad}</td>
          <td>${item.fecha}</td>
        </tr>
      `;
    });

    htmlContent += `
      </table>
      <p style="text-align: right;">Generado el: ${fechaActual}</p>
      <br><br>
      <hr style="width: 50%; margin: auto;" />
      <p style="text-align: center;">Firma del Responsable</p>
    `;

    try {
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `Reporte_${tipo}_${new Date().getTime()}`,
        directory: 'Documents',
      });

      return pdf.filePath;
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

  // Función para imprimir directamente
  const handlePrint = async (tipo, datos) => {
    const filePath = await generatePDF(tipo, datos);
    if (filePath) {
      await Print.print({ filePath });
    }
  };

  // Función para descargar el PDF y abrirlo
const handleDownload = async (tipo, datos) => {
  const filePath = await generatePDF(tipo, datos);
  if (!filePath) {
    Alert.alert("Error", "No se pudo descargar el PDF.");
    return;
  }

  const options = {
    title: `Reporte de ${tipo}`,
    url: `file://${filePath}`, // Ruta del archivo PDF
    type: 'application/pdf', // Tipo de archivo
  };

  try {
    await Share.open(options);
  } catch (error) {
    console.error("Error al compartir el PDF:", error);
  }
};


  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text>Código: {item.codigo}</Text>
      <Text>Motivo: {item.motivo}</Text>
      <Text>Unidad Económica: {item.unidad_economica}</Text>
      <Text>Cantidad: {item.cantidad}</Text>
      <Text>Fecha: {item.fecha}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.smallButton} onPress={() => handlePrint("Entrada", [item])}>
          <Text style={styles.buttonText}>🖨️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallButton, styles.downloadButton]} onPress={() => handleDownload("Entrada", [item])}>
          <Text style={styles.buttonText}>📥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📥 Reportes de Entradas</Text>
      <FlatList
        data={entradas}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
      <Text style={styles.sectionTitle}>📤 Reportes de Salidas</Text>
      <FlatList
        data={salidas}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  title: { fontSize: 18, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', marginTop: 5 },
  smallButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  downloadButton: { backgroundColor: 'green' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});

export default ReportesScreen;
