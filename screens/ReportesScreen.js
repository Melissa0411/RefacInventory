import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReportesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reportes Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});

export default ReportesScreen;
