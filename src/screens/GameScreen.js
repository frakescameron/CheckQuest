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

const PARTY_STORAGE_KEY = "checkquest_party";
const GOLD_STORAGE_KEY = "checkquest_gold";

const MAP_WIDTH = 1148;
const MAP_HEIGHT = 1200;

const nodes = [
  {
    id: "start",
    label: "Start",
    x: 99,
    y: 278,
    connectedTo: ["coast_road", "central_crossing", "island"],
    title: "The Road Begins",
    type: "start",
    description: "Your party begins the adventure near the western coast.",
    options: ["Search the road", "Move carefully", "Make camp"],
  },
    {
    id: "island",
    label: "island",
    x: 47,
    y: 498,
    connectedTo: ["lower_crossing", "central_crossing", "south_coast", "start"],
    title: "The Second Island",
    type: "event",
    description: "Your party begins the adventure near the western coast.",
    options: ["Search the road", "Move carefully", "Make camp"],
  },
  {
    id: "coast_road",
    label: "Coast Road",
    x: 335,
    y: 130,
    connectedTo: ["central_crossing", "start"],
    title: "Coast Road",
    type: "event",
    description: "A windy cliffside road overlooks the sea.",
    options: ["Scout ahead", "Travel quickly", "Search for supplies"],
  },
  {
    id: "central_crossing",
    label: "Crossing",
    x: 430,
    y: 447,
    connectedTo: ["start", "coast_road", "lower_crossing", "east_gate", "island", "ruin_path"],
    title: "Central Crossing",
    type: "event",
    description: "Several roads meet at a worn stone crossing.",
    options: ["Follow tracks", "Inspect the area", "Move onward"],
  },
  {
    id: "south_coast",
    label: "South Coast",
    x: 196,
    y: 742,
    connectedTo: ["island", "south_bridge", "lower_crossing"],
    title: "South Coast",
    type: "event",
    description: "Waves crash against the rocks below.",
    options: ["Search wreckage", "Avoid the cliffs", "Rest briefly"],
  },
  {
    id: "south_bridge",
    label: "Old Bridge",
    x: 315,
    y: 805,
    connectedTo: ["south_coast", "lower_crossing", "southern_pass"],
    title: "Old Bridge",
    type: "event",
    description: "An old bridge groans under your party’s weight.",
    options: ["Cross slowly", "Repair loose stones", "Take another path"],
  },
  {
    id: "lower_crossing",
    label: "Lower Crossing",
    x: 423,
    y: 580,
    connectedTo: ["central_crossing", "south_bridge", "southern_pass", "river_fork", "south_coast", "island", "eastern_ruins"],
    title: "Lower Crossing",
    type: "event",
    description: "A narrow crossing leads deeper into the wildlands.",
    options: ["Push forward", "Survey the land", "Check supplies"],
  },
  {
    id: "southern_pass",
    label: "Southern Pass",
    x: 470,
    y: 890,
    connectedTo: ["lower_crossing", "deep_south", "eastern_ruins", "south_bridge"],
    title: "Southern Pass",
    type: "event",
    description: "A rough path cuts through broken hills.",
    options: ["Climb carefully", "Look for shortcuts", "Press on"],
  },
  {
    id: "deep_south",
    label: "Deep South",
    x: 534,
    y: 1009,
    connectedTo: ["southern_pass", "final_road", "far_east"],
    title: "Deep South",
    type: "event",
    description: "The air grows still. Something watches from the hills.",
    options: ["Stay alert", "Sneak through", "Call out"],
  },
  {
    id: "final_road",
    label: "Final Road",
    x: 400,
    y: 1130,
    connectedTo: ["deep_south"],
    title: "Final Road",
    type: "boss",
    description: "The final road waits beyond the southern edge of the map.",
    options: ["Continue"],
  },
  {
    id: "east_gate",
    label: "East Gate",
    x: 555,
    y: 410,
    connectedTo: ["central_crossing", "north_fork", "east_falter"],
    title: "East Gate",
    type: "event",
    description: "A guarded trail leads east into dangerous country.",
    options: ["Approach openly", "Sneak past", "Study the gate"],
  },
    {
    id: "east_falter",
    label: "East Falter",
    x: 685,
    y: 428,
    connectedTo: ["east_gate", "north_fork", "east_split", "ruin_path"],
    title: "East Gate",
    type: "event",
    description: "A guarded trail leads east into dangerous country.",
    options: ["Approach openly", "Sneak past", "Study the gate"],
  },
  {
    id: "north_fork",
    label: "North Fork",
    x: 600,
    y: 260,
    connectedTo: ["east_gate", "east_split"],
    title: "North Fork",
    type: "event",
    description: "The trail splits near rocky hills.",
    options: ["Take the high road", "Search the trail", "Rest"],
  },
  {
    id: "north_peak",
    label: "North Peak",
    x: 795,
    y: 211,
    connectedTo: ["north_fork", "east_split"],
    title: "North Peak",
    type: "reward",
    description: "From the high ground, your party finds an old supply cache.",
    options: ["Claim supplies"],
    goldReward: 25,
  },
  {
    id: "east_split",
    label: "East Split",
    x: 725,
    y: 300,
    connectedTo: ["north_fork", "north_peak", "east_lake", "east_falter"],
    title: "East Split",
    type: "event",
    description: "A dangerous split in the road forces a decision.",
    options: ["Go toward the lake", "Follow the ruins", "Scout first"],
  },
  {
    id: "east_lake",
    label: "Lake Road",
    x: 915,
    y: 515,
    connectedTo: ["east_split", "ruin_path"],
    title: "Lake Road",
    type: "event",
    description: "A quiet lake reflects the mountains. Too quiet.",
    options: ["Investigate", "Avoid the water", "Move fast"],
  },
  {
    id: "ruin_path",
    label: "Ruin Path",
    x: 783,
    y: 650,
    connectedTo: ["east_falter", "east_lake", "eastern_ruins", "far_east", "east_outpost", "central_crossing"],
    title: "Ruin Path",
    type: "event",
    description: "Broken stones mark the way to ancient ruins.",
    options: ["Read the markings", "Search for traps", "Continue"],
  },
  {
    id: "eastern_ruins",
    label: "Eastern Ruins",
    x: 625,
    y: 735,
    connectedTo: ["southern_pass", "ruin_path", "far_east", "lower_crossing"],
    title: "Eastern Ruins",
    type: "reward",
    description: "Your party finds gold hidden beneath loose stone.",
    options: ["Take the gold"],
    goldReward: 40,
  },
  {
    id: "far_east",
    label: "Far East",
    x: 870,
    y: 815,
    connectedTo: ["ruin_path", "eastern_ruins", "east_outpost", "deep_south"],
    title: "Far East",
    type: "shop",
    description: "A strange merchant waits near the road.",
    options: ["Browse wares", "Move on"],
  },
  {
    id: "east_outpost",
    label: "Outpost",
    x: 975,
    y: 652,
    connectedTo: ["far_east", "ruin_path"],
    title: "Outpost",
    type: "event",
    description: "A lonely outpost stands at the edge of the road.",
    options: ["Enter", "Watch from afar", "Leave"],
  },
];

export default function GameScreen() {
  const [party, setParty] = useState([]);
  const [gold, setGold] = useState(0);
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showEncounter, setShowEncounter] = useState(true);
  const [adventureStarted, setAdventureStarted] = useState(false);

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
    if (!selectedNode) return;

    if (!availableNodeIds.includes(selectedNode.id)) {
      Alert.alert("Invalid path", "That node is not connected to your current position.");
      return;
    }

    setCurrentNodeId(selectedNode.id);
    setSelectedNodeId(null);
    setShowEncounter(true);

    if (selectedNode.goldReward) {
      setGold((current) => current + selectedNode.goldReward);
    }
  }

  function resolveEncounter(choice) {
    setShowEncounter(false);

    Alert.alert(
      "Encounter Complete",
      `${choice} completed. Combat and dice rolls will be added next.`
    );
  }

  function restartAdventure() {
    setCurrentNodeId("start");
    setSelectedNodeId(null);
    setShowEncounter(true);
  }

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
                    isAvailable && styles.availableNode,
                    isSelected && styles.selectedNode,
                  ]}
                >
                  <Text style={styles.nodeText}>
                    {isCurrent ? "🧍" : ""}
                  </Text>
                </Pressable>
              );
            })}
          </ImageBackground>
        </ScrollView>
      </ScrollView>

      {selectedNode && selectedNode.id !== currentNodeId && (
        <View style={styles.travelPanel}>
          <Text style={styles.panelTitle}>{selectedNode.title}</Text>
          <Text style={styles.panelText}>{selectedNode.type.toUpperCase()}</Text>

          <Pressable style={styles.travelButton} onPress={travelToNode}>
            <Text style={styles.buttonText}>Travel Here</Text>
          </Pressable>
        </View>
      )}

        {!adventureStarted && (
  <Pressable
    style={styles.beginButton}
    onPress={() => {
      setAdventureStarted(true);
      setShowEncounter(true);
    }}
  >
    <Text style={styles.beginButtonText}>Begin Adventure</Text>
  </Pressable>
)}

      {adventureStarted && showEncounter && currentNode && (
        <View style={styles.encounterPanel}>
          <Text style={styles.encounterType}>{currentNode.type.toUpperCase()}</Text>
          <Text style={styles.encounterTitle}>{currentNode.title}</Text>
          <Text style={styles.encounterText}>{currentNode.description}</Text>

          {currentNode.options.map((option) => (
            <Pressable
              key={option}
              style={styles.choiceButton}
              onPress={() => resolveEncounter(option)}
            >
              <Text style={styles.choiceText}>{option}</Text>
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
  panelText: {
    color: colors.muted,
    marginTop: 4,
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
  left: 16,
  right: 16,
  bottom: 16,
  backgroundColor: colors.warning,
  padding: 14,
  borderRadius: 16,
},
beginButtonText: {
  color: "#111",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: 16,
},
});