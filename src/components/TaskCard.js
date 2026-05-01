import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../theme/colors";

export default function TaskCard({ task, onStart, onComplete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>

      <Text style={styles.detail}>Difficulty: {task.difficulty}</Text>
      <Text style={styles.detail}>Timer: {task.estimatedMinutes} minutes</Text>
      <Text style={styles.detail}>Reward: {task.xpReward} XP</Text>
      <Text style={styles.status}>Status: {task.status}</Text>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => onStart(task.id)}>
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.completeButton]} onPress={() => onComplete(task.id)}>
          <Text style={styles.buttonText}>Complete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  detail: {
    color: colors.muted,
    marginTop: 6,
  },
  status: {
    color: colors.warning,
    marginTop: 8,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});