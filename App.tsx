import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import AddRefaccionScreen from './screens/AddRefaccionScreen';
import RefaccionInfoScreen from './screens/RefaccionInfoScreen';
import RefacDetailsScreen from './screens/RefacDetailsScreen';
import RefaccionesScreen from './screens/RefaccionesScreen';
import CategoryScreen from './screens/CategoryScreen';
import RefaccionesListScreen from './screens/RefaccionesListScreen';
import ReportesScreen from './screens/ReportesScreen';
import ReportesEntradasScreen from './screens/ReportesEntradasScreen';
import ReportesSalidasScreen from './screens/ReportesSalidasScreen';
import ScannerScreen from './screens/ScannerScreen';

import { enableScreens } from 'react-native-screens';
import VehiculosScreen from './screens/VehiculosScreen';
enableScreens();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const confirmLogout = (navigation) => {
  Alert.alert(
    "Cerrar sesión",
    "¿Estás seguro de que deseas cerrar sesión?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        onPress: () => navigation.replace('Login'),
        style: "destructive"
      }
    ]
  );
};

const InicioStack = createStackNavigator();
function InicioStackScreen() {
  return (
    <InicioStack.Navigator>
      <InicioStack.Screen 
        name="InicioMain" 
        component={HomeScreen} 
        options={({ navigation }) => ({
          title: 'Inicio',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => confirmLogout(navigation)}
              style={{ marginRight: 15 }}
            >
              <Text style={{ fontSize: 20 }}>👤</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </InicioStack.Navigator>
  );
}

const CategoriasStack = createStackNavigator();
function CategoriasStackScreen() {
  return (
    <CategoriasStack.Navigator>
      <CategoriasStack.Screen name="Categorias" component={RefaccionesScreen} options={{ title: 'Categorías' }} />
    </CategoriasStack.Navigator>
  );
}

const ReporteStack = createStackNavigator();
function ReporteStackScreen() {
  return (
    <ReporteStack.Navigator>
      <ReporteStack.Screen name="Reporte" component={RefaccionesListScreen} options={{ title: 'Generar Reporte' }} />
    </ReporteStack.Navigator>
  );
}

const AñadirRefacStack = createStackNavigator();
function AñadirRefacStackScreen() {
  return (
    <AñadirRefacStack.Navigator>
      <AñadirRefacStack.Screen name="AñadirRefaccion" component={AddRefaccionScreen} options={{ title: 'Añadir Refacción' }} />
    </AñadirRefacStack.Navigator>
  );
}

const CategoriasAdminStack = createStackNavigator();
function CategoriasAdminStackScreen() {
  return (
    <CategoriasAdminStack.Navigator>
      <CategoriasAdminStack.Screen name="AñadirCategoria" component={CategoryScreen} options={{ title: 'Añadir Categoría' }} />
    </CategoriasAdminStack.Navigator>
  );
}

const ReportesEntradasStack = createStackNavigator();
function ReportesEntradasStackScreen() {
  return (
    <ReportesEntradasStack.Navigator>
      <ReportesEntradasStack.Screen name="Entradas" component={ReportesEntradasScreen} options={{ title: 'Reportes de Entradas' }} />
    </ReportesEntradasStack.Navigator>
  );
}

const ReportesSalidasStack = createStackNavigator();
function ReportesSalidasStackScreen() {
  return (
    <ReportesSalidasStack.Navigator>
      <ReportesSalidasStack.Screen name="Salidas" component={ReportesSalidasScreen} options={{ title: 'Reportes de Salidas' }} />
    </ReportesSalidasStack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Inicio" 
        component={InicioStackScreen} 
        options={{ tabBarIcon: () => <Text style={{ fontSize: 15 }}>🏠</Text> }} 
      />
      <Tab.Screen 
        name="Categorías" 
        component={CategoriasStackScreen} 
        options={{ tabBarIcon: () => <Text style={{ fontSize: 15 }}>⚙️</Text> }} 
      />
      <Tab.Screen 
        name="Generar Reporte" 
        component={ReporteStackScreen} 
        options={{ tabBarIcon: () => <Text style={{ fontSize: 15 }}>📝</Text> }} 
      />
      <Tab.Screen 
        name="Añadir Refacción" 
        component={AñadirRefacStackScreen} 
        options={{ tabBarIcon: () => <Text style={{ fontSize: 15 }}>➕</Text> }} 
      />
      <Tab.Screen 
        name="Añadir Categoría" 
        component={CategoriasAdminStackScreen} 
        options={{ tabBarIcon: () => <Text style={{ fontSize: 15 }}>🗂️</Text> }} 
      />
      <Tab.Screen 
        name="Reportes Entradas" 
        component={ReportesEntradasStackScreen} 
        options={{ tabBarIcon: () => <Text style={{ fontSize: 15 }}>📥</Text> }} 
      />
      <Tab.Screen 
        name="Reportes Salidas" 
        component={ReportesSalidasStackScreen} 
        options={{ tabBarIcon: () => <Text style={{ fontSize: 15 }}>📤</Text> }} 
      />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="RefacDetailsScreen" component={RefacDetailsScreen} options={{ title: 'Detalles de Refacción' }} />
        <Stack.Screen name="Añadir Nueva Refacción" component={AddRefaccionScreen} options={{ title: 'Nueva Refacción' }} />
        <Stack.Screen name="RefaccionInfo" component={RefaccionInfoScreen} options={{ title: 'Información de Refacción' }} />
        <Stack.Screen name="Category" component={CategoryScreen} options={{ title: 'Categoría' }} />
        <Stack.Screen name="RefaccionesList" component={RefaccionesListScreen} options={{ title: 'Lista de Refacciones' }} />
        <Stack.Screen name="Reportes" component={ReportesScreen} options={{ title: 'Reportes' }} />
        <Stack.Screen name="ReportesEntradas" component={ReportesEntradasScreen} />
        <Stack.Screen name="ReportesSalidas" component={ReportesSalidasScreen} />
        <Stack.Screen name="Vehiculos" component={VehiculosScreen} />


        <Stack.Screen name="ScannerScreen" component={ScannerScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
