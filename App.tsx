import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import AddRefaccionScreen from './screens/AddRefaccionScreen';
import RefaccionInfoScreen from './screens/RefaccionInfoScreen';
import EntradasSalidasScreen from './screens/EntradasSalidasScreen';
import RefacDetailsScreen from './screens/RefacDetailsScreen';
import RefaccionesScreen from './screens/RefaccionesScreen';
import CategoryScreen from './screens/CategoryScreen';


// Habilitar react-native-screens
import { enableScreens } from 'react-native-screens';
enableScreens();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Categorias" 
        component={RefaccionesScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Icon name="th-list" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Añadir" 
        component={AddRefaccionScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Entradas y salidas" 
        component={EntradasSalidasScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Icon name="exchange" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Añadir Categoria" 
        component={CategoryScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-text" color={color} size={size} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="RefacDetailsScreen" component={RefacDetailsScreen} />
        <Stack.Screen name="Añadir Nueva Refacción" component={AddRefaccionScreen} />
        <Stack.Screen name="RefaccionInfo" component={RefaccionInfoScreen} /> 
        <Stack.Screen name="Category" component={CategoryScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
