/* =====================================================================
 * 废土余生录 · 末日商店 shop.js
 * 瓶盖(caps)为流通货币。玩家卖出物品换瓶盖，买入物品花瓶盖。
 * 每隔 restockDays 天补货并刷新随机商品。
 * ===================================================================== */
window.GameData = window.GameData || {};

/* 交易费率 */
GameData.shopConfig = {
  buyMarkup: 1.45,     /* 商人售价 = 物品价值 × 1.45（向上取整） */
  sellMarkdown: 0.55,  /* 商人收购 = 物品价值 × 0.55（向下取整） */
  restockDays: 3,      /* 补货周期 */
  traderDiscount: 0.9  /* 游商上门时售价 × 0.9 */
};

/* 商人常驻基础库存（id: 基础库存上限） */
GameData.shopBaseStock = {
  canned_food: 6,
  clean_water: 8,
  bandage: 4,
  herbal_meds: 3,
  components: 12,
  wood: 10,
  firewood: 8,
  fuel: 4,
  ammo: 6,
  cigarettes: 5,
  salt: 6,
  cloth: 8,
  scrap: 10,
  /* —— 扩展包常驻 —— */
  rice: 4,
  crackers: 5,
  mineral_water: 4,
  gauze: 3,
  nails: 8,
  duct_tape: 5
};

/* 随机刷新商品池（每次补货从中随机抽 6 种） */
GameData.shopRandomPool = [
  "meds","radaway","painkiller","medkit","antidote","vaccine","vitamin","stimulant",
  "knife","crowbar","hatchet","bow","pistol","machete","spear","crossbow","crossbow_bolt",
  "helmet","vest","gas_mask","gas_suit","leather_armor","riot_helmet","shield",
  "flashlight","map","radio","compass","binoculars","watch","sewing_kit",
  "coffee","jewelry","alcohol","book","dried_food","energy_drink","playing_cards","harmonica",
  "bottled_water","cement","parts","electronics","cloth","herb",
  "rope","battery","steel","gunpowder","fertilizer","seeds","grain","bread","dried_meat",
  "battery_pack","coal","candle",
  /* —— 扩展包：食物 —— */
  "canned_beans","pemmican","canned_fruit","cheese","chocolate","beef_jerky","powdered_milk",
  "canned_soup","energy_bar","canned_tuna","flour","cooking_oil","canned_stew",
  /* —— 扩展包：饮水 —— */
  "soda","herbal_tea","coconut_milk","boiled_water",
  /* —— 扩展包：药品 —— */
  "gauze","antiseptic_wipe","antibiotics","iodine_pills","band_aid","tourniquet",
  "cough_syrup","burn_ointment","eye_drops","anti_diarrhea_pills","smelling_salts",
  /* —— 扩展包：材料 —— */
  "iron_plate","rubber","canvas","wire_mesh","metal_pipe","brick","silicone","gear",
  "spring","bearing","epoxy","tin_sheet","fiberglass","ceramic_plate","leather","foam",
  "chain","solder",
  /* —— 扩展包：燃料 —— */
  "diesel","kerosene","propane_tank","power_cell","biofuel","charcoal_briquette","engine_oil",
  /* —— 扩展包：珍品（常见） —— */
  "silver_coin","gold_tooth","silver_spoon","dog_tags","vintage_wine","pocket_bible","silver_locket",
  "vinyl_record","chess_set"
];

/* 游商专属稀有商品（trader_here 时追加） */
GameData.shopTraderSpecial = [
  "rifle","shotgun","vest","medkit","radaway","dried_food","map","gas_mask",
  "gold_bar","vaccine","antidote","toolkit","riot_helmet","gas_suit","grenade","crossbow",
  /* —— 扩展包：稀有武器 —— */
  "katana","sledgehammer","combat_knife","sniper_rifle","flamethrower","taser",
  "switchblade","baseball_bat","nail_gun","brass_knuckles",
  /* —— 扩展包：稀有防具 —— */
  "combat_helmet","tactical_vest","biohazard_suit","kevlar_armor","gas_goggles",
  "combat_boots","arm_guard","neck_guard",
  /* —— 扩展包：稀有药品 —— */
  "morphine","adrenaline","surgical_kit","blood_bag",
  /* —— 扩展包：稀有珍品 —— */
  "diamond","painting","antique_vase","pocket_watch","violin","typewriter","camera",
  "sextant","jade_pendant","antique_clock","stamp_collection"
];

/* 商品分类排序优先级（用于商店展示） */
GameData.shopOrder = [
  "food","water","medicine","material","weapon","armor","fuel","special"
];
