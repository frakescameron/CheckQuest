import React, { useState } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
import TaskCard from "../components/TaskCard";
import { starterTasks } from "../data/starterData";
import { colors } from "../theme/colors";

export default function TasksScreen() {
  const [tasks, setTasks] = useState(starterTasks);

  function handleStart(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "Started",
              startedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }

  function handleComplete(taskId) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) return;

    if (task.status !== "Started") {
      Alert.alert("Quest not started", "You need to start the quest before completing it.");
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === taskId
          ? {
              ...item,
              status: "Completed",
              completedAt: new Date().toISOString(),
            }
          : item
      )
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStart={handleStart}
          onComplete={handleComplete}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
});