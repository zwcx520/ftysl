/* =====================================================================
 * 废土余生录 · 游戏引擎 engine.js
 * 条件求值、效果执行、昼夜推进、每日结算、搜刮、战斗、建造、交易
 * ===================================================================== */
window.Game = window.Game || {};

const SEASONS = ["autumn","winter","spring","summer"];
const SEASON_NAMES = { autumn:"秋", winter:"冬", spring:"春", summer:"夏" };
const CEASEFIRE_DAY = 45;

/* ============ 条件求值 ============ */
Game.evalReq = function (req) {
  if (!req) return true;
  const p = gameState.player;
  if (req.weapon) {
    if (gameState.equipped.weapon) return true;
    // 背包里有任何武器也算
    for (const id in gameState.inventory) if (GameData.items[id] && GameData.items[id].weapon) return true;
    return false;
  }
  if (req.facility) return Game.hasFacility(req.facility);
  if (req.item) return Game.hasItem(req.item, req.count || 1);
  if (req.stat) return cmp(p[req.stat], req.op, req.value);
  if (req.condition) return Game.hasCondition(req.condition);
  if (req.flag) return !!p.flags[req.flag];
  return true;
};
function cmp(a, op, b) { return ({">=":a>=b,"<=":a<=b,"==":a==b,"!=":a!=b,">":a>b,"<":a<b})[op]; }

/* ============ 效果执行 ============ */
Game.applyEffect = function (eff) {
  const p = gameState.player;
  switch (eff.type) {
    case "change_stat":
      if (eff.stat === "hp") p.hp += eff.value;
      else p[eff.stat] = (p[eff.stat] || 0) + eff.value;
      Game.clampStats(); break;
    case "add_item": Game.addItem(eff.item, eff.count || 1); break;
    case "remove_item": Game.removeItem(eff.item, eff.count || 1); break;
    case "lose_items": Game.loseRandomItems(eff.count || 1); break;
    case "add_condition": p.conditions[eff.condition] = { duration: eff.duration || 1 }; break;
    case "remove_condition": delete p.conditions[eff.condition]; break;
    case "set_flag": p.flags[eff.flag] = eff.value; break;
    case "morale_event":
      if (eff.kind === "good") p.goodPoints += eff.value;
      else p.karmaPoints += eff.value;
      break;
    case "radio_signal": Game.radioSignal(); break;
  }
  Save.markDirty();
};

/* 随机丢失物品（袭击） */
Game.loseRandomItems = function (count) {
  const ids = Object.keys(gameState.inventory).filter(id => gameState.inventory[id] > 0);
  for (let i = 0; i < count && ids.length; i++) {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const lost = Math.min(gameState.inventory[id], 1 + Math.floor(Math.random() * 2));
    Game.removeItem(id, lost);
    Game.log("丢失了 " + lost + " 个 " + GameData.items[id].name + "。", "danger");
    if (gameState.inventory[id] <= 0) ids.splice(ids.indexOf(id), 1);
  }
};

/* ============ 收音机广播 ============ */
Game.radioSignal = function () {
  const signals = [
    "广播：「……据可靠消息，停火谈判正在进行，幸存者们请坚持住……」",
    "广播：「……南区发现大型物资储藏点，注意武装分子活动……」",
    "广播：「……辐射雨将于近日来袭，请做好防护……」",
    "广播：「……有组织的搜救队正在向城北推进……」",
    "广播：「……今日天气转寒，注意保暖……」",
    "广播：「……西区发现幸存者聚居地，可前往寻求庇护……」",
    "广播：「……不明瘟疫在贫民窟蔓延，避免接触染病者……」",
    "广播：「……军方将在城东进行物资空投，注意查收……」",
    "广播：「……匪帮'铁手'正在北区活动，夜间务必紧闭门户……」",
    "广播：「……停火协议草案已获通过，预计两周内实施……」",
    "广播：「……水源检测报告：城西河流辐射超标，请勿饮用……」",
    "广播：「……有商人团体正在组织大规模集市，位置待定……」"
  ];
  Game.log(signals[Math.floor(Math.random() * signals.length)], "system");
};

/* ============ 阶段推进 ============ */
Game.toNight = function () {
  if (gameState.player.phase !== "day") return;
  gameState.player.phase = "night";
  Game.log("夜幕降临，废土上的危险随之苏醒。选择你的夜间行动。", "system");
  Save.markDirty();
};

/* 夜间行动：搜刮 */
Game.scavenge = function (locId) {
  const loc = GameData.locations[locId];
  if (!loc) return;
  const p = gameState.player;
  if (p.phase !== "night") { UI.toast("需在夜晚才能外出搜刮", "danger"); return; }
  // 暴风雪日禁止外出
  if (p.flags.blizzard_day) { UI.toast("暴风雪封路，今夜无法外出", "danger"); return; }

  p.scavenges++;
  Game.log("你趁夜色前往【" + loc.name + "】搜刮……", "narration");
  Game.log(loc.desc, "narration");

  // 搜刮加成：手电筒、地图、指南针、望远镜
  let bonus = 1;
  if (Game.hasItem("flashlight")) bonus += 0.2;
  if (Game.hasItem("map")) bonus += 0.15;
  if (Game.hasItem("compass")) bonus += 0.1;
  if (Game.hasItem("binoculars")) bonus += 0.15;

  // 掷战利品
  let gotSomething = false;
  loc.loot.forEach(entry => {
    if (Math.random() <= entry.chance * bonus) {
      const n = randInt(entry.min, entry.max);
      if (n > 0) {
        Game.addItem(entry.item, n);
        const it = GameData.items[entry.item];
        Game.log("搜得 " + it.name + " ×" + n + "。", "loot");
        gotSomething = true;
      }
    }
  });
  if (!gotSomething) Game.log("翻遍角落，一无所获，真是白跑一趟。", "narration");

  // 掷遭遇
  resolveEncounter(loc);

  // 搜刮消耗体力
  p.fatigue += 12 + loc.danger * 3;
  Game.clampStats();
  finishNight("scavenge");
};

/* 遭遇解析 */
function resolveEncounter(loc) {
  const p = gameState.player;
  if (Math.random() > loc.encounter.chance) {
    Game.log("今夜意外地平静，你安全返航。", "narration");
    return;
  }
  const table = loc.encounter.table;
  const total = table.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * total, picked = table[0];
  for (const e of table) { roll -= e.weight; if (roll <= 0) { picked = e; break; } }
  const etype = GameData.encounterTypes[picked.type] || { name: picked.type, icon:"fa-solid fa-circle-question" };

  switch (picked.type) {
    case "none": Game.log("风过无痕，此行平安。", "narration"); break;
    case "hostile_bandit":
    case "hostile_survivor":
    case "military_patrol":
      Game.log("⚠ 遭遇 " + etype.name + "！", "combat");
      doCombat(loc.danger, picked.type === "military_patrol");
      break;
    case "friendly_survivor":
      Game.log("遇见一位友善的幸存者，你们交换了些许物资与情报。", "good");
      if (Math.random() < 0.5) { Game.addItem("cigarettes", 1); Game.log("对方赠你一包香烟。", "loot"); }
      break;
    case "beggar":
      Game.log("一个虚弱的乞丐向你讨要食物。", "narration");
      if (Game.hasItem("canned_food") && Math.random() < 0.5) {
        Game.removeItem("canned_food", 1); p.morale += 6; p.goodPoints += 1;
        Game.log("你分了罐头给他，他指给你一处藏物点。", "good");
        Game.addItem("components", 2);
      }
      break;
    case "diseased":
      Game.log("一个神志不清的染病者扑来，你仓促应对。", "danger");
      doCombat(loc.danger, false);
      if (!p.flags.vaccinated && Math.random() < 0.3) { p.conditions.sick = { duration: 2 }; Game.log("你似乎被传染了……", "danger"); }
      else if (p.flags.vaccinated) Game.log("疫苗保护了你，没有感染。", "good");
      break;
    case "fire_hazard":
      Game.log("火星引燃了泄漏的燃油，现场燃起大火！", "danger");
      p.hp -= randInt(6, 14); Game.clampStats();
      if (Game.hasItem("clean_water", 1)) { Game.removeItem("clean_water", 1); Game.log("你用水扑灭了身上的火。", "narration"); }
      break;
    case "collapse":
      Game.log("建筑结构突然坍塌，碎石砸下！", "danger");
      p.hp -= randInt(8, 18); Game.clampStats();
      if (Math.random() < 0.4) p.conditions.wounded = { duration: 2 };
      break;
    case "moral_event":
      Game.log("你发现一处被洗劫的避难所，里面有奄奄一息的伤者。", "narration");
      if (Game.hasItem("medkit") && Math.random() < 0.6) {
        Game.removeItem("medkit", 1); p.morale += 10; p.goodPoints += 1;
        Game.log("你用急救包救了他，他临走留下一些零件。", "good"); Game.addItem("parts", 3);
      } else { p.morale -= 8; p.karmaPoints += 1; Game.log("你无力施救，转身离去，心如刀绞。", "danger"); }
      break;
  }
  Game.clampStats();
}

/* 战斗 */
function doCombat(danger, isMilitary) {
  const p = gameState.player;
  const weaponId = gameState.equipped.weapon;
  const weapon = weaponId ? GameData.items[weaponId] : null;
  let dmg = 8; // 徒手
  let ranged = false;
  if (weapon && weapon.weapon) {
    if (weapon.ammo) {
      const ammoCost = weapon.ammoCost || 1;
      if (Game.hasItem(weapon.ammo, ammoCost)) { Game.removeItem(weapon.ammo, ammoCost); dmg = weapon.damage; ranged = true; }
      else { Game.log("弹药耗尽，只能赤手空拳应战！", "danger"); }
    } else { dmg = weapon.damage; }
    // 耐久
    if (weapon.durability !== Infinity && weapon.durability > 0) {
      weaponDurabilityDown(weaponId);
    }
  }
  // 手榴弹加成
  if (Game.hasItem("grenade") && Math.random() < 0.3) {
    Game.removeItem("grenade", 1);
    dmg += 60;
    Game.log("你掷出一颗手榴弹！轰然爆炸，敌人血肉横飞！", "combat");
  }
  const armor = gameState.equipped.armor ? GameData.items[gameState.equipped.armor] : null;
  const defense = armor ? armor.defense : 0;

  const enemyPower = 18 + danger * 11 + (isMilitary ? 12 : 0);
  let playerPower = dmg + defense * 0.6 + (p.morale > 50 ? 5 : 0);
  // 同伴加成
  if (p.flags.has_companion) playerPower += 12;
  if (p.flags.has_dog) playerPower += 5;
  // 联盟成员加成
  if (p.flags.alliance_member) playerPower += 8;
  const playerRoll = playerPower + Math.random() * 18;
  const enemyRoll = enemyPower + Math.random() * 18;

  if (playerRoll >= enemyRoll) {
    const taken = Math.max(0, Math.floor(enemyPower * 0.4 - defense * 0.5 + Math.random() * 6));
    p.hp -= taken; p.kills++; Game.clampStats();
    Game.log("你" + (ranged ? "举枪" : "挥舞" + (weapon ? weapon.name : "拳头")) + "击退了敌人！" + (taken ? " 受伤 -" + taken + "HP" : " 毫发无伤") + "", "combat");
    // 战利品
    if (Math.random() < 0.5) { const loot = randCombatLoot(isMilitary); Game.addItem(loot, 1); Game.log("从敌人身上搜得 " + GameData.items[loot].name + "。", "loot"); }
    p.morale += 4; Game.clampStats();
  } else {
    const taken = Math.floor(enemyPower * 0.7 - defense * 0.4 + Math.random() * 10);
    p.hp -= Math.max(4, taken); Game.clampStats();
    Game.log("敌强我弱，你边战边退，险些丧命！受伤 -" + Math.max(4, taken) + "HP。", "combat");
    if (Math.random() < 0.4) { p.conditions.bleeding = { duration: 2 }; Game.log("伤口流血不止。", "danger"); }
    if (Math.random() < 0.3) Game.loseRandomItems(1);
  }
  // 狗加成
  if (p.flags.has_dog && Math.random() < 0.3) { p.hp += 4; Game.clampStats(); Game.log("忠犬助阵，为你分担了伤害。", "good"); }
}
function weaponDurabilityDown(id) {
  // 已装备的武器不在 inventory 中，耐久存于 flags；归零时直接卸下并销毁
  const key = "dur_" + id;
  gameState.player.flags[key] = (gameState.player.flags[key] === undefined ? GameData.items[id].durability : gameState.player.flags[key]) - 1;
  if (gameState.player.flags[key] <= 0) {
    if (gameState.equipped.weapon === id) gameState.equipped.weapon = null;
    delete gameState.player.flags[key];
    Game.log(GameData.items[id].name + " 在战斗中损坏了！", "danger");
  }
}
function randCombatLoot(isMilitary) {
  const pool = isMilitary ? ["ammo","rifle","medkit","radaway","dried_food","vest","stimulant","vaccine","grenade"] : ["ammo","components","cigarettes","bandage","scrap","knife","crossbow_bolt","leather_armor"];
  return pool[Math.floor(Math.random() * pool.length)];
}

/* 夜间行动：守夜 */
Game.guardNight = function () {
  const p = gameState.player;
  if (p.phase !== "night") return;
  p.flags.guarded = true;
  p.fatigue += 18; Game.clampStats();
  Game.log("你持械守夜，警惕地注视着门外的黑暗。", "narration");
  if (p.flags.has_companion) { p.fatigue -= 6; Game.clampStats(); Game.log("老周主动分担了守夜，你得以稍作歇息。", "good"); }
  if (p.flags.has_dog) { Game.log("忠犬趴在门口，竖着耳朵为你警戒。", "narration"); }
  finishNight("guard");
};
/* 夜间行动：休息 */
Game.sleepNight = function () {
  const p = gameState.player;
  if (p.phase !== "night") return;
  const bedBonus = Game.hasFacility("bed") ? 45 : 25;
  p.fatigue -= bedBonus;
  if (p.hunger > 30 && p.thirst > 30) p.hp += 8;
  Game.clampStats();
  Game.log("你沉沉睡去，在废土的噩梦中短暂安歇。疲劳 -" + bedBonus + "。", "good");
  finishNight("sleep");
};

/* 结束夜晚 → 结算 → 新一天 */
function finishNight(action) {
  const p = gameState.player;
  p.phase = "settlement";
  Game.settleDay(action);
}

/* ============ 每日结算 ============ */
Game.settleDay = function (nightAction) {
  const p = gameState.player;

  // —— 1. 基础衰减 ——
  let hungerDec = 12, thirstDec = 14;
  if (gameState.player.season === "summer") thirstDec += 6;
  if (gameState.player.season === "winter") hungerDec += 3;
  p.hunger -= hungerDec; p.thirst -= thirstDec;
  p.fatigue += (nightAction === "guard" ? 0 : 5); // 守夜已加，睡眠已减，搜刮已加
  Game.clampStats();

  // —— 2. 状态效果 ——
  if (p.conditions.bleeding) { p.hp -= 8; Game.log("失血 -8HP。", "danger"); }
  if (p.conditions.wounded) { p.hp -= 4; Game.log("伤口作痛 -4HP。", "danger"); }
  if (p.conditions.sick) { p.hp -= 6; p.fatigue += 8; Game.log("病痛折磨 -6HP。", "danger"); }
  if (p.conditions.infection) { p.hp -= 10; Game.log("感染恶化 -10HP！", "danger"); }
  if (p.conditions.food_poisoning) { p.hp -= 5; p.thirst -= 10; Game.log("上吐下泻 -5HP。", "danger"); }
  // 状态倒计时
  for (const c in p.conditions) {
    p.conditions[c].duration--;
    if (p.conditions[c].duration <= 0) { delete p.conditions[c]; Game.log("「" + conditionName(c) + "」症状缓解。", "good"); }
  }

  // —— 3. 极限阈值 ——
  if (p.hunger <= 0) { p.hp -= 8; Game.log("饥肠辘辘，体力流失 -8HP。", "danger"); }
  if (p.thirst <= 0) { p.hp -= 10; Game.log("严重脱水 -10HP！", "danger"); }
  if (p.fatigue >= 100) { p.hp -= 5; Game.log("过度劳累，几近崩溃 -5HP。", "danger"); }
  if (p.morale <= 0) { p.hp -= 3; Game.log("万念俱灰，精神萎靡 -3HP。", "danger"); }
  if (p.radiation >= 80) { p.conditions.radiation_sickness = { duration: 3 }; p.hp -= 5; Game.log("辐射病发作！", "danger"); }
  else if (p.radiation >= 50) { p.hp -= 3; }
  Game.clampStats();

  // —— 3.5 保底物资（每日自动获得基础生存物资）——
  processDailySupplies();

  // —— 4. 设施维护与产出 ——
  processFacilities();

  // —— 4.5 防护服辐射削减 ——
  const equippedArmor = gameState.equipped.armor ? GameData.items[gameState.equipped.armor] : null;
  if (equippedArmor && equippedArmor.radProtect) {
    p.radiation = Math.max(0, p.radiation - equippedArmor.radProtect * 0.3);
  }

  // —— 5. 食物腐烂 ——
  processDecay();

  // —— 6. 随机事件 ——
  triggerRandomEvent();

  // —— 7. 商店补货 ——
  if (p.day - gameState.shop.lastRestockDay >= GameData.shopConfig.restockDays) Game.restockShop();

  // —— 8. 死亡判定 ——
  if (p.hp <= 0) { Game.gameOver("dead"); return; }

  // —— 9. 推进日期与季节 ——
  p.day++;
  p.seasonDay++;
  if (p.seasonDay > 10) { p.seasonDay = 1; p.season = SEASONS[(SEASONS.indexOf(p.season) + 1) % 4]; }
  p.phase = "day";
  p.flags.blizzard_day = false;
  p.flags.guarded = false;
  Game.clampStats();

  // —— 10. 停火结局 ——
  if (p.day > CEASEFIRE_DAY) { Game.gameOver("ceasefire"); return; }

  Game.log("【第" + p.day + "天 · " + SEASON_NAMES[p.season] + "】晨光透过破窗洒入，你又活过了一夜。", "system");
  Save.markDirty();
};

function conditionName(c) {
  return { bleeding:"出血", wounded:"外伤", sick:"生病", infection:"感染", food_poisoning:"食物中毒", radiation_sickness:"辐射病", hypothermia:"失温" }[c] || c;
}

/* 保底物资：每日自动获得基础生存物资 */
function processDailySupplies() {
  const p = gameState.player;
  // 基础保底：每天获得少量食物和水
  // 随机从保底物资池中抽取
  const supplyPool = [
    { item: "wild_fruit", count: 1, weight: 25 },
    { item: "dirty_water", count: 1, weight: 25 },
    { item: "scrap", count: 1, weight: 15 },
    { item: "components", count: 1, weight: 10 },
    { item: "canned_food", count: 1, weight: 8 },
    { item: "clean_water", count: 1, weight: 8 },
    { item: "bandage", count: 1, weight: 5 },
    { item: "firewood", count: 1, weight: 4 }
  ];
  
  // 随机抽取2-3件保底物资
  const numSupplies = 2 + (Math.random() < 0.3 ? 1 : 0);
  const pool = supplyPool.slice();
  let gotItems = [];
  
  for (let i = 0; i < numSupplies && pool.length > 0; i++) {
    const totalWeight = pool.reduce((s, e) => s + e.weight, 0);
    let roll = Math.random() * totalWeight;
    let picked = pool[0];
    for (const e of pool) { roll -= e.weight; if (roll <= 0) { picked = e; break; } }
    pool.splice(pool.indexOf(picked), 1);
    
    Game.addItem(picked.item, picked.count);
    const it = GameData.items[picked.item];
    gotItems.push(it.name + "×" + picked.count);
  }
  
  if (gotItems.length > 0) {
    Game.log("废土拾荒：你翻找了附近残骸，获得 " + gotItems.join("、") + "。", "loot");
  }
  
  // 极端保底：如果饱食或水分低于15，额外获得紧急物资
  if (p.hunger < 15) {
    Game.addItem("wild_fruit", 1);
    Game.log("饥饿驱使你拼死搜寻，找到一点野果充饥。", "good");
  }
  if (p.thirst < 15) {
    Game.addItem("dirty_water", 1);
    Game.log("干渴难耐，你找到一处浑浊水洼，勉强解渴。", "good");
  }
}

/* 设施维护与产出 */
function processFacilities() {
  const p = gameState.player;
  // 发电机加成
  const genLv = Game.facilityLevel("generator");
  const genBonus = genLv === 1 ? 0.15 : (genLv >= 2 ? 0.30 : 0);
  for (const fid in gameState.shelter) {
    const f = GameData.facilities[fid];
    const lv = gameState.shelter[fid].level;
    if (!f) continue;
    // 维护费（强化火炉燃料减半：隔日消耗一次）
    if (f.dailyUpkeep) {
      const heaterHalf = (fid === "heater" && lv >= 2 && (p.day % 2 === 0));
      let canPay = true;
      for (const it in f.dailyUpkeep) {
        let need = f.dailyUpkeep[it] * (heaterHalf ? 0 : 1);
        if (need > 0 && Game.itemCount(it) < need) { canPay = false; break; }
      }
      if (canPay) { for (const it in f.dailyUpkeep) { let need = f.dailyUpkeep[it] * (heaterHalf ? 0 : 1); if (need > 0) Game.removeItem(it, need); } }
      else { Game.log(f.name + " 因缺少燃料而停转。", "danger"); continue; }
    }
    // 产出
    if (f.produce) {
      let mul = 1;
      if (fid === "rain_collector" && lv >= 2) mul = 1.5;
      else if (fid === "garden" && lv >= 2) mul = 2;
      else if (fid === "fish_pond" && lv >= 2) mul = 2;
      mul += genBonus; // 发电机加成
      for (const it in f.produce) {
        let amt = Math.round(f.produce[it] * mul);
        if (amt < 1) amt = 1;
        if (it === "water") { Game.addItem("clean_water", amt); Game.log(f.name + " 产出干净水 ×" + amt + "。", "good"); }
        else { Game.addItem(it, amt); Game.log(f.name + " 产出 " + GameData.items[it].name + " ×" + amt + "。", "good"); }
      }
      // 陷阱Lv2偶尔产出野果
      if (fid === "trap" && lv >= 2 && Math.random() < 0.4) {
        Game.addItem("wild_fruit", 1);
        Game.log("陷阱还捕获了一些野果。", "loot");
      }
    }
    // 医务室：自动缓解疾病
    if (fid === "infirmary" && lv >= 1 && p.conditions.sick) { p.conditions.sick.duration--; }
  }
  Game.clampStats();
}

/* 食物腐烂 */
function processDecay() {
  if (!gameState.decay) gameState.decay = {};
  for (const id in gameState.decay) {
    if (!Game.hasItem(id)) { delete gameState.decay[id]; continue; }
    gameState.decay[id]--;
    if (gameState.decay[id] <= 0) {
      const cnt = Game.itemCount(id);
      Game.removeItem(id, cnt);
      Game.addItem("rotten_food", cnt);
      delete gameState.decay[id];
      Game.log(GameData.items[id].name + " ×" + cnt + " 腐烂变质了！", "danger");
    }
  }
}

/* 随机事件触发 */
function triggerRandomEvent() {
  const p = gameState.player;
  const candidates = GameData.dailyEventPool
    .map(id => GameData.events[id])
    .filter(e => {
      const t = e.trigger;
      if (p.day < t.minDay) return false;
      if (t.season && p.season !== t.season) return false;
      return true;
    });
  if (!candidates.length) return;
  // 袭击概率受防御设施影响
  for (const e of candidates) {
    let ch = e.trigger.chance;
    if (e.id === "raid") {
      if (Game.hasFacility("reinforced_door")) ch *= 0.5;
      if (Game.hasFacility("watchtower")) ch *= 0.7;
      if (p.flags.guarded) ch *= 0.6;
      if (p.flags.has_dog) ch *= 0.85;
      if (p.flags.has_companion) ch *= 0.75;
      if (p.flags.alliance_member) ch *= 0.8;
    }
    if (Math.random() < ch) {
      Game.pendingEvent = e.id;
      return; // 每日最多一个事件
    }
  }
}

/* ============ 建造 / 升级设施 ============ */
Game.canBuild = function (fid) {
  const f = GameData.facilities[fid];
  if (!f) return { ok:false, reason:"未知设施" };
  if (f.requires && !Game.hasFacility(f.requires)) return { ok:false, reason:"需要先建造 " + GameData.facilities[f.requires].name };
  const lv = Game.facilityLevel(fid);
  if (lv >= f.maxLevel) return { ok:false, reason:"已达最高等级" };
  const cost = lv === 0 ? f.buildCost : f.upgradeCosts[lv - 1];
  for (const it in cost) if (Game.itemCount(it) < cost[it]) return { ok:false, reason:"材料不足" };
  return { ok:true, cost:cost };
};
Game.buildFacility = function (fid) {
  const check = Game.canBuild(fid);
  if (!check.ok) { UI.toast(check.reason, "danger"); return false; }
  const f = GameData.facilities[fid];
  const lv = Game.facilityLevel(fid);
  for (const it in check.cost) Game.removeItem(it, check.cost[it]);
  if (lv === 0) { gameState.shelter[fid] = { level: 1 }; Game.log("建成 " + f.name + "！" + f.descLv[0], "good"); }
  else { gameState.shelter[fid].level = lv + 1; Game.log(f.name + " 升级至 Lv." + (lv + 1) + "。" + (f.descLv[lv] || ""), "good"); }
  // 床建成即时效果提示
  Save.markDirty();
  return true;
};

/* ============ 制造 ============ */
Game.canCraft = function (rid) {
  const r = GameData.recipes[rid];
  if (!r) return { ok:false, reason:"未知配方" };
  if (r.facility && !Game.hasFacility(r.facility, r.facilityLv)) return { ok:false, reason:"需要 " + GameData.facilities[r.facility].name + " Lv." + r.facilityLv };
  for (const it in r.input) if (Game.itemCount(it) < r.input[it]) return { ok:false, reason:"材料不足" };
  return { ok:true, recipe:r };
};
Game.craft = function (rid) {
  const check = Game.canCraft(rid);
  if (!check.ok) { UI.toast(check.reason, "danger"); return false; }
  const r = check.recipe;
  for (const it in r.input) Game.removeItem(it, r.input[it]);
  for (const it in r.output) { Game.addItem(it, r.output[it]); Game.log("制造 " + GameData.items[it].name + " ×" + r.output[it] + "。", "loot"); }
  gameState.player.fatigue += 6; Game.clampStats();
  Save.markDirty();
  return true;
};

/* ============ 进食 / 饮水 / 使用物品 ============ */
Game.consume = function (id) {
  const it = GameData.items[id];
  if (!it || !Game.hasItem(id)) { UI.toast("没有该物品", "danger"); return; }
  // 食物
  if (it.category === "food") {
    if (it.nutrition === 0) { UI.toast(it.name + "需要加工后才能食用", "danger"); return; }
    if (it.rawRisk && Math.random() < it.rawRisk) {
      gameState.player.conditions.food_poisoning = { duration: 2 };
      Game.log("你吃了 " + it.name + "，却闹起了肚子！", "danger");
    } else Game.log("你食用了 " + it.name + "，饱腹 +" + it.nutrition + "。", "good");
    gameState.player.hunger += it.nutrition; Game.removeItem(id, 1);
  } else if (it.category === "water") {
    if (it.rawRisk && Math.random() < it.rawRisk) {
      gameState.player.conditions.sick = { duration: 2 };
      Game.log("脏水下肚，你感到一阵不适……", "danger");
    } else Game.log("你饮下 " + it.name + "，解渴 +" + it.nutrition + "。", "good");
    gameState.player.thirst += it.nutrition; Game.removeItem(id, 1);
  } else if (it.usable && it.effects) {
    it.effects.forEach(eff => {
      if (eff.type === "treat") {
        (eff.conditions || []).forEach(c => delete gameState.player.conditions[c]);
        gameState.player.hp += eff.hp || 0;
        Game.log("使用 " + it.name + "，治疗了伤病，恢复 " + (eff.hp || 0) + "HP。", "good");
      } else Game.applyEffect(eff);
    });
    if (!it.reusable) Game.removeItem(id, 1);
  } else { UI.toast("该物品无法直接使用", "danger"); return; }
  Game.clampStats();
  Save.markDirty();
};

/* ============ 装备 ============ */
Game.equip = function (id) {
  const it = GameData.items[id];
  if (!it) return;
  if (it.weapon) {
    if (gameState.equipped.weapon) Game.addItem(gameState.equipped.weapon, 1);
    gameState.equipped.weapon = id; Game.removeItem(id, 1);
    Game.log("装备了 " + it.name + "。", "system");
  } else if (it.armor) {
    if (gameState.equipped.armor) Game.addItem(gameState.equipped.armor, 1);
    gameState.equipped.armor = id; Game.removeItem(id, 1);
    Game.log("穿上了 " + it.name + "。", "system");
  }
  Save.markDirty();
};
Game.unequip = function (slot) {
  const id = gameState.equipped[slot];
  if (!id) return;
  Game.addItem(id, 1); gameState.equipped[slot] = null;
  Save.markDirty();
};

/* ============ 商店 ============ */
Game.initShopStock = function () {
  gameState.shop = { stock: {}, lastRestockDay: gameState.player.day, randomItems: [] };
  Game.restockShop();
};
Game.restockShop = function () {
  const stock = {};
  for (const id in GameData.shopBaseStock) stock[id] = GameData.shopBaseStock[id];
  // 随机抽 6 种
  const pool = GameData.shopRandomPool.slice();
  const random = [];
  for (let i = 0; i < 6 && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const id = pool.splice(idx, 1)[0];
    stock[id] = (stock[id] || 0) + randInt(1, 3);
    random.push(id);
  }
  // 游商专属
  if (gameState.player.flags.trader_here) {
    GameData.shopTraderSpecial.forEach(id => { stock[id] = (stock[id] || 0) + 1; });
  }
  gameState.shop.stock = stock;
  gameState.shop.randomItems = random;
  gameState.shop.lastRestockDay = gameState.player.day;
  Save.markDirty();
};
Game.buyPrice = function (id) {
  let v = Math.ceil(GameData.items[id].value * GameData.shopConfig.buyMarkup);
  if (gameState.player.flags.trader_here) v = Math.ceil(v * GameData.shopConfig.traderDiscount);
  return v;
};
Game.sellPrice = function (id) {
  return Math.max(1, Math.floor(GameData.items[id].value * GameData.shopConfig.sellMarkdown));
};
Game.buy = function (id, count) {
  count = count || 1;
  const price = Game.buyPrice(id);
  const total = price * count;
  if ((gameState.shop.stock[id] || 0) < count) { UI.toast("库存不足", "danger"); return false; }
  if (gameState.player.caps < total) { UI.toast("瓶盖不足", "danger"); return false; }
  gameState.player.caps -= total;
  gameState.shop.stock[id] -= count;
  if (gameState.shop.stock[id] <= 0) delete gameState.shop.stock[id];
  Game.addItem(id, count);
  Game.log("购入 " + GameData.items[id].name + " ×" + count + "，花费 " + total + " 瓶盖。", "system");
  Save.markDirty();
  return true;
};
Game.sell = function (id, count) {
  count = count || 1;
  if (!Game.hasItem(id, count)) { UI.toast("物品不足", "danger"); return false; }
  const price = Game.sellPrice(id);
  const total = price * count;
  Game.removeItem(id, count);
  gameState.player.caps += total;
  gameState.shop.stock[id] = (gameState.shop.stock[id] || 0) + count;
  Game.log("卖出 " + GameData.items[id].name + " ×" + count + "，获得 " + total + " 瓶盖。", "system");
  Save.markDirty();
  return true;
};

/* ============ 结局 ============ */
Game.gameOver = function (type) {
  const p = gameState.player;
  let title, desc;
  if (type === "dead") {
    title = "殒命废土";
    desc = "第 " + p.day + " 天，你倒在了无人的废墟之中。废土吞没了又一个灵魂。";
    p.flags.gameover = "dead";
  } else {
    // 停火结局判定
    let ending;
    if (p.karmaPoints >= 3) ending = "karma";
    else if (p.goodPoints >= 3 && p.karmaPoints <= 1) ending = "good";
    else ending = "sad";
    title = { karma:"业报结局", good:"幸存者结局", sad:"黯淡结局" }[ending];
    desc = {
      karma: "停火日到来，你活了下来，可手上沾染的罪孽将伴随余生。第 " + p.day + " 天，善恶终有报。",
      good: "停火日到来！你坚守人性，在末世中保住了灵魂。第 " + p.day + " 天，迎来新生。",
      sad: "停火日到来，你活了下来，却只剩一具空壳。第 " + p.day + " 天，余生茫然。"
    }[ending];
    p.flags.gameover = ending;
  }
  Game.log("【结局】" + title + " —— " + desc, "system");
  Save.markDirty();
  if (window.UI && UI.showEnding) UI.showEnding(title, desc);
};

/* ============ 工具 ============ */
function randInt(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
Game.randInt = randInt;
Game.SEASON_NAMES = SEASON_NAMES;
Game.CEASEFIRE_DAY = CEASEFIRE_DAY;
