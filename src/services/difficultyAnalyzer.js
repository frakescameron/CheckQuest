export function analyzeTask(taskText) {
  const text = taskText.toLowerCase();

  const bossWords = ["engine", "transmission", "move", "full project", "replace all", "rebuild"];
  const hardWords = ["repair", "replace", "install", "deep clean", "diagnose", "configure"];
  const normalWords = ["organize", "clean", "study", "practice", "wash", "review"];

  if (bossWords.some((word) => text.includes(word))) {
    return {
      difficulty: "Boss",
      estimatedMinutes: 120,
      xpReward: 100,
    };
  }

  if (hardWords.some((word) => text.includes(word))) {
    return {
      difficulty: "Hard",
      estimatedMinutes: 60,
      xpReward: 50,
    };
  }

  if (normalWords.some((word) => text.includes(word))) {
    return {
      difficulty: "Normal",
      estimatedMinutes: 30,
      xpReward: 25,
    };
  }

  return {
    difficulty: "Easy",
    estimatedMinutes: 10,
    xpReward: 10,
  };
}