import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  Platform,
  Alert,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
} from "react-native";

import { colors } from "../theme/colors";
import { adventurerClasses } from "../data/adventurerClasses";

export default function PartyScreen() {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedClass, setSelectedClass] = useState(adventurerClasses[0]);
  const [adventurerName, setAdventurerName] = useState("");
  const PARTY_LIMIT = 3;
  const PARTY_STORAGE_KEY = "checkquest_party";
  const [party, setParty] = useState([]);

  useEffect(() => {
  loadParty();
}, []);

useEffect(() => {
  saveParty();
}, [party]);

async function loadParty() {
  try {
    const savedParty = await AsyncStorage.getItem(PARTY_STORAGE_KEY);

    if (savedParty) {
      setParty(JSON.parse(savedParty));
    }
  } catch (error) {
    console.log("Failed to load party:", error);
  }
}

async function saveParty() {
  try {
    await AsyncStorage.setItem(PARTY_STORAGE_KEY, JSON.stringify(party));
  } catch (error) {
    console.log("Failed to save party:", error);
  }
}

  function createAdventurer() {
        if (party.length >= PARTY_LIMIT) {
            Alert.alert("Party full", `You can only have ${PARTY_LIMIT} adventurers.`);
            return;
        }

        if (!adventurerName.trim()) {
            Alert.alert("Missing name", "Give your adventurer a name first.");
            return;
        }

        const newAdventurer = {
            id: Date.now().toString(),
            name: adventurerName.trim(),
            classId: selectedClass.id,
            className: selectedClass.name,
            role: selectedClass.role,
            icon: selectedClass.icon,
            image: selectedClass.image,
            level: 1,
            xp: 0,
            nextLevelXp: 100,
            excels: selectedClass.excels,
            good: selectedClass.good,
            poor: selectedClass.poor,
            stats: selectedClass.stats,
            statGrowth: selectedClass.statGrowth,
        };

        setParty((current) => [...current, newAdventurer]);
        setAdventurerName("");
        setSelectedClass(adventurerClasses[0]);
        setShowCreate(false);
    }

   function deleteAdventurer(adventurerId) {
        const adventurer = party.find((member) => member.id === adventurerId);
        if (!adventurer) return;

        const message = `Are you sure you want to delete ${adventurer.name}? This will permanently destroy their progress.`;

        // WEB
        if (Platform.OS === "web") {
            const confirmed = window.confirm(message);
            if (!confirmed) return;

            setParty((current) =>
            current.filter((member) => member.id !== adventurerId)
            );
            return;
        }

        // MOBILE
        Alert.alert("Delete Adventurer?", message, [
            { text: "Cancel", style: "cancel" },
            {
            text: "Delete",
            style: "destructive",
            onPress: () => {
                setParty((current) =>
                current.filter((member) => member.id !== adventurerId)
                );
            },
            },
        ]);
}

  if (showCreate) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Choose a Class</Text>

        <View style={styles.classGrid}>
          {adventurerClasses.map((item) => {
            const selected = selectedClass.id === item.id;

            return (
              <Pressable
                key={item.id}
                style={[styles.classCard, selected && styles.selectedClassCard]}
                onPress={() => setSelectedClass(item)}
              >
                <ClassImage item={item} large={false} />

                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.classRole}>{item.role}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailsTop}>
            <ClassImage item={selectedClass} large />

            <View style={styles.detailsTextBox}>
              <Text style={styles.detailsName}>{selectedClass.name}</Text>
              <Text style={styles.detailsRole}>{selectedClass.role}</Text>
              <Text style={styles.description}>
                Excels at {selectedClass.excels.join(", ")} quests.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitleSmall}>Stats</Text>

          {Object.entries(selectedClass.stats).map(([statName, value]) => (
            <StatBar key={statName} label={formatStatName(statName)} value={value} />
          ))}

          <TraitSection title="Excels In" items={selectedClass.excels} color={colors.success} />
          <TraitSection title="Good In" items={selectedClass.good} color={colors.warning} />
          <TraitSection title="Poor In" items={selectedClass.poor} color={colors.danger} />
        </View>

        <Text style={styles.label}>Adventurer Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Example: Sir Aldric"
          placeholderTextColor={colors.muted}
          value={adventurerName}
          onChangeText={setAdventurerName}
        />

        <Pressable style={styles.createButton} onPress={createAdventurer}>
          <Text style={styles.createButtonText}>Create Adventurer</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => setShowCreate(false)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.partyHeader}>
        <Text style={styles.partyTitle}>Your Party</Text>
        <Text style={styles.partyCount}>{party.length}/{PARTY_LIMIT}</Text>
      </View>

        {party.length < PARTY_LIMIT ? (
        <Pressable style={styles.addCard} onPress={() => setShowCreate(true)}>
            <View style={styles.plusCircle}>
            <Text style={styles.plus}>+</Text>
            </View>

            <View>
            <Text style={styles.addTitle}>Create Adventurer</Text>
            <Text style={styles.addText}>Add a new member to your quest party</Text>
            </View>
        </Pressable>
        ) : (
        <View style={styles.fullCard}>
            <Text style={styles.fullTitle}>Party Full</Text>
            <Text style={styles.fullText}>
            You already have {PARTY_LIMIT} adventurers. Choose your party wisely.
            </Text>
        </View>
        )}

      {party.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No adventurers yet</Text>
          <Text style={styles.emptyText}>
            Create your first adventurer. Each class levels faster from certain real-life task types.
          </Text>
        </View>
      )}

      {party.map((member) => (
        <AdventurerCard
            key={member.id}
            adventurer={member}
            onDelete={deleteAdventurer}
         />
      ))}
    </ScrollView>
  );
}

function AdventurerCard({ adventurer, onDelete }) {
  const [showStats, setShowStats] = useState(false);
  const progress = Math.min(adventurer.xp / adventurer.nextLevelXp, 1);

  return (
    <View style={styles.adventurerCard}>
      <ClassImage item={adventurer} large />

      <View style={styles.adventurerInfo}>
        <View style={styles.cardTopRow}>
          <View>
            <Text style={styles.adventurerName}>{adventurer.name}</Text>
            <Text style={styles.adventurerClass}>{adventurer.className}</Text>
          </View>

          <Text style={styles.levelText}>Level {adventurer.level}</Text>
        </View>

        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>XP</Text>
          <Text style={styles.xpLabel}>
            {adventurer.xp} / {adventurer.nextLevelXp}
          </Text>
        </View>

        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${progress * 100}%` }]} />
        </View>

        <Text style={styles.specialty}>
          Excels: {adventurer.excels.join(" • ")}
        </Text>

        <View style={styles.miniStats}>
          {Object.entries(adventurer.stats).map(([statName, value]) => (
            <Text key={statName} style={styles.miniStat}>
              {formatStatLabel(statName)} {value}
            </Text>
          ))}
        </View>

        <Pressable
          style={styles.statsButton}
          onPress={() => setShowStats((current) => !current)}
        >
          <Text style={styles.statsButtonText}>
            {showStats ? "Hide Stats" : "View Stats"}
          </Text>
        </Pressable>

        {showStats && (
          <View style={styles.statsPanel}>
            {Object.entries(adventurer.stats).map(([statName, value]) => (
              <View key={statName} style={styles.statRow}>
                <Text style={styles.statName}>{formatStatLabel(statName)}</Text>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statModifier}>
                  {formatModifier(value)} to rolls
                </Text>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(adventurer.id)}
        >
          <Text style={styles.deleteButtonText}>Delete Adventurer</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ClassImage({ item, large }) {
  if (item.image) {
    return (
      <Image
        source={item.image}
        style={large ? styles.classImageLarge : styles.classImageSmall}
      />
    );
  }

  return (
    <View style={large ? styles.placeholderImageLarge : styles.placeholderImageSmall}>
      <Text style={large ? styles.placeholderIconLarge : styles.placeholderIconSmall}>
        {item.icon}
      </Text>
    </View>
  );
}

function StatBar({ label, value }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>

      <View style={styles.statTrack}>
        <View style={[styles.statFill, { width: `${value}%` }]} />
      </View>

      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function TraitSection({ title, items, color }) {
  return (
    <View style={styles.traitBox}>
      <Text style={[styles.traitTitle, { color }]}>{title}</Text>
      <View style={styles.traitList}>
        {items.map((item) => (
          <View key={item} style={styles.traitPill}>
            <Text style={styles.traitText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function formatStatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getModifier(statValue) {
  return Math.floor((statValue - 10) / 2);
}

function formatModifier(value) {
  const mod = getModifier(value);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function formatStatLabel(stat) {
  const map = {
    strength: "STR",
    dexterity: "DEX",
    constitution: "CON",
    intelligence: "INT",
    wisdom: "WIS",
    charisma: "CHA",
  };

  return map[stat] || stat.toUpperCase();
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
  partyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  partyTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  partyCount: {
    color: colors.warning,
    fontSize: 18,
    fontWeight: "bold",
  },
  addCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: "dashed",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  plusCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    color: colors.accent,
    fontSize: 42,
    fontWeight: "bold",
    marginTop: -4,
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
    padding: 18,
    borderRadius: 18,
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
  adventurerCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  adventurerInfo: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  adventurerName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  adventurerClass: {
    color: colors.accent,
    marginTop: 3,
  },
  levelText: {
    color: colors.warning,
    fontWeight: "bold",
  },
  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  xpLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  xpBar: {
    height: 10,
    backgroundColor: colors.cardLight,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 6,
  },
  xpFill: {
    height: "100%",
    backgroundColor: colors.accent,
  },
  specialty: {
    color: colors.text,
    marginTop: 10,
    fontSize: 12,
  },
  miniStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  miniStat: {
    color: colors.muted,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },
  sectionTitleSmall: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 10,
  },
  classGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  classCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardLight,
    marginBottom: 10,
  },
  selectedClassCard: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  className: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  classRole: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    marginBottom: 18,
  },
  detailsTop: {
    flexDirection: "row",
    gap: 14,
  },
  detailsTextBox: {
    flex: 1,
  },
  detailsName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  detailsRole: {
    color: colors.accent,
    marginTop: 4,
  },
  description: {
    color: colors.muted,
    marginTop: 10,
    lineHeight: 20,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  statLabel: {
    color: colors.text,
    width: 88,
    fontWeight: "bold",
  },
  statTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.cardLight,
    borderRadius: 20,
    overflow: "hidden",
  },
  statFill: {
    height: "100%",
    backgroundColor: colors.accent,
  },
  statValue: {
    color: colors.text,
    width: 32,
    textAlign: "right",
    fontWeight: "bold",
  },
  traitBox: {
    backgroundColor: colors.cardLight,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  traitTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  traitList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  traitPill: {
    backgroundColor: colors.card,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  traitText: {
    color: colors.text,
    fontSize: 12,
  },
  label: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
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
  createButton: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 14,
  },
  createButtonText: {
    color: colors.text,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  cancelButtonText: {
    color: colors.muted,
    fontWeight: "bold",
    textAlign: "center",
  },
  placeholderImageSmall: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: colors.cardLight,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderImageLarge: {
    width: 104,
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.cardLight,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIconSmall: {
    fontSize: 38,
  },
  placeholderIconLarge: {
    fontSize: 54,
  },
  classImageSmall: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },
  classImageLarge: {
    width: 104,
    height: 120,
    borderRadius: 16,
  },
  fullCard: {
  backgroundColor: colors.card,
  borderRadius: 18,
  padding: 18,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: colors.warning,
},
fullTitle: {
  color: colors.warning,
  fontSize: 20,
  fontWeight: "bold",
},
fullText: {
  color: colors.muted,
  marginTop: 6,
  lineHeight: 20,
},
deleteButton: {
  backgroundColor: colors.danger,
  paddingVertical: 6,
  paddingHorizontal: 8,
  borderRadius: 8,
  marginTop: 12,
  alignSelf: "flex-start",
},
deleteButtonText: {
  color: colors.text,
  fontWeight: "bold",
  fontSize: 12,
},
statsButton: {
  backgroundColor: colors.cardLight,
  paddingVertical: 8,
  paddingHorizontal: 10,
  borderRadius: 10,
  marginTop: 12,
  alignSelf: "flex-start",
},
statsButtonText: {
  color: colors.text,
  fontWeight: "bold",
  fontSize: 12,
},
});