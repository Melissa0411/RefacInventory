import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Validar que los campos no estén vacíos
    if (!username || !password) {
      Alert.alert("Error", "Por favor completa los campos!");
      return; // No continuar si algún campo está vacío
    }

    // Si los campos están completos, hacer la solicitud al servidor
    fetch("http://192.168.175.10/login.php", { // Cambia la IP si usas un dispositivo físico
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
    navigation.navigate("ForgotPassword"); // Redirige a la vista de "Olvidar Contraseña"
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: "https://i0.wp.com/www.apex.mx/wp-content/uploads/2020/04/bonafont-logo.png?ssl=1" }} 
        style={styles.image}
      />
      <Text style={styles.title}>Inicio de Sesión</Text>
      <TextInput 
        style={[styles.input, { borderColor: '#ff8c69' }]} // Cambiar borde a color #ff8c69
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput 
        style={[styles.input, { borderColor: '#ff8c69' }]} // Cambiar borde a color #ff8c69
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button 
        title="Iniciar Sesión" 
        onPress={handleLogin} 
        color="#ff8c69" // Cambiar el color del botón
      />
      <View style={styles.buttonSpacing}>
        <Button 
          title="¿Olvidaste tu contraseña?" 
          onPress={handlePasswordRecovery} // Redirige a la vista de "Olvidar Contraseña"
          color="#ff8c69" // Cambiar el color del botón
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 50, backgroundColor: 'white' },
  image: { width: 350, height: 160, marginBottom: 30 }, // Establece el tamaño de la imagen
  title: { fontSize: 24, textAlign: "center", marginBottom: 30 },
  input: { 
    borderWidth: 1,   // Aumenta el grosor del borde
    padding: 5,      // Aumenta el relleno dentro de los inputs
    marginBottom: 10, 
    borderRadius: 10, // Aumenta el radio del borde para hacerlo más redondeado
    fontSize: 18,     // Aumenta el tamaño del texto dentro de los inputs
    width: '120%'      // Ajusta el ancho de los inputs para que sean más grandes
  },
  buttonSpacing: {
    marginTop: 5 // Agrega espacio entre los botones
  }
});

export default LoginScreen;
