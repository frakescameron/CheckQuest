import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { analyzeTask } from "../services/difficultyAnalyzer";
import { colors } from "../theme/colors";

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [analysis, setAnalysis] = useState(null);

  function handleAnalyze() {
    if (!title.trim()) {
      Alert.alert("Missing task", "Enter a quest first.");
      return;
    }

    const result = analyzeTask(title);
    setAnalysis(result);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Quest Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: Deep clean garage"
        placeholderTextColor={colors.muted}
        value={title}
        onChangeText={setTitle}
      />

      <Pressable style={styles.button} onPress={handleAnalyze}>
        <Text style={styles.buttonText}>Analyze Quest</Text>
      </Pressable>

      {analysis && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Quest Analysis</Text>
          <Text style={styles.resultText}>Difficulty: {analysis.difficulty}</Text>
          <Text style={styles.resultText}>Timer: {analysis.estimatedMinutes} minutes</Text>
          <Text style={styles.resultText}>XP Reward: {analysis.xpReward}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  label: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultCard: {
    backgroundColor: colors.card,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    color: colors.muted,
    marginTop: 6,
  },
});