import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import PartyScreen from "./src/screens/PartyScreen";
import TasksScreen from "./src/screens/TasksScreen";
import CreateTaskScreen from "./src/screens/CreateTaskScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#0b0f1a" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Party" component={PartyScreen} />
        <Stack.Screen name="Tasks" component={TasksScreen} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} options={{ title: "Create Quest" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}