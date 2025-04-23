import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseEntradas = await fetch('http://192.168.251.10/getEntradas.php');
        const dataEntradas = await responseEntradas.json();
        if (dataEntradas.success) setEntradas(dataEntradas.reportes);

        const responseSalidas = await fetch('http://192.168.251.10/getSalidas.php');
        const dataSalidas = await responseSalidas.json();
        if (dataSalidas.success) setSalidas(dataSalidas.reportes);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const generateChartData = (data) => {
    const acumuladoPorMes = Array(12).fill(null); // 🔥 Inicializa con "null" en lugar de 0

    data.forEach(item => {
      const fecha = new Date(item.fecha);
      const mesIndex = fecha.getMonth();
      acumuladoPorMes[mesIndex] = (acumuladoPorMes[mesIndex] || 0) + parseInt(item.cantidad, 10);
    });

    return {
      chartData: {
        labels: Array.from({ length: 12 }, (_, i) => (i + 1).toString()), // 🔥 Números 1-12 en el eje X
        datasets: [{ data: acumuladoPorMes }] // 🔥 No mostrará barras para valores "null"
      }
    };
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
    labelColor: () => '#000',
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0,
    withInnerLines: false,
    yAxisLabel: " ", // 🔥 Oculta los números del eje Y
    yAxisSuffix: " ", // 🔥 Ayuda a ocultar valores adicionales
    showBarTops: false,
    showGridLines: false, // 🔥 Evita líneas del fondo
    propsForBackgroundLines: { stroke: '#fff' },
    barStyle: { display: "none" }, // 🔥 Intenta eliminar el eje Y completamente
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>

        {entradas.length > 0 && (() => {
          const { chartData } = generateChartData(entradas);
          return (
            <>
              <Text style={styles.chartTitle}>Entradas por mes</Text>
              <BarChart
                data={chartData}
                width={screenWidth + 40} // ✅ Usa el ancho total de la pantalla
                height={250}
                chartConfig={chartConfig}
                style={[styles.chart, { marginLeft: -70 }]} // ✅ Añade este margen negativo
                fromZero={false} // 🔥 Asegura que el eje Y no se muestre
                showValuesOnTopOfBars={true}
                withHorizontalLabels={false}
                withInnerLines={false}
              />
            </>
          );
        })()}

        {salidas.length > 0 && (() => {
          const { chartData } = generateChartData(salidas);
          return (
            <>
              <Text style={styles.chartTitle}>Salidas por mes</Text>
              <BarChart
                  data={chartData}
                  width={screenWidth + 40} // ✅ Usa el ancho total de la pantalla
                  height={250}
                  chartConfig={chartConfig}
                  style={[styles.chart, { marginLeft: -70 }]} // ✅ Menos margen negativo
                  fromZero={false}
                  showValuesOnTopOfBars={true}
                  withHorizontalLabels={false}
                  withInnerLines={false}
                                  
              />
            </>
          );
        })()}

        <TouchableOpacity
  style={styles.buttonSalida}
  onPress={() => navigation.navigate('Vehiculos')}
>
  <Text style={styles.buttonText}>🚗 Ver Vehiculos</Text>
</TouchableOpacity>


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: 'white' },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  chart: { borderRadius: 8, alignSelf: 'center' }, // 🔥 Centra la gráfica
  buttonEntrada: { backgroundColor: '#ff8c69', padding: 15, marginVertical: 10, borderRadius: 5, width: '80%', alignItems: 'center' },
  buttonSalida: { backgroundColor: '#ff8c69', padding: 15, marginVertical: 10, borderRadius: 5, width: '80%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;
