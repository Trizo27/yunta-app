import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Text } from 'react-native'

import { colors } from '../theme'

import HomeScreen from '../screens/home/HomeScreen'
import EventosScreen from '../screens/folklore/EventosScreen'
import CancionesScreen from '../screens/folklore/CancionesScreen'
import DetalleEventoScreen from '../screens/folklore/DetalleEventoScreen'
import DetalleCancionScreen from '../screens/folklore/DetalleCancionScreen'
import CrearEventoScreen from '../screens/folklore/CrearEventoScreen'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const FolkloreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="Eventos"
        component={EventosScreen}
        options={{ title: 'Peñas y Eventos' }}
      />
      <Stack.Screen
        name="DetalleEvento"
        component={DetalleEventoScreen}
        options={{ title: 'Detalle del Evento' }}
      />
      <Stack.Screen
        name="Canciones"
        component={CancionesScreen}
        options={{ title: 'Cancionero' }}
      />
      <Stack.Screen
        name="DetalleCancion"
        component={DetalleCancionScreen}
        options={{ title: 'Acordes y Letra' }}
      />
      <Stack.Screen
        name="CrearEvento"
        component={CrearEventoScreen}
        options={{ title: 'Nuevo Evento' }}
      />
    </Stack.Navigator>
  )
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Inicio"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 20 }}>{focused ? '🏡' : '🏠'}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Folklore"
          component={FolkloreStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 20 }}>{focused ? '🎸' : '🎵'}</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
