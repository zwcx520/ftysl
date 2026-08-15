/* =====================================================================
 * 废土余生录 · 状态管理 state.js
 * 单一数据源 gameState + 全局 Game 对象封装核心方法
 * ===================================================================== */
window.Game = window.Game || {};

const SAVE_VERSION = 3;
const SAVE_KEY = "wasteland_chronicles_save_v3";

/* ---------- 默认状态：开新档 ---------- */
function defaultState(playerName) {
  return {
    version: SAVE_VERSION,
    meta: { saveTime: 0, playTime: 0, started: Date.now() },
    player: {
      name: playerName || "无名幸存者",
      hp: 100, maxHp: 100,
      hunger: 80, thirst: 80, fatigue: 0, morale: 60, radiation: 0,
      caps: 20, day: 1, phase: "day", season: "autumn", seasonDay: 1,
      conditions: {},        // { bleeding: {duration:2}, sick: {duration:1} }
      flags: {},             // { helped_neighbor: true, ... }
      goodPoints: 0, karmaPoints: 0,
      kills: 0, scavenges: 0
    },
    inventory: {
      canned_food: 2, clean_water: 2, components: 5, wood: 3,
      firewood: 2, bandage: 1, rope: 1, wild_fruit: 1
    },
    shelter: {},             // { workshop: {level:1}, ... }
    equipped: { weapon: "crowbar", armor: null },
    shop: { stock: {}, lastRestockDay: 0, randomItems: [] },
    log: [],
    ui: { activeTab: "shelter" }
  };
}

let gameState = null;

/* ---------- 全局 Game 对象 ---------- */
Game.state = gameState;

Game.getState = () => gameState;
Game.setState = (s) => { gameState = s; Game.state = gameState; };

Game.newGame = function (name) {
  gameState = defaultState(name);
  Game.state = gameState;
  Game.log("【第1天 · 秋】末世降临，你在一处废弃民宅中醒来，窗外是死寂的废土。", "system");
  Game.log("白天可建造设施、制造物品、烹饪食物、交易买卖；入夜后可外出搜刮、守夜或休息。", "system");
  Game.log("建造工作台解锁制造，炉灶可烹饪食物，雨水收集器与菜园可自给自足。探索18个地点，遭遇23种随机事件，活过45天迎来结局。", "system");
  Game.initShopStock();
  Save.markDirty();
  return gameState;
};

/* ---------- 物品/属性 工具 ---------- */
Game.hasItem = function (id, count) {
  count = count || 1;
  return (gameState.inventory[id] || 0) >= count;
};
Game.itemCount = function (id) { return gameState.inventory[id] || 0; };

Game.addItem = function (id, count) {
  count = count || 1;
  const def = GameData.items[id];
  if (!def) return;
  gameState.inventory[id] = (gameState.inventory[id] || 0) + count;
  if (def.stack && gameState.inventory[id] > def.max) gameState.inventory[id] = def.max;
  // 初始化食物腐烂计数（统一在此处理，覆盖搜刮/制造/购买等所有来源）
  if (def.decay && def.category === "food") {
    if (!gameState.decay) gameState.decay = {};
    if (gameState.decay[id] === undefined) gameState.decay[id] = def.decay;
  }
};
Game.removeItem = function (id, count) {
  count = count || 1;
  if ((gameState.inventory[id] || 0) < count) return false;
  gameState.inventory[id] -= count;
  if (gameState.inventory[id] <= 0) delete gameState.inventory[id];
  return true;
};

Game.hasFacility = function (id, level) {
  const f = gameState.shelter[id];
  if (!f) return false;
  return level ? f.level >= level : true;
};
Game.facilityLevel = function (id) {
  return gameState.shelter[id] ? gameState.shelter[id].level : 0;
};

/* 属性 clamp 与死亡检查 */
Game.STAT_KEYS = ["hp","hunger","thirst","fatigue","morale","radiation"];
Game.clampStats = function () {
  const p = gameState.player;
  p.hp = clamp(p.hp, 0, p.maxHp);
  p.hunger = clamp(p.hunger, 0, 100);
  p.thirst = clamp(p.thirst, 0, 100);
  p.fatigue = clamp(p.fatigue, 0, 100);
  p.morale = clamp(p.morale, 0, 100);
  p.radiation = clamp(p.radiation, 0, 100);
};
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
Game.clamp = clamp;

Game.hasCondition = function (c) { return !!gameState.player.conditions[c]; };

/* ---------- 日志系统 ---------- */
Game.log = function (text, category) {
  category = category || "narration";
  gameState.log.push({ text, category, day: gameState.player.day, t: Date.now() });
  if (gameState.log.length > 240) gameState.log.shift();
};
Game.logCategories = {
  narration: { name:"叙事", color:"#d3b17d" },
  system:    { name:"系统", color:"#549688" },
  combat:    { name:"战斗", color:"#bf242a" },
  loot:      { name:"拾取", color:"#ffb61e" },
  danger:    { name:"危险", color:"#8B1A1A" },
  good:      { name:"幸事", color:"#16a951" }
};
