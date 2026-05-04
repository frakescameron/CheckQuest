import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../theme/colors";
import { taskTypes } from "../data/adventurerClasses";

const PARTY_STORAGE_KEY = "checkquest_party";
const QUEST_STORAGE_KEY = "checkquest_quests";

const difficulties = [
  {
    id: "very_easy",
    name: "Very Easy",
    description: "A tiny task that only takes a few minutes.",
    xp: 10,
  },
  {
    id: "easy",
    name: "Easy",
    description: "A simple task with low effort.",
    xp: 20,
  },
  {
    id: "normal",
    name: "Normal",
    description: "A regular task that takes focus but is not too difficult.",
    xp: 35,
  },
  {
    id: "hard",
    name: "Hard",
    description: "A task requiring more than an hour of nonstop work.",
    xp: 60,
  },
  {
    id: "boss",
    name: "Boss",
    description: "A major task or project that takes serious effort.",
    xp: 100,
  },
];

export default function TasksScreen() {
  const [party, setParty] = useState([]);
  const [quests, setQuests] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueBy, setDueBy] = useState("");
  const [timerHours, setTimerHours] = useState("");
  const [timerMinutes, setTimerMinutes] = useState("");
  const [difficulty, setDifficulty] = useState(difficulties[2]);
  const [category, setCategory] = useState("");
  const [assignedAdventurerId, setAssignedAdventurerId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveQuests();
    }
  }, [quests, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      saveParty();
    }
  }, [party, dataLoaded]);

  async function loadData() {
    try {
      const savedParty = await AsyncStorage.getItem(PARTY_STORAGE_KEY);
      const savedQuests = await AsyncStorage.getItem(QUEST_STORAGE_KEY);

      if (savedParty) {
        const parsedParty = JSON.parse(savedParty);
        setParty(parsedParty);

        if (parsedParty.length > 0) {
          setAssignedAdventurerId(parsedParty[0].id);
        }
      }

      if (savedQuests) {
        setQuests(JSON.parse(savedQuests));
      }

      setDataLoaded(true);
    } catch (error) {
      console.log("Failed to load quest data:", error);
      setDataLoaded(true);
    }
  }

  async function saveQuests() {
    try {
      await AsyncStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quests));
    } catch (error) {
      console.log("Failed to save quests:", error);
    }
  }

  async function saveParty() {
    try {
      await AsyncStorage.setItem(PARTY_STORAGE_KEY, JSON.stringify(party));
    } catch (error) {
      console.log("Failed to save party:", error);
    }
  }

  const recommendedAdventurer = useMemo(() => {
    if (party.length === 0 || !category) return null;

    return [...party].sort((a, b) => {
      const scoreA = getCategoryScore(a, category);
      const scoreB = getCategoryScore(b, category);
      return scoreB - scoreA;
    })[0];
  }, [party, category]);

  function getCategoryScore(adventurer, questCategory) {
    if (adventurer.excels?.includes(questCategory)) return 3;
    if (adventurer.good?.includes(questCategory)) return 2;
    if (adventurer.poor?.includes(questCategory)) return 0;
    return 1;
  }

  function getXpWithBonus(adventurer, baseXp, questCategory) {
    const score = getCategoryScore(adventurer, questCategory);

    if (score === 3) return Math.round(baseXp * 1.25);
    if (score === 2) return Math.round(baseXp * 1.1);
    if (score === 0) return Math.round(baseXp * 0.75);

    return baseXp;
  }

function applyXp(adventurer, xpAmount, questCategory) {
  let newXp = adventurer.xp + xpAmount;
  let newLevel = adventurer.level;
  let nextLevelXp = adventurer.nextLevelXp;
  let newStats = { ...adventurer.stats };

  const growthStats = adventurer.statGrowth || [];

  while (newXp >= nextLevelXp) {
    newXp -= nextLevelXp;
    newLevel += 1;
    nextLevelXp = Math.round(nextLevelXp * 1.35);

    newStats = levelUpStats(newStats, growthStats);
  }

  return {
    ...adventurer,
    xp: newXp,
    level: newLevel,
    nextLevelXp,
    stats: newStats,
  };
}

  function createQuest() {
    if (!title.trim()) {
      Alert.alert("Missing title", "Give your quest a title.");
      return;
    }

    if (!category) {
      Alert.alert("Missing category", "Choose a quest category.");
      return;
    }

    if (party.length === 0) {
      Alert.alert("No adventurers", "Create an adventurer before assigning quests.");
      return;
    }

    if (!assignedAdventurerId) {
      Alert.alert("Missing adventurer", "Choose an adventurer for this quest.");
      return;
    }

    const assignedAdventurer = party.find(
      (member) => member.id === assignedAdventurerId
    );

    const finalXp = getXpWithBonus(assignedAdventurer, difficulty.xp, category);

    const newQuest = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      dueBy: dueBy.trim(),
      timerHours: timerHours.trim(),
      timerMinutes: timerMinutes.trim(),
      difficulty: difficulty.name,
      baseXp: difficulty.xp,
      xpReward: finalXp,
      category,
      assignedAdventurerId,
      assignedAdventurerName: assignedAdventurer?.name || "Unknown",
      assignedAdventurerClass: assignedAdventurer?.className || "Unknown",
      status: "Created",
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    setQuests((current) => [newQuest, ...current]);

    setTitle("");
    setDescription("");
    setDueBy("");
    setTimerHours("");
    setTimerMinutes("");
    setDifficulty(difficulties[2]);
    setCategory("");
    setAssignedAdventurerId(party[0]?.id || "");
    setShowCreate(false);
  }

  function completeQuest(questId) {
    const quest = quests.find((item) => item.id === questId);
    if (!quest || quest.status === "Completed") return;

    Alert.alert(
      "Complete Quest?",
      `Complete "${quest.title}" and give ${quest.xpReward} XP to ${quest.assignedAdventurerName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: () => {
            setParty((currentParty) =>
              currentParty.map((member) =>
                member.id === quest.assignedAdventurerId
                  ? applyXp(member, quest.xpReward, quest.category)
                  : member
              )
            );

            setQuests((currentQuests) =>
              currentQuests.map((item) =>
                item.id === questId
                  ? {
                      ...item,
                      status: "Completed",
                      completedAt: new Date().toISOString(),
                    }
                  : item
              )
            );
          },
        },
      ]
    );
  }

  function deleteQuest(questId) {
    Alert.alert("Delete Quest?", "Are you sure you want to delete this quest?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setQuests((current) => current.filter((quest) => quest.id !== questId));
        },
      },
    ]);
  }

  if (showCreate) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Quest</Text>

        <Text style={styles.label}>Quest Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Change oil"
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add details about the quest..."
          placeholderTextColor={colors.muted}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Due By</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Friday, May 10"
          placeholderTextColor={colors.muted}
          value={dueBy}
          onChangeText={setDueBy}
        />

        <Text style={styles.orText}>OR</Text>

        <Text style={styles.label}>Timer</Text>
        <View style={styles.timerRow}>
          <TextInput
            style={[styles.input, styles.timerInput]}
            placeholder="Hours"
            placeholderTextColor={colors.muted}
            value={timerHours}
            onChangeText={setTimerHours}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.timerInput]}
            placeholder="Minutes"
            placeholderTextColor={colors.muted}
            value={timerMinutes}
            onChangeText={setTimerMinutes}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.sectionTitle}>Category</Text>

        {!category && (
          <Text style={styles.helperText}>No category selected yet.</Text>
        )}

        <View style={styles.pillWrap}>
          {taskTypes.map((item) => (
            <Pressable
              key={item}
              style={[styles.pill, category === item && styles.selectedPill]}
              onPress={() => setCategory(item)}
            >
              <Text style={styles.pillText}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Difficulty</Text>

        {difficulties.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.difficultyCard,
              difficulty.id === item.id && styles.selectedCard,
            ]}
            onPress={() => setDifficulty(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.difficultyName}>{item.name}</Text>
              <Text style={styles.difficultyDescription}>{item.description}</Text>
            </View>
            <Text style={styles.xpText}>{item.xp} XP</Text>
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Assign Adventurer</Text>

        {recommendedAdventurer ? (
          <Pressable
            style={styles.recommendCard}
            onPress={() => setAssignedAdventurerId(recommendedAdventurer.id)}
          >
            <Text style={styles.recommendTitle}>Recommended Pick</Text>
            <Text style={styles.recommendText}>
              {recommendedAdventurer.name} the {recommendedAdventurer.className}
            </Text>
            <Text style={styles.recommendReason}>
              Best suited for {category} quests.
            </Text>
          </Pressable>
        ) : (
          <Text style={styles.helperText}>
            Choose a category to get a recommended adventurer.
          </Text>
        )}

        {party.map((member) => {
          const adjustedXp = category
            ? getXpWithBonus(member, difficulty.xp, category)
            : difficulty.xp;

          return (
            <Pressable
              key={member.id}
              style={[
                styles.adventurerPick,
                assignedAdventurerId === member.id && styles.selectedCard,
              ]}
              onPress={() => setAssignedAdventurerId(member.id)}
            >
              <Text style={styles.pickName}>{member.name}</Text>
              <Text style={styles.pickClass}>
                {member.className} • {category ? getFitLabel(member, category) : "Pick category first"}
              </Text>
              <Text style={styles.pickXp}>Reward if assigned: {adjustedXp} XP</Text>
            </Pressable>
          );
        })}

        <Pressable style={styles.createButton} onPress={createQuest}>
          <Text style={styles.createButtonText}>Create Quest</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => setShowCreate(false)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Quests</Text>
        <Text style={styles.count}>{quests.length}</Text>
      </View>

      <Pressable style={styles.addCard} onPress={() => setShowCreate(true)}>
        <Text style={styles.plus}>+</Text>
        <View>
          <Text style={styles.addTitle}>Create Quest</Text>
          <Text style={styles.addText}>Add a new task for your party</Text>
        </View>
      </Pressable>

      {quests.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No quests yet</Text>
          <Text style={styles.emptyText}>
            Create a quest, choose a category, set the difficulty, and assign it to an adventurer.
          </Text>
        </View>
      )}

      {quests.map((quest) => (
        <View key={quest.id} style={styles.questCard}>
          <View style={styles.questTopRow}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text style={styles.questXp}>{quest.xpReward} XP</Text>
          </View>

          {!!quest.description && (
            <Text style={styles.questDescription}>{quest.description}</Text>
          )}

          <Text style={styles.questDetail}>Category: {quest.category}</Text>
          <Text style={styles.questDetail}>Difficulty: {quest.difficulty}</Text>
          <Text style={styles.questDetail}>
            Assigned to: {quest.assignedAdventurerName}
          </Text>

          {!!quest.dueBy && <Text style={styles.questDetail}>Due: {quest.dueBy}</Text>}

          {(!!quest.timerHours || !!quest.timerMinutes) && (
            <Text style={styles.questDetail}>
              Timer: {quest.timerHours || "0"}h {quest.timerMinutes || "0"}m
            </Text>
          )}

          <Text
            style={[
              styles.statusText,
              quest.status === "Completed" && styles.completedText,
            ]}
          >
            Status: {quest.status}
          </Text>

          <View style={styles.questButtons}>
            {quest.status !== "Completed" && (
              <Pressable
                style={styles.completeButton}
                onPress={() => completeQuest(quest.id)}
              >
                <Text style={styles.buttonText}>Complete Quest</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteQuest(quest.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function getFitLabel(member, category) {
  if (member.excels?.includes(category)) return "Excellent fit";
  if (member.good?.includes(category)) return "Good fit";
  if (member.poor?.includes(category)) return "Poor fit";
  return "Average fit";
}


function getModifier(statValue) {
  return Math.floor((statValue - 10) / 2);
}

function formatModifier(value) {
  const modifier = getModifier(value);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

function formatStatLabel(statName) {
  const labels = {
    strength: "STR",
    dexterity: "DEX",
    constitution: "CON",
    intelligence: "INT",
    wisdom: "WIS",
    charisma: "CHA",
  };

  return labels[statName] || statName.toUpperCase();
}

function levelUpStats(stats, growthStats = []) {
  const MAX_STAT = 30;
  const newStats = { ...stats };

  // Always +1 to a main stat
  const mainStat =
    growthStats[Math.floor(Math.random() * growthStats.length)];

  if (newStats[mainStat] < MAX_STAT) {
    newStats[mainStat] += 1;
  }

  // 50% chance to increase second stat
  if (Math.random() < 0.5 && growthStats.length > 1) {
    const secondStat =
      growthStats[Math.floor(Math.random() * growthStats.length)];

    if (newStats[secondStat] < MAX_STAT) {
      newStats[secondStat] += 1;
    }
  }

  return newStats;
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  count: {
    color: colors.warning,
    fontSize: 20,
    fontWeight: "bold",
  },
  addCard: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  plus: {
    color: colors.accent,
    fontSize: 42,
    fontWeight: "bold",
  },
  addTitle: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "bold",
  },
  addText: {
    color: colors.text,
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  emptyText: {
    color: colors.muted,
    marginTop: 8,
    lineHeight: 20,
  },
  label: {
    color: colors.text,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardLight,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  orText: {
    color: colors.warning,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 14,
  },
  timerRow: {
    flexDirection: "row",
    gap: 10,
  },
  timerInput: {
    flex: 1,
  },
  helperText: {
    color: colors.muted,
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 10,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  pill: {
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardLight,
  },
  selectedPill: {
    borderColor: colors.accent,
    backgroundColor: colors.cardLight,
  },
  pillText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 12,
  },
  difficultyCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardLight,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  selectedCard: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  difficultyName: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  difficultyDescription: {
    color: colors.muted,
    marginTop: 4,
  },
  xpText: {
    color: colors.warning,
    fontWeight: "bold",
  },
  recommendCard: {
    backgroundColor: colors.cardLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.success,
  },
  recommendTitle: {
    color: colors.success,
    fontWeight: "bold",
  },
  recommendText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  recommendReason: {
    color: colors.muted,
    marginTop: 4,
  },
  adventurerPick: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardLight,
  },
  pickName: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  pickClass: {
    color: colors.muted,
    marginTop: 4,
  },
  pickXp: {
    color: colors.warning,
    marginTop: 6,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  createButtonText: {
    color: colors.text,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  cancelButtonText: {
    color: colors.muted,
    textAlign: "center",
    fontWeight: "bold",
  },
  questCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  questTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  questTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  questXp: {
    color: colors.warning,
    fontWeight: "bold",
  },
  questDescription: {
    color: colors.muted,
    marginTop: 8,
    lineHeight: 20,
  },
  questDetail: {
    color: colors.text,
    marginTop: 8,
  },
  statusText: {
    color: colors.warning,
    marginTop: 10,
    fontWeight: "bold",
  },
  completedText: {
    color: colors.success,
  },
  questButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
  completeButton: {
    backgroundColor: colors.success,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "bold",
  },
});