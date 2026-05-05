import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../theme/colors";
import { nodes, MAP_WIDTH, MAP_HEIGHT } from "../data/mapNodes";
import { locationEvents } from "../data/locationEvents";
import { travelEncounters } from "../data/travelEncounters";

const PARTY_STORAGE_KEY = "checkquest_party";
const GOLD_STORAGE_KEY = "checkquest_gold";

export default function GameScreen() {
  const [party, setParty] = useState([]);
  const [gold, setGold] = useState(0);

  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [adventureStarted, setAdventureStarted] = useState(false);
  const [showEncounter, setShowEncounter] = useState(false);

  const [activeLocationEvent, setActiveLocationEvent] = useState(null);
  const [eventStepId, setEventStepId] = useState("start");
  const [usedRootChoices, setUsedRootChoices] = useState([]);

  const [travelEncounter, setTravelEncounter] = useState(null);

  const currentNode = useMemo(
    () => nodes.find((node) => node.id === currentNodeId),
    [currentNodeId]
  );

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [selectedNodeId]
  );

  const availableNodeIds = currentNode?.connectedTo || [];

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(GOLD_STORAGE_KEY, String(gold));
  }, [gold]);

  async function loadGameData() {
    const savedParty = await AsyncStorage.getItem(PARTY_STORAGE_KEY);
    const savedGold = await AsyncStorage.getItem(GOLD_STORAGE_KEY);

    if (savedParty) setParty(JSON.parse(savedParty));
    if (savedGold) setGold(Number(savedGold));
  }

  function beginAdventure() {
    setAdventureStarted(true);
    setShowEncounter(true);

    const startEvent = locationEvents[currentNodeId];
    setActiveLocationEvent(startEvent || null);
    setEventStepId("start");
    setUsedRootChoices([]);
  }

  function tapNode(nodeId) {
    if (nodeId === currentNodeId) {
      setSelectedNodeId(nodeId);
      return;
    }

    if (!availableNodeIds.includes(nodeId)) {
      Alert.alert("Too far away", "You can only travel to connected nodes.");
      return;
    }

    setSelectedNodeId(nodeId);
  }

  function travelToNode() {
    if (!adventureStarted) {
      Alert.alert("Adventure Not Started", "Press Begin Adventure first.");
      return;
    }

    if (!selectedNode) return;

    if (!availableNodeIds.includes(selectedNode.id)) {
      Alert.alert("Invalid path", "That node is not connected to your current position.");
      return;
    }

    const shouldTriggerTravelEncounter = Math.random() < 0.35;

    if (shouldTriggerTravelEncounter) {
      const randomEncounter =
        travelEncounters[Math.floor(Math.random() * travelEncounters.length)];

      setTravelEncounter({
        ...randomEncounter,
        destinationNodeId: selectedNode.id,
      });

      setSelectedNodeId(null);
      setShowEncounter(false);
      return;
    }

    arriveAtNode(selectedNode.id);
  }

  function arriveAtNode(nodeId) {
    const node = nodes.find((item) => item.id === nodeId);

    setCurrentNodeId(nodeId);
    setSelectedNodeId(null);
    setShowEncounter(true);
    setTravelEncounter(null);

    const locationEvent = locationEvents[nodeId];

    if (locationEvent) {
      setActiveLocationEvent(locationEvent);
      setEventStepId("start");
      setUsedRootChoices([]);
    } else {
      setActiveLocationEvent(null);
      setEventStepId("start");
      setUsedRootChoices([]);
    }

    if (node?.goldReward) {
      setGold((current) => current + node.goldReward);
    }
  }

  function resolveTravelEncounter(choice) {
    if (choice.action === "combat") {
      Alert.alert("Combat Starting", "Attack phase will be connected here.");
    } else {
      Alert.alert(
        "Travel Encounter Complete",
        `${choice.text} attempted. Dice rolls will be connected later.`
      );
    }

    const destinationNodeId = travelEncounter.destinationNodeId;
    setTravelEncounter(null);
    arriveAtNode(destinationNodeId);
  }

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function handleLocationChoice(choice) {
  if (choice.action === "combat") {
    Alert.alert("Combat Starting", "Attack phase will be connected here.");
    setShowEncounter(false);
    return;
  }

  if (choice.action === "travel") {
    Alert.alert("Area Avoided", "You avoided combat and can choose your next road.");
    setShowEncounter(false);
    return;
  }

  if (choice.action === "returnToStart") {
    if (choice.removeChoice) {
      setUsedRootChoices((current) => [...current, choice.removeChoice]);
    }

    setEventStepId("start");
    return;
  }

  if (choice.successNext && choice.failNext) {
    const roll = rollD20();
    const success = roll >= choice.dc;

    Alert.alert(
      success ? "Success!" : "Failed!",
      `You rolled ${roll}. Needed ${choice.dc}.`
    );

    setEventStepId(success ? choice.successNext : choice.failNext);
    return;
  }

  if (choice.next) {
    setEventStepId(choice.next);
  }
}

  function restartAdventure() {
    setCurrentNodeId("start");
    setSelectedNodeId(null);
    setAdventureStarted(false);
    setShowEncounter(false);
    setActiveLocationEvent(null);
    setEventStepId("start");
    setUsedRootChoices([]);
    setTravelEncounter(null);
  }

  const activeStep =
    activeLocationEvent?.steps?.[eventStepId] || activeLocationEvent?.steps?.start;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Adventure Map</Text>
        <Text style={styles.gold}>Gold: {gold}</Text>
      </View>

      <ScrollView horizontal maximumZoomScale={2.5} minimumZoomScale={0.35}>
        <ScrollView maximumZoomScale={2.5} minimumZoomScale={0.35}>
          <ImageBackground
            source={require("../../assets/maps/world-map-with-nodes-and-lines.jpg")}
            style={styles.map}
          >
            {nodes.map((node) => {
              const isCurrent = node.id === currentNodeId;
              const isAvailable = availableNodeIds.includes(node.id);
              const isSelected = node.id === selectedNodeId;

              return (
                <Pressable
                  key={node.id}
                  onPress={() => tapNode(node.id)}
                  style={[
                    styles.node,
                    {
                      left: node.x * 0.55 - 10,
                      top: node.y * 0.55 - 10,
                    },
                    isCurrent && styles.currentNode,
                    adventureStarted && isAvailable && styles.availableNode,
                    isSelected && styles.selectedNode,
                  ]}
                >
                  <Text style={styles.nodeText}>{isCurrent ? "🧍" : ""}</Text>
                </Pressable>
              );
            })}
          </ImageBackground>
        </ScrollView>
      </ScrollView>

      {selectedNode && selectedNode.id !== currentNodeId && (
        <View style={styles.travelPanel}>
          <Text style={styles.panelTitle}>{selectedNode.title}</Text>
          <Text style={styles.panelType}>{selectedNode.type.toUpperCase()}</Text>
          <Text style={styles.panelText}>{selectedNode.description}</Text>

          {adventureStarted ? (
            <Pressable style={styles.travelButton} onPress={travelToNode}>
              <Text style={styles.buttonText}>Travel Here</Text>
            </Pressable>
          ) : (
            <Text style={styles.lockedTravelText}>
              Begin the adventure before traveling.
            </Text>
          )}
        </View>
      )}

      {!adventureStarted && (
        <Pressable style={styles.beginButton} onPress={beginAdventure}>
          <Text style={styles.beginButtonText}>Begin Adventure</Text>
        </Pressable>
      )}

      {travelEncounter && (
        <View style={styles.encounterPanel}>
          <Text style={styles.encounterType}>
            {travelEncounter.type === "combat" ? "TRAVEL COMBAT" : "WILD ENCOUNTER"}
          </Text>
          <Text style={styles.encounterTitle}>{travelEncounter.title}</Text>
          <Text style={styles.encounterText}>{travelEncounter.description}</Text>

          {travelEncounter.choices.map((choice) => (
            <Pressable
              key={choice.text}
              style={styles.choiceButton}
              onPress={() => resolveTravelEncounter(choice)}
            >
              <Text style={styles.choiceText}>
                {choice.text}
                {choice.stat ? ` (${choice.stat} +${choice.dc})` : ""}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {adventureStarted && showEncounter && activeLocationEvent && activeStep && !travelEncounter && (
        <View style={styles.encounterPanel}>
          <Text style={styles.encounterType}>AREA EVENT</Text>
          <Text style={styles.encounterTitle}>{activeLocationEvent.title}</Text>
          <Text style={styles.encounterText}>{activeStep.text}</Text>

          {activeStep.choices
            .filter((choice) => !usedRootChoices.includes(choice.id))
            .map((choice) => (
              <Pressable
                key={choice.text}
                style={styles.choiceButton}
                onPress={() => handleLocationChoice(choice)}
              >
                <Text style={styles.choiceText}>
                  {choice.text}
                  {choice.stat ? ` (${choice.stat} +${choice.dc})` : ""}
                </Text>
              </Pressable>
            ))}
        </View>
      )}

      <Pressable style={styles.restartButton} onPress={restartAdventure}>
        <Text style={styles.restartText}>Restart Run</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    padding: 12,
    backgroundColor: colors.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topTitle: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 18,
  },
  gold: {
    color: colors.warning,
    fontWeight: "bold",
  },
  map: {
    width: MAP_WIDTH * 0.55,
    height: MAP_HEIGHT * 0.55,
  },
  node: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  currentNode: {
    backgroundColor: colors.warning,
    borderColor: "#fff",
    transform: [{ scale: 1.3 }],
  },
  availableNode: {
    backgroundColor: colors.success,
    borderColor: "#fff",
  },
  selectedNode: {
    backgroundColor: colors.accent,
    borderColor: "#fff",
    transform: [{ scale: 1.35 }],
  },
  nodeText: {
    fontSize: 12,
  },
  travelPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 150,
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  panelTitle: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 18,
  },
  panelType: {
    color: colors.accent,
    marginTop: 4,
    fontWeight: "bold",
  },
  panelText: {
    color: colors.muted,
    marginTop: 8,
    lineHeight: 20,
  },
  travelButton: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  buttonText: {
    color: colors.text,
    textAlign: "center",
    fontWeight: "bold",
  },
  lockedTravelText: {
    color: colors.warning,
    marginTop: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  encounterPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardLight,
    maxHeight: "55%",
  },
  encounterType: {
    color: colors.accent,
    fontWeight: "bold",
    marginBottom: 4,
  },
  encounterTitle: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 22,
  },
  encounterText: {
    color: colors.muted,
    marginTop: 6,
    lineHeight: 20,
  },
  choiceButton: {
    backgroundColor: colors.cardLight,
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  choiceText: {
    color: colors.text,
    fontWeight: "bold",
  },
  restartButton: {
    position: "absolute",
    right: 16,
    top: 60,
    backgroundColor: colors.danger,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  restartText: {
    color: colors.text,
    fontWeight: "bold",
  },
  beginButton: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -90 }, { translateY: -30 }],
    width: 180,
    backgroundColor: colors.warning,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#111",
  },
  beginButtonText: {
    color: "#111",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});