import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');

  const handlePasswordRecovery = () => {
    if (emailOrUsername) {
      Alert.alert("Éxito", "Se ha enviado un correo para recuperar tu contraseña.");
      navigation.goBack();
    } else {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico o nombre de usuario.");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: "https://i0.wp.com/www.apex.mx/wp-content/uploads/2020/04/bonafont-logo.png?ssl=1" }} 
        style={styles.image}
      />
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <View style={styles.inputContainer}>
        <Text>📧</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Correo electrónico o usuario"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handlePasswordRecovery}>
        <Text style={styles.buttonText}>📩 Enviar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>🔙 Regresar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 50, backgroundColor: 'white' },
  image: { width: 350, height: 160, marginBottom: 30 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff8c69',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '120%'
  },
  input: { 
    flex: 1,
    padding: 10, 
    fontSize: 18
  },
  button: { backgroundColor: '#ff8c69', padding: 15, marginVertical: 10, borderRadius: 5, width: '120%', alignItems: 'center' },
  buttonSecondary: { backgroundColor: '#ddd', padding: 15, marginVertical: 5, borderRadius: 5, width: '120%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default ForgotPasswordScreen;