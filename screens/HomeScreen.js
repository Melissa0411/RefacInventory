import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí",
          onPress: () => navigation.replace("Login")
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Home</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} color="#ff8c69" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 50, backgroundColor: 'white'},
  title: { fontSize: 24, textAlign: "center", marginBottom: 30 }
});

export default HomeScreen;
