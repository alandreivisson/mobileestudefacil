import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Pages/Home";
import Detalhes from "../Pages/Saiba";
import Login from "../Pages/Login";
import Notificacoes from "../Pages/Notificacao";

const Stack = createStackNavigator();

export default function AppRotas() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detalhes"
          component={Detalhes}
         
        />
        <Stack.Screen
          name="Login"
          component={Login}
         
        />
        <Stack.Screen
          name="Notificacoes"
          component={Notificacoes}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}