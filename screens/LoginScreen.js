import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor completa los campos!");
      return;
    }

    fetch("http://192.168.251.10/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Alert.alert("Éxito", "Inicio de sesión correcto");
        navigation.replace("Home");
      } else {
        Alert.alert("Error", "Usuario o contraseña incorrectos");
      }
    })
    .catch(error => console.error("Error:", error));
  };

  const handlePasswordRecovery = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: "https://i0.wp.com/www.apex.mx/wp-content/uploads/2020/04/danone-bonafont.png?fit=2556%2C1332&ssl=1" }} 
        style={styles.image}
      />
      <Text style={styles.title}>Inicio de Sesión</Text>
      <View style={styles.inputContainer}>
        <Text>👤</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>🔒</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>🔑 Iniciar Sesión</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buttonSecondary} onPress={handlePasswordRecovery}>
        <Text style={styles.buttonText}>❓ ¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 50, backgroundColor: 'white' },
  image: { width: 350, height: 180, marginBottom: 30 },
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

export default LoginScreen;