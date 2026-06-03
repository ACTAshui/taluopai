const BRIGHT_CARDS = new Set([
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

const DARK_CARDS = new Set([
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

const EFFECT_OVERRIDES = {
  major_00_fool: "fx-air",
  major_01_magician: "fx-ritual",
  major_02_high_priestess: "fx-moon",
  major_03_empress: "fx-earth",
  major_04_emperor: "fx-fire",
  major_05_hierophant: "fx-ritual",
  major_06_lovers: "fx-sun",
  major_07_chariot: "fx-air",
  major_08_strength: "fx-sun",
  major_09_hermit: "fx-star",
  major_10_wheel_of_fortune: "fx-orbit",
  major_11_justice: "fx-air",
  major_12_hanged_man: "fx-water",
  major_13_death: "fx-transform",
  major_14_temperance: "fx-water",
  major_15_devil: "fx-shadow",
  major_16_tower: "fx-lightning",
  major_17_star: "fx-star",
  major_18_moon: "fx-moon",
  major_19_sun: "fx-sun",
  major_20_judgement: "fx-air",
  major_21_world: "fx-orbit"
};

const SUIT_EFFECTS = {
  wands: "fx-fire",
  cups: "fx-water",
  swords: "fx-air",
  pentacles: "fx-earth"
};

function toneFor(card) {
  if (BRIGHT_CARDS.has(card.id)) {
    return "tone-bright";
  }
  if (DARK_CARDS.has(card.id)) {
    return "tone-dark";
  }
  if (card.suit === "wands") {
    return "tone-warm";
  }
  if (card.suit === "cups" || card.suit === "swords") {
    return "tone-cool";
  }
  if (card.suit === "pentacles") {
    return "tone-earth";
  }
  return "tone-balanced";
}

export function getCardVisual(card) {
  const effect = EFFECT_OVERRIDES[card.id] || SUIT_EFFECTS[card.suit] || "fx-ritual";
  const tone = toneFor(card);
  return {
    image: `./assets/cards/faces/${card.id}.webp`,
    tone,
    effect,
    classes: `${tone} ${effect}`
  };
}
