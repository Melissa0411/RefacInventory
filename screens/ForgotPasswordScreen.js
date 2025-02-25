import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');

  const handlePasswordRecovery = () => {
    if (emailOrUsername) {
      // Aquí puedes hacer una solicitud al servidor para recuperar la contraseña
      alert("Se ha enviado un correo para recuperar tu contraseña.");
      navigation.goBack(); // Volver a la pantalla de login
    } else {
      alert("Por favor, ingresa un correo electrónico o nombre de usuario.");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: "https://i0.wp.com/www.apex.mx/wp-content/uploads/2020/04/bonafont-logo.png?ssl=1" }} 
        style={styles.image}
      />
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput
        style={[styles.input, { borderColor: '#ff8c69' }]} // Usar el mismo borde color #ff8c69
        placeholder="Correo electrónico o usuario"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
      />
      <Button title="Enviar" onPress={handlePasswordRecovery} color="#ff8c69" />
      <View style={styles.buttonSpacing}>
        <Button 
          title="Regresar" 
          onPress={() => navigation.navigate("Login")} // Regresa a la pantalla de Login
          color="#ff8c69"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 50, backgroundColor: 'white' },
  image: { width: 350, height: 160, marginBottom: 30 }, // Tamaño de la imagen igual al login
  title: { fontSize: 24, textAlign: "center", marginBottom: 30 },
  input: { 
    borderWidth: 1,  // Borde igual al login
    padding: 5,      // Igual relleno
    marginBottom: 10, 
    borderRadius: 10, // Igual radio de borde
    fontSize: 18,     // Igual tamaño de texto
    width: '120%'      // Igual ancho de los inputs
  },
  buttonSpacing: {
    marginTop: 5 // Agrega espacio entre los botones, igual que en la vista de login
  }
});

export default ForgotPasswordScreen;
