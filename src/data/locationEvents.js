function finalChoices(enemy, removeChoice) {
  return [
    { text: `Attack the ${enemy}`, action: "combat" },
    { text: "Avoid combat and travel onward", action: "travel" },
    {
      text: "Back out and try another approach",
      action: "returnToStart",
      removeChoice,
    },
  ];
}

function createLocationEvent({ id, title, intro, choices }) {
  const steps = {
    start: {
      text: intro,
      choices: choices.map((choice) => ({
        id: choice.id,
        text: choice.text,
        stat: choice.stat,
        dc: choice.dc,
        successNext: `${choice.id}Success`,
        failNext: `${choice.id}Fail`,
      })),
    },
  };

  choices.forEach((choice) => {
    steps[`${choice.id}Success`] = {
      text: choice.success,
      choices: finalChoices(choice.enemy, choice.id),
    };

    steps[`${choice.id}Fail`] = {
      text: choice.fail,
      choices: finalChoices(choice.enemy, choice.id),
    };
  });

  return {
    id,
    title,
    description: intro,
    steps,
  };
}

export const locationEvents = {
  start: createLocationEvent({
    id: "start",
    title: "The Road Begins",
    intro:
      "Your party gathers beside a dying campfire. Three paths stretch ahead, each marked with old warnings scratched into wood.",
    choices: [
      {
        id: "camp",
        text: "Search the abandoned camp",
        stat: "Investigation",
        dc: 10,
        enemy: "road raiders",
        success:
          "You find fresh bootprints, a hidden pouch of supplies, and a note warning that raiders are watching the road.",
        fail:
          "You kick over a noisy tin lantern. Somewhere beyond the trees, a horn answers.",
      },
      {
        id: "marker",
        text: "Study the roadside marker",
        stat: "Intelligence",
        dc: 12,
        enemy: "marked raiders",
        success:
          "You decode the marker. It is not a road sign, but a bandit warning symbol showing where ambushes are planned.",
        fail:
          "You misread the marker and step onto a marked trail. Painted arrows begin appearing on nearby trees.",
      },
      {
        id: "scout",
        text: "Scout the first road",
        stat: "Stealth",
        dc: 13,
        enemy: "hidden scouts",
        success:
          "You move quietly and spot hidden scouts before they notice you. Their camp is close.",
        fail:
          "A branch snaps beneath your boot. Hidden scouts scatter into the brush to alert their allies.",
      },
    ],
  }),

  island: createLocationEvent({
    id: "island",
    title: "The Second Island",
    intro:
      "Mist covers the island. Broken boats rot on the shore, and a ruined watchtower blinks with lantern light though nobody should be there.",
    choices: [
      {
        id: "tower",
        text: "Climb the ruined watchtower",
        stat: "Dexterity",
        dc: 13,
        enemy: "reef cultists",
        success:
          "From the tower, you see cultists dragging crates into a sea cave marked with glowing shells.",
        fail:
          "The stairs collapse beneath you. Your fall echoes across the island, and hooded figures turn toward the tower.",
      },
      {
        id: "boats",
        text: "Search the broken boats",
        stat: "Investigation",
        dc: 12,
        enemy: "drowned sailors",
        success:
          "You find a captain's journal describing a hidden tunnel under the island chapel.",
        fail:
          "A waterlogged corpse grabs your wrist. More drowned sailors rise from the surf.",
      },
      {
        id: "fire",
        text: "Inspect the abandoned campfire",
        stat: "Wisdom",
        dc: 14,
        enemy: "island stalkers",
        success:
          "The ashes are still warm. You realize the camp was bait and spot movement in the grass.",
        fail:
          "You kneel too close to the firepit. A net snaps up from the sand around your party.",
      },
    ],
  }),

  coast_road: createLocationEvent({
    id: "coast_road",
    title: "Coast Road",
    intro:
      "The Coast Road curves above violent waves. Below, an old dock holds a black-sailed pirate ship, while a crooked pub glows near the cliff.",
    choices: [
      {
        id: "ship",
        text: "Sneak onto the pirate ship",
        stat: "Stealth",
        dc: 12,
        enemy: "undead pirates",
        success:
          "You board silently and find cursed coins nailed into the deck. The crew below sings a song no living sailor knows.",
        fail:
          "A rotten plank cracks under your weight. The ship bell rings by itself, and dead pirates climb from below deck.",
      },
      {
        id: "pub",
        text: "Ask the pub for information",
        stat: "Intelligence",
        dc: 15,
        enemy: "pirate informants",
        success:
          "A nervous sailor tells you the pirates cannot die while their captain's coin remains hidden under the dock.",
        fail:
          "You ask the wrong person. The pub goes silent, and several patrons slowly reach for curved knives.",
      },
      {
        id: "road",
        text: "Search farther up the cliff road",
        stat: "Dexterity",
        dc: 13,
        enemy: "cliff raiders",
        success:
          "You climb above the road and spot pirates unloading stolen cargo into a cave beneath the cliff.",
        fail:
          "Loose stones give way under your feet. You slide loudly onto the road near armed pirates hauling crates.",
      },
    ],
  }),

  central_crossing: createLocationEvent({
    id: "central_crossing",
    title: "Central Crossing",
    intro:
      "Wagons, merchants, and travelers crowd the stone crossing. Everyone seems friendly until you notice nobody walks alone.",
    choices: [
      {
        id: "merchant",
        text: "Question the nervous merchant",
        stat: "Insight",
        dc: 13,
        enemy: "road bandits",
        success:
          "You catch the merchant lying. He admits bandits are using the crossing to mark wealthy travelers.",
        fail:
          "The merchant smiles too wide and slips away. A whistle sounds from behind the wagons.",
      },
      {
        id: "board",
        text: "Read the message board",
        stat: "Intelligence",
        dc: 12,
        enemy: "bounty hunters",
        success:
          "You find fake bounty notices used to lure adventurers into traps outside town.",
        fail:
          "You take down the wrong notice. Several bounty hunters nearby decide you are worth collecting.",
      },
      {
        id: "crowd",
        text: "Move through the crowd quietly",
        stat: "Stealth",
        dc: 14,
        enemy: "cutthroats",
        success:
          "You overhear cutthroats planning an ambush near the east road.",
        fail:
          "Someone lifts your pouch and bumps into you. The crowd parts, revealing armed cutthroats.",
      },
    ],
  }),

  south_coast: createLocationEvent({
    id: "south_coast",
    title: "South Coast",
    intro:
      "The South Coast is all jagged rocks and shipwreck bones. Something huge has dragged deep grooves through the wet sand.",
    choices: [
      {
        id: "wreck",
        text: "Search the smashed shipwreck",
        stat: "Investigation",
        dc: 13,
        enemy: "sea raiders",
        success:
          "Inside the wreck, you find fresh footprints and stolen weapons wrapped in sailcloth.",
        fail:
          "The wreck shifts and collapses. Sea raiders hear the crash and rush from behind the rocks.",
      },
      {
        id: "cliffs",
        text: "Climb the cliff path",
        stat: "Strength",
        dc: 14,
        enemy: "cliff harpies",
        success:
          "You reach the top and spot harpy nests built from shields, bones, and torn banners.",
        fail:
          "Your grip slips. The scrape of armor on stone draws shrieking harpies from the cliffside.",
      },
      {
        id: "tide",
        text: "Study the strange tide pools",
        stat: "Wisdom",
        dc: 15,
        enemy: "tide creatures",
        success:
          "The tide pools show reflections of enemies hiding nearby instead of your own faces.",
        fail:
          "You stare too long into the water. Pale hands burst from the pools and claw at your boots.",
      },
    ],
  }),

  south_bridge: createLocationEvent({
    id: "south_bridge",
    title: "Old Bridge",
    intro:
      "The Old Bridge groans above a black river. Old toll signs hang from chains, but the booth appears freshly used.",
    choices: [
      {
        id: "booth",
        text: "Inspect the toll booth",
        stat: "Investigation",
        dc: 12,
        enemy: "bridge wights",
        success:
          "You find records of travelers who paid the toll, crossed the bridge, and were never seen again.",
        fail:
          "The booth door slams behind you. A dead toll keeper reaches through the window.",
      },
      {
        id: "under",
        text: "Climb below the bridge",
        stat: "Dexterity",
        dc: 14,
        enemy: "river ghouls",
        success:
          "Under the bridge, you find bodies tied to the supports as warnings.",
        fail:
          "Your boot slips on wet stone. River ghouls below hear the splash and begin climbing.",
      },
      {
        id: "cross",
        text: "Cross the bridge slowly",
        stat: "Wisdom",
        dc: 13,
        enemy: "spectral guards",
        success:
          "You notice invisible pressure plates between the stones and guide the party safely around them.",
        fail:
          "Halfway across, old armor rises from the bridge stones and blocks your way.",
      },
    ],
  }),

  lower_crossing: createLocationEvent({
    id: "lower_crossing",
    title: "Lower Crossing",
    intro:
      "Mud, reeds, and fog swallow the Lower Crossing. The road continues, but wagon tracks suddenly vanish into the marsh.",
    choices: [
      {
        id: "tracks",
        text: "Follow the wagon tracks",
        stat: "Survival",
        dc: 13,
        enemy: "marsh stalkers",
        success:
          "You find where the wagon was dragged sideways into the reeds. Something intelligent covered the tracks.",
        fail:
          "The tracks loop in circles. By the time you notice, shapes are moving through the fog around you.",
      },
      {
        id: "reeds",
        text: "Search the reeds",
        stat: "Stealth",
        dc: 14,
        enemy: "reed hunters",
        success:
          "You move quietly enough to spot hunters wearing reed cloaks before they spring their trap.",
        fail:
          "A reed snaps loudly. Hidden hunters rise from the marsh with hooked spears.",
      },
      {
        id: "water",
        text: "Test the black water",
        stat: "Intelligence",
        dc: 15,
        enemy: "bog spirits",
        success:
          "You realize the water reacts to sound and can be crossed safely if the party moves carefully.",
        fail:
          "You disturb the water. Faces appear beneath the surface, mouthing your names.",
      },
    ],
  }),

  southern_pass: createLocationEvent({
    id: "southern_pass",
    title: "Southern Pass",
    intro:
      "Southern Pass cuts between cracked hills. Loose stones tumble on their own, and the wind carries voices that sound like your party.",
    choices: [
      {
        id: "cave",
        text: "Explore the mountain cave",
        stat: "Strength",
        dc: 14,
        enemy: "hill marauders",
        success:
          "You push through fallen stone and discover a marauder stash hidden behind old mining beams.",
        fail:
          "The cave mouth collapses behind you with a thunderous crack. Marauders hear it and rush toward the dust.",
      },
      {
        id: "camp",
        text: "Search the broken scout camp",
        stat: "Investigation",
        dc: 13,
        enemy: "pass raiders",
        success:
          "You find scout notes showing where raiders watch the pass from above.",
        fail:
          "You disturb a tripwire hidden under torn canvas. A flare screams into the sky.",
      },
      {
        id: "ridge",
        text: "Climb the high ridge",
        stat: "Dexterity",
        dc: 15,
        enemy: "ridge hunters",
        success:
          "From the ridge, you spot hunters lying in wait behind stone blinds.",
        fail:
          "Your climb sends rocks clattering down the slope. Hidden hunters aim bows toward the sound.",
      },
    ],
  }),

  deep_south: createLocationEvent({
    id: "deep_south",
    title: "Deep South",
    intro:
      "The Deep South is wrong. The trees lean inward, the birds stay silent, and shadows stretch toward your feet.",
    choices: [
      {
        id: "grove",
        text: "Enter the cursed grove",
        stat: "Wisdom",
        dc: 15,
        enemy: "shadow beasts",
        success:
          "You resist the whispers and see the shadows for what they are: beasts hiding between the trees.",
        fail:
          "The whispers copy voices you trust. Your party steps too deep before noticing the trees have moved.",
      },
      {
        id: "chapel",
        text: "Inspect the abandoned chapel",
        stat: "Intelligence",
        dc: 14,
        enemy: "chapel shades",
        success:
          "You read the cracked altar markings and learn the chapel was built to seal something below.",
        fail:
          "You speak one word aloud by mistake. The candles light themselves, and shades peel from the walls.",
      },
      {
        id: "hollow",
        text: "Search the hollow trees",
        stat: "Stealth",
        dc: 13,
        enemy: "bark crawlers",
        success:
          "You move softly and find claw marks leading to a nest inside a dead tree.",
        fail:
          "One hollow tree breathes. Bark splits open and crawling things spill out.",
      },
    ],
  }),

  final_road: createLocationEvent({
    id: "final_road",
    title: "Final Road",
    intro:
      "The Final Road glows red beneath a bruised sky. Broken banners line the path, and every step feels like a challenge.",
    choices: [
      {
        id: "armor",
        text: "Search the battlefield armor",
        stat: "Investigation",
        dc: 16,
        enemy: "the final guard",
        success:
          "You find the armor belongs to warriors who fought the final guard and failed. Their notes reveal a weakness.",
        fail:
          "You lift a cracked helm, and the entire battlefield shifts. Empty armor rises around you.",
      },
      {
        id: "monument",
        text: "Read the cracked war monument",
        stat: "Intelligence",
        dc: 16,
        enemy: "ancient sentries",
        success:
          "The monument names the final guard and explains the oath binding it to the road.",
        fail:
          "The monument rejects your touch. Ancient sentries awaken from beneath the stone.",
      },
      {
        id: "march",
        text: "Walk straight down the road",
        stat: "Strength",
        dc: 17,
        enemy: "roadbound knights",
        success:
          "You march without fear. The road tests your will but does not break you.",
        fail:
          "The road burns under your boots. Roadbound knights appear through the red haze.",
      },
    ],
  }),

  east_gate: createLocationEvent({
    id: "east_gate",
    title: "East Gate",
    intro:
      "East Gate blocks the trail with iron bars and silent guards. Their armor is clean, but the ground beneath them is stained.",
    choices: [
      {
        id: "gatehouse",
        text: "Sneak into the gatehouse",
        stat: "Stealth",
        dc: 14,
        enemy: "gate sentries",
        success:
          "You slip inside and find orders proving the guards have been letting monsters through for payment.",
        fail:
          "A guard dog made of iron and bone catches your scent. The gatehouse alarm starts ringing.",
      },
      {
        id: "checkpoint",
        text: "Talk your way through the checkpoint",
        stat: "Charisma",
        dc: 15,
        enemy: "corrupt guards",
        success:
          "You convince the guards you belong here. One accidentally reveals the password to the eastern road.",
        fail:
          "Your story falls apart. The captain smiles and orders the gate locked behind you.",
      },
      {
        id: "walls",
        text: "Inspect the gate walls",
        stat: "Investigation",
        dc: 13,
        enemy: "wall archers",
        success:
          "You find a weak drainage tunnel running under the wall.",
        fail:
          "You step into view of hidden archers. Arrows strike the dirt around your boots.",
      },
    ],
  }),

  east_falter: createLocationEvent({
    id: "east_falter",
    title: "East Falter",
    intro:
      "East Falter earns its name. The road makes your legs heavy and fills your thoughts with reasons to turn back.",
    choices: [
      {
        id: "shrine",
        text: "Examine the ruined shrine",
        stat: "Wisdom",
        dc: 15,
        enemy: "cursebound soldiers",
        success:
          "You recognize the shrine as the source of the fear curse and find where its power is anchored.",
        fail:
          "The shrine floods your mind with panic. Armored figures step from the fog as your party hesitates.",
      },
      {
        id: "camp",
        text: "Help the fear-struck camp",
        stat: "Medicine",
        dc: 13,
        enemy: "panic wraiths",
        success:
          "You calm the survivors and learn that invisible wraiths feed on fear along the road.",
        fail:
          "Your help comes too late. The survivors begin screaming, and their fear draws wraiths closer.",
      },
      {
        id: "march",
        text: "Force the party forward",
        stat: "Strength",
        dc: 14,
        enemy: "faltering spirits",
        success:
          "You push through the oppressive dread and break the road's hold on your party.",
        fail:
          "The harder you push, the heavier the road becomes. Spirits gather around your weakening steps.",
      },
    ],
  }),

  north_fork: createLocationEvent({
    id: "north_fork",
    title: "North Fork",
    intro:
      "North Fork splits beneath cold cliffs. Hunter warnings are carved into broken shields nailed to trees.",
    choices: [
      {
        id: "blind",
        text: "Search the hunter blind",
        stat: "Investigation",
        dc: 13,
        enemy: "mountain wolves",
        success:
          "You find wolf tracks circling the blind and old bait left to trap travelers.",
        fail:
          "The blind creaks loudly when you climb in. Wolves answer from the rocks above.",
      },
      {
        id: "marker",
        text: "Study the frozen trail marker",
        stat: "Intelligence",
        dc: 14,
        enemy: "ice scouts",
        success:
          "You decode the hunter marks and learn which fork leads into an ambush.",
        fail:
          "You mistake an ambush mark for a safe trail sign. Ice scouts move to cut you off.",
      },
      {
        id: "highroad",
        text: "Take the high road carefully",
        stat: "Dexterity",
        dc: 15,
        enemy: "cliff prowlers",
        success:
          "You keep your balance and spot prowlers waiting above the lower path.",
        fail:
          "Your boot slips on ice. The sound sends cliff prowlers racing along the ledge.",
      },
    ],
  }),

  north_peak: createLocationEvent({
    id: "north_peak",
    title: "North Peak",
    intro:
      "North Peak rises above the clouds. A buried supply cache waits near a frozen lookout, but fresh tracks circle the snow.",
    choices: [
      {
        id: "cache",
        text: "Dig out the supply cache",
        stat: "Strength",
        dc: 13,
        enemy: "ice scavengers",
        success:
          "You uncover old supplies and a sealed box before the scavengers notice.",
        fail:
          "Your digging echoes across the peak. Ice scavengers crawl from behind the rocks.",
      },
      {
        id: "lookout",
        text: "Climb the frozen lookout",
        stat: "Dexterity",
        dc: 15,
        enemy: "peak harriers",
        success:
          "From the lookout, you spot winged harriers nesting along the upper ridge.",
        fail:
          "The lookout ladder snaps. The crash wakes the harriers overhead.",
      },
      {
        id: "tracks",
        text: "Follow the fresh tracks",
        stat: "Survival",
        dc: 14,
        enemy: "snow hunters",
        success:
          "The tracks reveal hunters stalking your party from the storm line.",
        fail:
          "The tracks vanish under fresh snow. When you turn back, hunters block the path.",
      },
    ],
  }),

  east_split: createLocationEvent({
    id: "east_split",
    title: "East Split",
    intro:
      "East Split branches in three directions. Bones, charms, and old arrows mark each road like warnings nobody survived to explain.",
    choices: [
      {
        id: "bones",
        text: "Inspect the bone-marked trail",
        stat: "Investigation",
        dc: 13,
        enemy: "split-road ambushers",
        success:
          "You realize the bones are arranged as signals showing where ambushers hide.",
        fail:
          "You disturb the bone piles. A rattling signal carries down the trail.",
      },
      {
        id: "charms",
        text: "Study the charm-covered tree",
        stat: "Wisdom",
        dc: 14,
        enemy: "charm witches",
        success:
          "You identify which charms are protective and which are bait.",
        fail:
          "One charm cracks in your hand. Witches nearby feel the magic break.",
      },
      {
        id: "arrows",
        text: "Follow the old arrow trail",
        stat: "Dexterity",
        dc: 15,
        enemy: "arrow ghosts",
        success:
          "You dodge old traps and find the ghosts bound to the arrow-marked road.",
        fail:
          "A hidden bow trap fires from the brush. Ghostly archers appear where the arrows land.",
      },
    ],
  }),

  east_lake: createLocationEvent({
    id: "east_lake",
    title: "Lake Road",
    intro:
      "Lake Road follows still water that reflects things standing behind you even when the road is empty.",
    choices: [
      {
        id: "dock",
        text: "Search the sunken dock",
        stat: "Dexterity",
        dc: 14,
        enemy: "lake spirits",
        success:
          "You balance across the broken dock and find offerings meant to keep the lake spirits asleep.",
        fail:
          "The dock sinks beneath your weight. Pale shapes stir under the water.",
      },
      {
        id: "camp",
        text: "Inspect the lakeside camp",
        stat: "Investigation",
        dc: 13,
        enemy: "mirror thieves",
        success:
          "You find packs belonging to travelers whose reflections vanished before they did.",
        fail:
          "You look into a polished pan and your reflection smiles late. Mirror thieves step from the camp shadows.",
      },
      {
        id: "water",
        text: "Watch the water carefully",
        stat: "Wisdom",
        dc: 15,
        enemy: "drowned guardians",
        success:
          "You notice the ripples move against the wind and reveal guardians beneath the surface.",
        fail:
          "The lake goes perfectly still. Then armored hands break through the water.",
      },
    ],
  }),

  ruin_path: createLocationEvent({
    id: "ruin_path",
    title: "Ruin Path",
    intro:
      "Ruin Path is lined with cracked stones carved in a language that hurts to look at. The road hums under your feet.",
    choices: [
      {
        id: "archway",
        text: "Pass through the cracked archway",
        stat: "Wisdom",
        dc: 15,
        enemy: "ruin guardians",
        success:
          "You resist the archway's pull and see the guardian statues hidden behind illusion magic.",
        fail:
          "The archway flashes white. Stone guardians turn their heads toward you.",
      },
      {
        id: "scholar",
        text: "Search the old scholar camp",
        stat: "Investigation",
        dc: 13,
        enemy: "mad relic hunters",
        success:
          "You find translated notes warning that relic hunters went mad after opening a sealed chamber.",
        fail:
          "You spill ink across a half-finished ritual circle. Mad relic hunters hear the magic flare.",
      },
      {
        id: "markings",
        text: "Read the ancient markings",
        stat: "Intelligence",
        dc: 16,
        enemy: "ancient wardens",
        success:
          "You understand enough to locate the wardens' patrol route before they activate.",
        fail:
          "You read the wrong line aloud. Ancient wardens rise from beneath the stones.",
      },
    ],
  }),

  eastern_ruins: createLocationEvent({
    id: "eastern_ruins",
    title: "Eastern Ruins",
    intro:
      "The Eastern Ruins are collapsed towers, buried halls, and treasure glinting under dust. The stones feel like they are watching.",
    choices: [
      {
        id: "tower",
        text: "Enter the collapsed tower",
        stat: "Dexterity",
        dc: 14,
        enemy: "stone guardians",
        success:
          "You squeeze through broken stone and find a hidden chamber full of old coins.",
        fail:
          "The tower shifts. Stone arms break from the walls and block the exit.",
      },
      {
        id: "chamber",
        text: "Open the buried treasure chamber",
        stat: "Strength",
        dc: 15,
        enemy: "treasure sentinels",
        success:
          "You force the chamber open and spot the sentinel runes before they fully awaken.",
        fail:
          "The chamber door crashes open too loudly. Sentinel statues ignite with blue fire.",
      },
      {
        id: "runes",
        text: "Study the floor runes",
        stat: "Intelligence",
        dc: 16,
        enemy: "rune spirits",
        success:
          "You identify the safe stones and find the path through the ruin traps.",
        fail:
          "Your foot crosses the wrong rune. Spirits rise from the floor in a ring around you.",
      },
    ],
  }),

  far_east: createLocationEvent({
    id: "far_east",
    title: "Far East",
    intro:
      "The Far East road is empty except for a strange merchant cart lit by green lanterns. The merchant already knows your names.",
    choices: [
      {
        id: "cart",
        text: "Inspect the merchant cart",
        stat: "Investigation",
        dc: 14,
        enemy: "debt collectors",
        success:
          "You notice most items are cursed contracts disguised as weapons, charms, and maps.",
        fail:
          "You touch a silver compass. The merchant smiles and says your debt has been recorded.",
      },
      {
        id: "bargain",
        text: "Bargain with the merchant",
        stat: "Charisma",
        dc: 15,
        enemy: "contract demons",
        success:
          "You twist the merchant's wording and learn which deal can be broken safely.",
        fail:
          "The merchant catches your hesitation and offers a deal your shadow accepts before you do.",
      },
      {
        id: "lanterns",
        text: "Study the green lanterns",
        stat: "Intelligence",
        dc: 16,
        enemy: "lantern spirits",
        success:
          "You realize each lantern holds a trapped spirit forced to guide the merchant.",
        fail:
          "One lantern opens its eye. The spirits inside begin whispering your secrets.",
      },
    ],
  }),

  east_outpost: createLocationEvent({
    id: "east_outpost",
    title: "Outpost",
    intro:
      "The Outpost looks abandoned, but smoke curls from the chimney and fresh footprints lead into the locked barracks.",
    choices: [
      {
        id: "barracks",
        text: "Break into the locked barracks",
        stat: "Strength",
        dc: 14,
        enemy: "outpost deserters",
        success:
          "You force the door quietly enough to catch deserters counting stolen supplies inside.",
        fail:
          "The door bursts open with a crack. Deserters flip the table and draw blades.",
      },
      {
        id: "tower",
        text: "Climb the watchtower",
        stat: "Dexterity",
        dc: 13,
        enemy: "watchtower snipers",
        success:
          "From the tower, you spot hidden snipers watching the road below.",
        fail:
          "A rotten ladder rung snaps. The fall alerts snipers nested in the upper platform.",
      },
      {
        id: "chimney",
        text: "Investigate the chimney smoke",
        stat: "Stealth",
        dc: 15,
        enemy: "campfire killers",
        success:
          "You sneak close and hear killers planning to pose as friendly soldiers.",
        fail:
          "Smoke shifts and reveals your silhouette. The killers around the fire go silent.",
      },
    ],
  }),
};