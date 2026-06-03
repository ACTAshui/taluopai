import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const animals = [
  ["raven", "渡鸦", "bird"],
  ["cat", "猫", "mammal"],
  ["fox", "狐狸", "mammal"],
  ["wolf", "狼", "mammal"],
  ["deer", "鹿", "hoofed"],
  ["bear", "熊", "mammal"],
  ["panda", "熊猫", "mammal"],
  ["rabbit", "兔子", "mammal"],
  ["squirrel", "松鼠", "mammal"],
  ["hedgehog", "刺猬", "mammal"],
  ["horse", "马", "hoofed"],
  ["lion", "狮子", "mammal"],
  ["tiger", "老虎", "mammal"],
  ["leopard", "花豹", "mammal"],
  ["lynx", "猞猁", "mammal"],
  ["raccoon", "浣熊", "mammal"],
  ["otter", "水獭", "aquatic"],
  ["seal", "海豹", "aquatic"],
  ["dolphin", "海豚", "aquatic"],
  ["whale", "鲸", "aquatic"],
  ["shark", "鲨鱼", "aquatic"],
  ["manta-ray", "蝠鲼", "aquatic"],
  ["seahorse", "海马", "aquatic"],
  ["turtle", "海龟", "reptile"],
  ["octopus", "章鱼", "aquatic"],
  ["jellyfish", "水母", "aquatic"],
  ["koi", "锦鲤", "aquatic"],
  ["crab", "螃蟹", "aquatic"],
  ["lobster", "龙虾", "aquatic"],
  ["starfish", "海星", "aquatic"],
  ["owl", "猫头鹰", "bird"],
  ["eagle", "鹰", "bird"],
  ["swan", "天鹅", "bird"],
  ["peacock", "孔雀", "bird"],
  ["hummingbird", "蜂鸟", "bird"],
  ["flamingo", "火烈鸟", "bird"],
  ["crane", "鹤", "bird"],
  ["kingfisher", "翠鸟", "bird"],
  ["parrot", "鹦鹉", "bird"],
  ["falcon", "隼", "bird"],
  ["penguin", "企鹅", "bird"],
  ["albatross", "信天翁", "bird"],
  ["heron", "鹭", "bird"],
  ["magpie", "喜鹊", "bird"],
  ["toucan", "巨嘴鸟", "bird"],
  ["butterfly", "蝴蝶", "insect"],
  ["dragonfly", "蜻蜓", "insect"],
  ["bee", "蜜蜂", "insect"],
  ["firefly", "萤火虫", "insect"],
  ["beetle", "甲虫", "insect"],
  ["ladybug", "瓢虫", "insect"],
  ["mantis", "螳螂", "insect"],
  ["cicada", "蝉", "insect"],
  ["moth", "飞蛾", "insect"],
  ["stag-beetle", "锹形虫", "insect"],
  ["snake", "蛇", "reptile"],
  ["chameleon", "变色龙", "reptile"],
  ["gecko", "壁虎", "reptile"],
  ["frog", "青蛙", "reptile"],
  ["salamander", "蝾螈", "reptile"],
  ["crocodile", "鳄鱼", "reptile"],
  ["iguana", "鬣蜥", "reptile"],
  ["tortoise", "陆龟", "reptile"],
  ["axolotl", "美西螈", "reptile"],
  ["cobra", "眼镜蛇", "reptile"],
  ["elephant", "大象", "mammal"],
  ["giraffe", "长颈鹿", "hoofed"],
  ["zebra", "斑马", "hoofed"],
  ["rhino", "犀牛", "hoofed"],
  ["hippo", "河马", "mammal"],
  ["kangaroo", "袋鼠", "mammal"],
  ["koala", "考拉", "mammal"],
  ["sloth", "树懒", "mammal"],
  ["lemur", "狐猴", "mammal"],
  ["monkey", "猴子", "mammal"],
  ["gorilla", "大猩猩", "mammal"],
  ["meerkat", "猫鼬", "mammal"],
  ["camel", "骆驼", "hoofed"],
  ["llama", "美洲驼", "hoofed"],
  ["alpaca", "羊驼", "hoofed"],
  ["goat", "山羊", "hoofed"],
  ["ram", "公羊", "hoofed"],
  ["bull", "公牛", "hoofed"],
  ["bison", "野牛", "hoofed"],
  ["moose", "驼鹿", "hoofed"],
  ["antelope", "羚羊", "hoofed"],
  ["boar", "野猪", "mammal"],
  ["dog", "狗", "mammal"],
  ["bat", "蝙蝠", "bird"],
  ["mouse", "老鼠", "mammal"],
  ["hamster", "仓鼠", "mammal"],
  ["ferret", "雪貂", "mammal"],
  ["badger", "獾", "mammal"],
  ["skunk", "臭鼬", "mammal"],
  ["porcupine", "豪猪", "mammal"],
  ["armadillo", "犰狳", "mammal"],
  ["platypus", "鸭嘴兽", "aquatic"],
  ["pangolin", "穿山甲", "mammal"],
  ["red-panda", "小熊猫", "mammal"],
  ["snow-leopard", "雪豹", "mammal"]
];

function hashString(input) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.charCodeAt(0);
    hash = (hash * 16777619) >>> 0;
  }
  return hash >>> 0;
}

function hsl(h, s = 78, l = 58) {
  return `hsl(${h % 360} ${s}% ${l}%)`;
}

function stars(hash) {
  return Array.from({ length: 10 }, (_, index) => {
    const x = 20 + ((hash >>> (index % 12)) + index * 17) % 216;
    const y = 18 + ((hash >>> ((index + 5) % 12)) + index * 23) % 218;
    const r = 1.6 + ((hash + index * 9) % 5) / 2;
    return `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="url(#gold)" opacity=".72"/>`;
  }).join("");
}

function mammalShape(primary, secondary, gold) {
  return `
    <path d="M77 106 C78 57 116 38 130 84 C147 36 190 56 174 108" fill="${secondary}" opacity=".88"/>
    <ellipse cx="128" cy="128" rx="62" ry="58" fill="${primary}"/>
    <path d="M78 140 C92 188 160 196 180 140 C160 164 103 164 78 140Z" fill="${secondary}" opacity=".52"/>
    <circle cx="106" cy="120" r="8" fill="#080812"/>
    <circle cx="150" cy="120" r="8" fill="#080812"/>
    <path d="M128 130 l13 14 h-26Z" fill="${gold}"/>
    <path d="M93 153 Q128 184 163 153" fill="none" stroke="${gold}" stroke-width="5" stroke-linecap="round"/>
  `;
}

function birdShape(primary, secondary, gold) {
  return `
    <path d="M31 135 C67 76 102 77 126 128 C89 130 58 151 31 135Z" fill="${secondary}" opacity=".84"/>
    <path d="M225 135 C189 76 154 77 130 128 C167 130 198 151 225 135Z" fill="${secondary}" opacity=".84"/>
    <ellipse cx="128" cy="132" rx="47" ry="61" fill="${primary}"/>
    <circle cx="144" cy="83" r="32" fill="${primary}"/>
    <path d="M169 84 l36 13 l-35 14Z" fill="${gold}"/>
    <circle cx="151" cy="77" r="6" fill="#070711"/>
    <path d="M103 165 C122 177 147 177 166 165" fill="none" stroke="${gold}" stroke-width="5" stroke-linecap="round"/>
  `;
}

function aquaticShape(primary, secondary, gold) {
  return `
    <path d="M42 132 C82 70 154 75 198 129 C165 186 80 183 42 132Z" fill="${primary}"/>
    <path d="M196 129 l39 -32 l-7 66Z" fill="${secondary}"/>
    <path d="M104 89 C120 67 153 71 164 91 C142 86 124 87 104 89Z" fill="${secondary}" opacity=".72"/>
    <path d="M102 165 C123 186 157 180 171 160 C145 170 124 169 102 165Z" fill="${secondary}" opacity=".62"/>
    <circle cx="89" cy="122" r="7" fill="#070711"/>
    <path d="M64 144 C91 156 132 157 166 139" fill="none" stroke="${gold}" stroke-width="5" stroke-linecap="round" opacity=".75"/>
  `;
}

function insectShape(primary, secondary, gold) {
  return `
    <ellipse cx="91" cy="111" rx="48" ry="34" fill="${secondary}" opacity=".72" transform="rotate(-28 91 111)"/>
    <ellipse cx="165" cy="111" rx="48" ry="34" fill="${secondary}" opacity=".72" transform="rotate(28 165 111)"/>
    <ellipse cx="92" cy="165" rx="42" ry="29" fill="${secondary}" opacity=".62" transform="rotate(24 92 165)"/>
    <ellipse cx="164" cy="165" rx="42" ry="29" fill="${secondary}" opacity=".62" transform="rotate(-24 164 165)"/>
    <ellipse cx="128" cy="136" rx="25" ry="67" fill="${primary}"/>
    <circle cx="128" cy="73" r="27" fill="${primary}"/>
    <path d="M115 53 C95 29 77 30 65 48 M141 53 C161 29 179 30 191 48" fill="none" stroke="${gold}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="119" cy="72" r="5" fill="#070711"/><circle cx="137" cy="72" r="5" fill="#070711"/>
  `;
}

function reptileShape(primary, secondary, gold) {
  return `
    <path d="M49 137 C72 73 142 75 193 105 C220 121 221 150 195 164 C143 194 71 183 49 137Z" fill="${primary}"/>
    <path d="M78 116 C118 92 165 99 199 123 C160 122 115 123 78 116Z" fill="${secondary}" opacity=".58"/>
    <path d="M197 119 C225 101 239 113 232 142 C221 131 211 124 197 119Z" fill="${secondary}"/>
    <circle cx="91" cy="121" r="7" fill="#070711"/>
    <path d="M71 151 C108 169 152 169 190 149" fill="none" stroke="${gold}" stroke-width="5" stroke-linecap="round"/>
  `;
}

function hoofedShape(primary, secondary, gold) {
  return `
    <path d="M86 92 C67 44 44 40 35 70 M104 83 C98 38 124 26 128 73 M152 83 C158 38 132 26 128 73 M170 92 C189 44 212 40 221 70" fill="none" stroke="${gold}" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="128" cy="130" rx="55" ry="68" fill="${primary}"/>
    <path d="M94 154 C108 195 148 195 164 154 C146 166 113 166 94 154Z" fill="${secondary}" opacity=".62"/>
    <circle cx="107" cy="119" r="7" fill="#070711"/><circle cx="149" cy="119" r="7" fill="#070711"/>
    <path d="M128 137 l15 16 h-30Z" fill="${gold}"/>
  `;
}

function animalShape(family, primary, secondary, gold) {
  if (family === "bird") return birdShape(primary, secondary, gold);
  if (family === "aquatic") return aquaticShape(primary, secondary, gold);
  if (family === "insect") return insectShape(primary, secondary, gold);
  if (family === "reptile") return reptileShape(primary, secondary, gold);
  if (family === "hoofed") return hoofedShape(primary, secondary, gold);
  return mammalShape(primary, secondary, gold);
}

function svgForAnimal([slug, nameCn, family], index) {
  const hash = hashString(slug);
  const hue = (hash + index * 31) % 360;
  const hue2 = (hue + 82 + (hash % 37)) % 360;
  const primary = hsl(hue, 80, 58);
  const secondary = hsl(hue2, 82, 66);
  const gold = hsl(42 + (hash % 18), 86, 70);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-labelledby="title desc">
  <title id="title">${nameCn}</title>
  <desc id="desc">A colorful celestial ${slug} icon for the tarot easter egg.</desc>
  <defs>
    <radialGradient id="bg" cx="34%" cy="26%" r="78%">
      <stop offset="0" stop-color="${hsl(hue2, 90, 32)}"/>
      <stop offset=".55" stop-color="${hsl(hue, 70, 17)}"/>
      <stop offset="1" stop-color="#080711"/>
    </radialGradient>
    <linearGradient id="gold" x1="28" x2="224" y1="24" y2="230">
      <stop offset="0" stop-color="#fff0a8"/>
      <stop offset=".48" stop-color="${gold}"/>
      <stop offset="1" stop-color="#a66f2e"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feColorMatrix in="blur" values="1 0 0 0 0.9 0 1 0 0 0.55 0 0 1 0 1 0 0 0 0.55 0"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="256" height="256" rx="34" fill="url(#bg)"/>
  <circle cx="128" cy="128" r="100" fill="none" stroke="url(#gold)" stroke-width="2" opacity=".58"/>
  <circle cx="128" cy="128" r="76" fill="none" stroke="url(#gold)" stroke-width="1.4" opacity=".32"/>
  ${stars(hash)}
  <g filter="url(#glow)">
    ${animalShape(family, primary, secondary, gold)}
  </g>
  <path d="M37 215 C86 229 170 230 219 214" fill="none" stroke="url(#gold)" stroke-width="3" stroke-linecap="round" opacity=".74"/>
</svg>`;
}

mkdirSync("assets/animals", { recursive: true });
animals.forEach((animal, index) => {
  writeFileSync(join("assets/animals", `${animal[0]}.svg`), svgForAnimal(animal, index), "utf8");
});

const moduleBody = `export const ANIMAL_GALLERY = ${JSON.stringify(
  animals.map(([slug, nameCn, family]) => ({ slug, nameCn, family })),
  null,
  2
)};
`;

writeFileSync("src/data/animals.js", moduleBody, "utf8");
console.log(`Generated ${animals.length} animal SVGs.`);
