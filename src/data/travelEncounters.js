export const travelEncounters = [
  {
    id: "broken_wagon",
    type: "skill",
    title: "Broken Wagon",
    description: "An overturned wagon blocks the road. The cargo is untouched, but there are no bodies nearby.",
    choices: [
      { text: "Search the wagon", stat: "Investigation", dc: 12 },
      { text: "Look for survivors", stat: "Wisdom", dc: 14 },
      { text: "Move around it quickly", stat: "Dexterity", dc: 10 },
    ],
  },
  {
    id: "howling_woods",
    type: "skill",
    title: "Howling Woods",
    description: "The road cuts through black trees. Something howls from both sides at once.",
    choices: [
      { text: "Move silently", stat: "Stealth", dc: 13 },
      { text: "Light a torch and press forward", stat: "Strength", dc: 12 },
      { text: "Track the creature", stat: "Survival", dc: 15 },
    ],
  },
  {
    id: "bandit_toll",
    type: "skill",
    title: "Bandit Toll",
    description: "Masked bandits step from the brush and demand payment for using their road.",
    choices: [
      { text: "Talk them down", stat: "Charisma", dc: 14 },
      { text: "Intimidate them", stat: "Strength", dc: 15 },
      { text: "Slip past them", stat: "Stealth", dc: 13 },
    ],
  },
  {
    id: "sick_traveler",
    type: "skill",
    title: "Sick Traveler",
    description: "A feverish traveler begs for help beside a burned campfire.",
    choices: [
      { text: "Treat the sickness", stat: "Medicine", dc: 13 },
      { text: "Question them carefully", stat: "Insight", dc: 12 },
      { text: "Search the camp", stat: "Investigation", dc: 14 },
    ],
  },
  {
    id: "fallen_tree",
    type: "skill",
    title: "Fallen Tree",
    description: "A massive tree has fallen across the trail, and fresh claw marks cover the bark.",
    choices: [
      { text: "Cut a path through", stat: "Strength", dc: 14 },
      { text: "Climb over carefully", stat: "Dexterity", dc: 12 },
      { text: "Search for what knocked it down", stat: "Survival", dc: 15 },
    ],
  },
  {
    id: "strange_shrine",
    type: "skill",
    title: "Strange Shrine",
    description: "A roadside shrine hums with blue light. Coins, bones, and feathers cover the stones.",
    choices: [
      { text: "Study the symbols", stat: "Intelligence", dc: 15 },
      { text: "Leave an offering", stat: "Wisdom", dc: 12 },
      { text: "Take one of the coins", stat: "Dexterity", dc: 16 },
    ],
  },
  {
    id: "lost_child",
    type: "skill",
    title: "Lost Child",
    description: "A child stands alone in the road, pointing silently toward the woods.",
    choices: [
      { text: "Comfort the child", stat: "Charisma", dc: 12 },
      { text: "Check if this is a trap", stat: "Insight", dc: 15 },
      { text: "Follow where they point", stat: "Survival", dc: 14 },
    ],
  },
  {
    id: "wolf_pack",
    type: "combat",
    title: "Wolf Pack",
    description: "Hungry wolves circle your party from the tall grass.",
    choices: [
      { text: "Start combat", action: "combat" },
      { text: "Scare them off", stat: "Strength", dc: 15 },
      { text: "Back away slowly", stat: "Wisdom", dc: 13 },
    ],
  },
  {
    id: "road_goblins",
    type: "combat",
    title: "Road Goblins",
    description: "Goblins leap from behind rocks, waving rusty blades and stolen shields.",
    choices: [
      { text: "Start combat", action: "combat" },
      { text: "Ambush them first", stat: "Stealth", dc: 14 },
      { text: "Offer fake treasure", stat: "Deception", dc: 15 },
    ],
  },
  {
    id: "undead_patrol",
    type: "combat",
    title: "Undead Patrol",
    description: "Three armored corpses march down the road, still following ancient orders.",
    choices: [
      { text: "Start combat", action: "combat" },
      { text: "Hide until they pass", stat: "Stealth", dc: 16 },
      { text: "Study their markings", stat: "Intelligence", dc: 14 },
    ],
  },
];