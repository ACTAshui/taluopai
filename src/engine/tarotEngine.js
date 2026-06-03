import { TAROT_CARDS } from "../data/cards.js";
import { getSpread } from "../data/spreads.js";
import { getTopic } from "../data/topics.js";
import { randomOrientation, shuffleDeck } from "./random.js";

export function createReading({ topicId, spreadId, question = "", rng = globalThis.crypto } = {}) {
  const topic = getTopic(topicId);
  const spread = getSpread(spreadId);
  const shuffled = shuffleDeck(TAROT_CARDS, rng);
  const drawn = spread.positions.map((position, index) => ({
    position,
    card: shuffled[index],
    orientation: randomOrientation(rng)
  }));

  return {
    id: `reading_${Date.now()}`,
    createdAt: new Date().toISOString(),
    topic,
    spread,
    question: question.trim(),
    drawn,
    randomSource: "crypto.getRandomValues",
    algorithm: "Fisher-Yates"
  };
}

export function toPublicRecord(reading) {
  if (!reading) {
    return null;
  }

  return {
    spread: reading.spread.id,
    topic: reading.topic.id,
    createdAt: reading.createdAt,
    drawn: reading.drawn.map((item) => ({
      position: item.position.id,
      cardId: item.card.id,
      orientation: item.orientation
    })),
    randomSource: reading.randomSource,
    algorithm: reading.algorithm
  };
}
