import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../theme/colors";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CheckQuest</Text>
      <Text style={styles.subtitle}>
        Turn real-life tasks into RPG quests.
      </Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Party")}>
        <Text style={styles.buttonText}>View Party</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Tasks")}>
        <Text style={styles.buttonText}>View Quests</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 36,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: colors.cardLight,
    padding: 16,
    borderRadius: 14,
  },
  buttonText: {
    color: colors.text,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});