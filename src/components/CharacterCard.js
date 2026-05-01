import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function CharacterCard({ character }) {
  const progress = Math.min(character.xp / character.nextLevelXp, 1);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{character.name}</Text>
      <Text style={styles.class}>{character.className}</Text>

      <Text style={styles.level}>Level {character.level}</Text>

      <View style={styles.xpBar}>
        <View style={[styles.xpFill, { width: `${progress * 100}%` }]} />
      </View>

      <Text style={styles.xpText}>
        {character.xp} / {character.nextLevelXp} XP
      </Text>
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
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  class: {
    color: colors.accent,
    marginTop: 4,
  },
  level: {
    color: colors.text,
    marginTop: 12,
    fontWeight: "bold",
  },
  xpBar: {
    height: 10,
    backgroundColor: colors.cardLight,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 8,
  },
  xpFill: {
    height: "100%",
    backgroundColor: colors.success,
  },
  xpText: {
    color: colors.muted,
    marginTop: 6,
  },
});