import { writeFileSync, mkdirSync } from "node:fs";

const commonStyle = [
  "vertical 2:3 tarot card face illustration",
  "no text, no letters, no numbers, no title banner, no caption, no logo, no watermark",
  "original image inspired by traditional Rider-Waite-Smith tarot symbolism but not a copy or replica",
  "ornate mystical art nouveau border with no typography",
  "burnished gold foil details, subtle jewel-toned accents",
  "cinematic occult-deck atmosphere, celestial geometry, symbolic composition, premium handmade deck",
  "clear central scene, elegant handmade engraving texture, high detail"
].join(", ");

const negative = [
  "text",
  "letters",
  "numbers",
  "words",
  "watermark",
  "logo",
  "signature",
  "modern UI",
  "photorealistic photograph",
  "low detail",
  "blurry",
  "cropped border",
  "duplicate card title"
].join(", ");

const cards = [
  ["major_00_fool", "The Fool", "a young wanderer stepping toward a luminous cliff beneath stars, white rose in hand, small white dog, mountains and dawn in the distance"],
  ["major_01_magician", "The Magician", "a focused mage at a ritual table with wand, cup, sword and pentacle symbols, one hand raised to the sky and one toward the earth"],
  ["major_02_high_priestess", "The High Priestess", "a serene veiled priestess between two dark pillars, moon crown, scroll, pomegranate veil, sacred water at her feet"],
  ["major_03_empress", "The Empress", "a radiant earth mother seated in a lush garden, wheat, roses, flowing river, crown of stars, warm fertility symbolism"],
  ["major_04_emperor", "The Emperor", "a stern ruler on a stone throne with ram motifs, mountains behind, red cloak, orb and scepter, disciplined authority"],
  ["major_05_hierophant", "The Hierophant", "a spiritual teacher in a ceremonial temple, two acolytes, crossed keys, sacred gesture, golden altar glow"],
  ["major_06_lovers", "The Lovers", "two figures in a sacred garden beneath a winged celestial guardian, mountain and tree symbolism, choice and union"],
  ["major_07_chariot", "The Chariot", "a victorious traveler in a starry chariot drawn by two contrasting sphinx-like guardians, city behind, armor and canopy"],
  ["major_08_strength", "Strength", "a calm figure gently closing the mouth of a lion, infinity-like halo, roses, courage through tenderness"],
  ["major_09_hermit", "The Hermit", "an elder seeker on a snowy mountain holding a lantern with a star inside, staff, solitude and inner wisdom"],
  ["major_10_wheel_of_fortune", "Wheel of Fortune", "a great celestial wheel with symbolic creatures around it, sphinx-like guardian, serpent and alchemical motifs"],
  ["major_11_justice", "Justice", "a seated judge with scales and sword, balanced curtains, clear gaze, marble floor and golden symmetry"],
  ["major_12_hanged_man", "The Hanged Man", "a tranquil figure suspended upside down from a living tree, glowing halo, one leg crossed, peaceful surrender"],
  ["major_13_death", "Death", "an armored skeletal rider carrying a dark banner, white horse, sunrise beyond a river, figures witnessing transformation"],
  ["major_14_temperance", "Temperance", "an angelic figure pouring water between two cups, one foot on land and one in water, path to distant sunlight"],
  ["major_15_devil", "The Devil", "a horned shadow figure above two loosely chained people, torchlight, bat wings, temptation and bondage symbols"],
  ["major_16_tower", "The Tower", "a tall tower struck by lightning under a storm sky, crown falling, figures tumbling, flames and revelation"],
  ["major_17_star", "The Star", "a nude or robed figure pouring water beneath a large star and seven smaller stars, calm pool and healing landscape"],
  ["major_18_moon", "The Moon", "two towers, a moonlit path, dog and wolf, crayfish emerging from water, dreamlike mist and uncertainty"],
  ["major_19_sun", "The Sun", "a joyful child on a white horse, sunflowers, radiant sun, red banner, clarity and vitality"],
  ["major_20_judgement", "Judgement", "an angel sounding a trumpet above rising figures, flags, mountains, awakening and renewal"],
  ["major_21_world", "The World", "a graceful dancer within a wreath, four symbolic guardians in the corners, completion and cosmic harmony"],
  ["wands_01_ace", "Ace of Wands", "a radiant hand emerging from cloud holding a sprouting wooden wand above a distant castle and fertile hills"],
  ["wands_02_two", "Two of Wands", "a figure on a balcony holding a globe, two tall wands, looking over sea and distant land"],
  ["wands_03_three", "Three of Wands", "a traveler watching ships from a cliff with three wands planted nearby, golden horizon"],
  ["wands_04_four", "Four of Wands", "four wands holding a flower garland, distant celebration, joyful homecoming in a garden courtyard"],
  ["wands_05_five", "Five of Wands", "five youthful figures crossing wooden staffs in energetic practice conflict, dynamic but not violent"],
  ["wands_06_six", "Six of Wands", "a rider in procession carrying a laurel-topped wand, crowd silhouettes, victory and recognition"],
  ["wands_07_seven", "Seven of Wands", "a determined figure standing on high ground defending against six rising wands below"],
  ["wands_08_eight", "Eight of Wands", "eight glowing wands flying swiftly across an open sky above a river landscape"],
  ["wands_09_nine", "Nine of Wands", "a bandaged sentinel holding one wand before eight wands, tired but watchful"],
  ["wands_10_ten", "Ten of Wands", "a burdened figure carrying ten heavy wands toward a small town, effort and responsibility"],
  ["wands_11_page", "Page of Wands", "a young messenger studying a flowering wand in a desert landscape, curiosity and spark"],
  ["wands_12_knight", "Knight of Wands", "an armored knight riding a rearing horse through a desert, flaming plume, bold momentum"],
  ["wands_13_queen", "Queen of Wands", "a confident queen on a throne with sunflowers and a black cat, holding a blooming wand"],
  ["wands_14_king", "King of Wands", "a commanding king on a throne with salamander and lion motifs, holding a living wand"],
  ["cups_01_ace", "Ace of Cups", "a chalice overflowing with water from a cloud, dove-like spirit above, lotus pond below"],
  ["cups_02_two", "Two of Cups", "two figures exchanging cups under a winged lion and caduceus-like symbol, mutual union"],
  ["cups_03_three", "Three of Cups", "three friends raising cups in a circle, fruit harvest and joyful community"],
  ["cups_04_four", "Four of Cups", "a contemplative figure beneath a tree, three cups before them, a fourth cup offered from a cloud"],
  ["cups_05_five", "Five of Cups", "a cloaked figure looking at spilled cups, two upright cups behind, bridge and river in distance"],
  ["cups_06_six", "Six of Cups", "two children in an old garden exchanging a flower-filled cup, memory and kindness"],
  ["cups_07_seven", "Seven of Cups", "seven cups floating in clouds, each containing a different dreamlike symbol, illusion and choices"],
  ["cups_08_eight", "Eight of Cups", "a traveler leaving eight cups behind under moonlight, mountains ahead, departure for meaning"],
  ["cups_09_nine", "Nine of Cups", "a satisfied figure seated before nine arranged cups, warm lanterns, emotional fulfillment"],
  ["cups_10_ten", "Ten of Cups", "a family or chosen family beneath an arc of ten cups like a rainbow, peaceful home landscape"],
  ["cups_11_page", "Page of Cups", "a young dreamer holding a cup with a small fish appearing from it, seaside intuition"],
  ["cups_12_knight", "Knight of Cups", "a graceful knight carrying a cup while riding slowly beside a river, romantic quest"],
  ["cups_13_queen", "Queen of Cups", "a compassionate queen by the sea holding an ornate closed cup, throne with water motifs"],
  ["cups_14_king", "King of Cups", "a calm king on a throne floating on turbulent water, cup and scepter, emotional mastery"],
  ["swords_01_ace", "Ace of Swords", "a hand from cloud holding an upright sword with crown and laurel, mountains below, clear truth"],
  ["swords_02_two", "Two of Swords", "a blindfolded figure seated by water crossing two swords, moonlit difficult choice"],
  ["swords_03_three", "Three of Swords", "a heart pierced by three swords in rain clouds, sorrow and clarity"],
  ["swords_04_four", "Four of Swords", "a resting figure in a chapel-like chamber, four swords, stained glass glow, recovery"],
  ["swords_05_five", "Five of Swords", "a figure holding swords after conflict, others walking away, windy shore, hollow victory"],
  ["swords_06_six", "Six of Swords", "a small boat carrying travelers across water, six swords standing in the boat, transition"],
  ["swords_07_seven", "Seven of Swords", "a stealthy figure carrying five swords away from a camp while two remain behind"],
  ["swords_08_eight", "Eight of Swords", "a bound blindfolded figure surrounded by eight swords, shallow water, mental restriction"],
  ["swords_09_nine", "Nine of Swords", "a person sitting up in bed at night with nine swords on the wall, anxiety and wakefulness"],
  ["swords_10_ten", "Ten of Swords", "a fallen figure under a dark sky pierced by ten swords, dawn rising beyond, painful ending"],
  ["swords_11_page", "Page of Swords", "a young figure holding a sword in windy hills, alert eyes and restless clouds"],
  ["swords_12_knight", "Knight of Swords", "an armored knight charging on a horse through storm winds, sword forward, urgency"],
  ["swords_13_queen", "Queen of Swords", "a clear-eyed queen on a throne holding an upright sword, clouds and butterflies"],
  ["swords_14_king", "King of Swords", "a stern king with upright sword on a carved throne, clear sky, authority of reason"],
  ["pentacles_01_ace", "Ace of Pentacles", "a hand from cloud offering a golden pentacle above a garden path and archway"],
  ["pentacles_02_two", "Two of Pentacles", "a figure juggling two pentacles connected by an infinity loop, ships on wavy sea behind"],
  ["pentacles_03_three", "Three of Pentacles", "an artisan collaborating with two patrons in a cathedral workshop, craft and skill"],
  ["pentacles_04_four", "Four of Pentacles", "a seated figure holding one pentacle close with others under feet and above crown, guarded security"],
  ["pentacles_05_five", "Five of Pentacles", "two travelers outside a lit stained-glass window in snow, hardship and support"],
  ["pentacles_06_six", "Six of Pentacles", "a generous figure weighing scales and giving coins to two people, balanced giving"],
  ["pentacles_07_seven", "Seven of Pentacles", "a gardener leaning on a tool beside a vine of pentacles, patient assessment"],
  ["pentacles_08_eight", "Eight of Pentacles", "a craftsperson carving pentacles at a workbench, repeated practice and mastery"],
  ["pentacles_09_nine", "Nine of Pentacles", "an elegant figure in a vineyard with a falcon and nine pentacles, self-sufficiency"],
  ["pentacles_10_ten", "Ten of Pentacles", "an ancestral courtyard with family, elder, dogs and ten pentacles woven into an arch"],
  ["pentacles_11_page", "Page of Pentacles", "a young student holding a pentacle carefully in a green field, learning and opportunity"],
  ["pentacles_12_knight", "Knight of Pentacles", "a steady knight on a still horse holding a pentacle over cultivated fields"],
  ["pentacles_13_queen", "Queen of Pentacles", "a nurturing queen in a garden holding a pentacle, rabbit and roses near her throne"],
  ["pentacles_14_king", "King of Pentacles", "a wealthy grounded king on a throne with vines, bulls and pentacle, stable abundance"]
];

const brightCards = new Set([
  "major_03_empress",
  "major_06_lovers",
  "major_14_temperance",
  "major_17_star",
  "major_19_sun",
  "major_20_judgement",
  "major_21_world",
  "wands_01_ace",
  "wands_03_three",
  "wands_04_four",
  "wands_06_six",
  "wands_08_eight",
  "cups_01_ace",
  "cups_02_two",
  "cups_03_three",
  "cups_06_six",
  "cups_09_nine",
  "cups_10_ten",
  "pentacles_01_ace",
  "pentacles_03_three",
  "pentacles_06_six",
  "pentacles_09_nine",
  "pentacles_10_ten"
]);

const darkCards = new Set([
  "major_09_hermit",
  "major_12_hanged_man",
  "major_13_death",
  "major_15_devil",
  "major_16_tower",
  "major_18_moon",
  "cups_05_five",
  "cups_07_seven",
  "cups_08_eight",
  "swords_02_two",
  "swords_03_three",
  "swords_05_five",
  "swords_07_seven",
  "swords_08_eight",
  "swords_09_nine",
  "swords_10_ten",
  "pentacles_04_four",
  "pentacles_05_five"
]);

const effectPhrases = {
  sun: "radiant golden daylight, warm visible highlights, luminous but not washed out",
  star: "clear starlight and silver-blue sparkle, healing glow, crisp fine details",
  moon: "blue moonlight, misty dream atmosphere, mysterious shadows with readable detail",
  lightning: "storm clouds split by bright lightning, dramatic contrast, all figures and architecture still clear",
  shadow: "dark infernal candlelight, ruby-black shadows, high contrast without muddy areas",
  transform: "somber dawn after darkness, black-silver transformation mood, clear silhouettes and details",
  water: "cool reflective water light, gentle ripples and luminous mist, high clarity",
  fire: "ember glow and warm movement, sparks and smoke, rich reds and golds",
  air: "wind-swept movement, clear sky currents, crisp linework and clean silhouettes",
  earth: "green-gold garden light, tactile vines and stone textures, grounded warmth",
  orbit: "cosmic circular motion, jewel-toned stars, balanced radiant geometry",
  ritual: "candlelit ceremonial glow, indigo shadows, gold focal highlights"
};

const cardEffects = {
  major_00_fool: "air",
  major_01_magician: "ritual",
  major_02_high_priestess: "moon",
  major_03_empress: "earth",
  major_04_emperor: "fire",
  major_05_hierophant: "ritual",
  major_06_lovers: "sun",
  major_07_chariot: "air",
  major_08_strength: "sun",
  major_09_hermit: "star",
  major_10_wheel_of_fortune: "orbit",
  major_11_justice: "air",
  major_12_hanged_man: "water",
  major_13_death: "transform",
  major_14_temperance: "water",
  major_15_devil: "shadow",
  major_16_tower: "lightning",
  major_17_star: "star",
  major_18_moon: "moon",
  major_19_sun: "sun",
  major_20_judgement: "air",
  major_21_world: "orbit"
};

function suitEffect(id) {
  if (id.startsWith("wands_")) {
    return "fire";
  }
  if (id.startsWith("cups_")) {
    return "water";
  }
  if (id.startsWith("swords_")) {
    return "air";
  }
  if (id.startsWith("pentacles_")) {
    return "earth";
  }
  return "ritual";
}

function toneFor(id) {
  if (brightCards.has(id)) {
    return "bright";
  }
  if (darkCards.has(id)) {
    return "dark";
  }
  if (id.startsWith("wands_")) {
    return "warm";
  }
  if (id.startsWith("cups_") || id.startsWith("swords_")) {
    return "cool";
  }
  if (id.startsWith("pentacles_")) {
    return "earth";
  }
  return "balanced";
}

function tonePhrase(tone) {
  if (tone === "bright") {
    return "overall brighter and hopeful, strong illumination, every important detail easy to see";
  }
  if (tone === "dark") {
    return "overall darker and more mysterious, low-key lighting, but not blacked out; all key details remain visible";
  }
  if (tone === "warm") {
    return "warm amber and ember palette, energetic highlights, readable midtones";
  }
  if (tone === "cool") {
    return "cool blue-violet palette, clean contrast, readable detail in shadows";
  }
  if (tone === "earth") {
    return "green, bronze and soil-gold palette, textured natural light, crisp edges";
  }
  return "balanced indigo, obsidian and gold palette, neither too dark nor too washed out";
}

export const CARD_FACE_PROMPTS = cards.map(([id, nameEn, scene]) => ({
  id,
  nameEn,
  tone: toneFor(id),
  effect: cardEffects[id] || suitEffect(id),
  prompt: `${commonStyle}. Card concept: ${nameEn}. Scene: ${scene}. Lighting and mood: ${tonePhrase(toneFor(id))}; ${effectPhrases[cardEffects[id] || suitEffect(id)]}. The card face itself must contain image only; absolutely no text or symbols that look like letters or numbers. Negative prompt: ${negative}.`
}));

mkdirSync("assets/cards/faces", { recursive: true });
writeFileSync("assets/cards/faces/prompts.json", JSON.stringify(CARD_FACE_PROMPTS, null, 2), "utf8");
console.log(`Wrote ${CARD_FACE_PROMPTS.length} card prompts.`);
