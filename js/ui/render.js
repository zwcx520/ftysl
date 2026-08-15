/* =====================================================================
 * 废土余生录 · UI 渲染层 render.js
 * 单向数据流：state → render() → DOM。绝不反向操作。
 * ===================================================================== */
window.UI = window.UI || {};

const radarCharts = {};

/* ---------- 属性条配置 ---------- */
const STAT_CFG = {
  hp:       { name:"生命", icon:"fa-solid fa-heart",         color:"#8B1A1A", good:"high" },
  hunger:   { name:"饱食", icon:"fa-solid fa-utensils",      color:"#b9770e", good:"high" },
  thirst:   { name:"水分", icon:"fa-solid fa-droplet",       color:"#2980b9", good:"high" },
  fatigue:  { name:"疲劳", icon:"fa-solid fa-bed",           color:"#7f8c8d", good:"low"  },
  morale:   { name:"精神", icon:"fa-solid fa-face-smile",    color:"#f1c40f", good:"high" },
  radiation:{ name:"辐射", icon:"fa-solid fa-radiation",     color:"#39FF14", good:"low"  }
};

/* ---------- 全量渲染 ---------- */
UI.fullRender = function () {
  if (!gameState) return;
  UI.renderHeader();
  UI.renderStats();
  UI.renderTab();
  UI.renderActions();
  UI.renderPendingEvent();
  UI.updateSaveBadge();
};

/* ---------- 顶部状态条 ---------- */
UI.renderHeader = function () {
  const p = gameState.player;
  const phaseText = { day:"白昼", night:"夜晚", settlement:"结算中" }[p.phase] || "白昼";
  const phaseIcon = p.phase === "night" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  document.getElementById("hdr-day").textContent = "第 " + p.day + " 天";
  document.getElementById("hdr-season").textContent = Game.SEASON_NAMES[p.season] + "·" + p.seasonDay;
  document.getElementById("hdr-phase").innerHTML = '<i class="' + phaseIcon + '"></i> ' + phaseText;
  document.getElementById("hdr-caps").innerHTML = '<i class="fa-solid fa-circle-dot"></i> ' + p.caps;
  document.getElementById("hdr-name").textContent = p.name;

  // 进度（距停火）
  const prog = Math.min(100, Math.round((p.day / Game.CEASEFIRE_DAY) * 100));
  const bar = document.getElementById("hdr-progress");
  if (bar) { bar.style.width = prog + "%"; bar.textContent = prog + "%"; }
};

/* ---------- 属性面板 ---------- */
UI.buildStatsHTML = function () {
  const p = gameState.player;
  let html = "";
  for (const k of Game.STAT_KEYS) {
    const cfg = STAT_CFG[k];
    const val = p[k];
    const pct = Math.max(0, Math.min(100, val));
    const warn = (cfg.good === "high" && val < 25) || (cfg.good === "low" && val > 75);
    html += '<div class="stat-row">'
      + '<span class="stat-label"><i class="' + cfg.icon + '" style="color:' + cfg.color + '"></i>' + cfg.name + '</span>'
      + '<div class="stat-track"><div class="stat-fill ' + (warn ? "stat-warn" : "") + '" style="width:' + pct + '%;background:' + cfg.color + '"></div></div>'
      + '<span class="stat-val">' + Math.round(val) + '</span>'
      + '</div>';
  }
  // 状态
  const conds = Object.keys(p.conditions);
  if (conds.length) {
    html += '<div class="cond-list">' + conds.map(c => '<span class="cond-tag"><i class="fa-solid fa-disease"></i> ' + condNameZH(c) + '</span>').join("") + '</div>';
  }
  // 装备
  const w = gameState.equipped.weapon ? GameData.items[gameState.equipped.weapon] : null;
  const a = gameState.equipped.armor ? GameData.items[gameState.equipped.armor] : null;
  html += '<div class="equip-list">'
    + '<span class="equip-tag' + (w ? " clickable" : "") + '" ' + (w ? 'onclick="UI.unequip(\'weapon\')"' : "") + '><i class="fa-solid fa-khanda"></i> ' + (w ? w.name + ' <i class="fa-solid fa-xmark"></i>' : "徒手") + '</span>'
    + '<span class="equip-tag' + (a ? " clickable" : "") + '" ' + (a ? 'onclick="UI.unequip(\'armor\')"' : "") + '><i class="fa-solid fa-shield-halved"></i> ' + (a ? a.name + ' <i class="fa-solid fa-xmark"></i>' : "无") + '</span>'
    + '</div>';
  return html;
};
UI.renderStats = function () {
  const box = document.getElementById("stat-bars");
  if (box) box.innerHTML = UI.buildStatsHTML();
  UI.renderRadar("radar-chart");
};

function condNameZH(c) {
  return { bleeding:"出血", wounded:"外伤", sick:"生病", infection:"感染", food_poisoning:"食物中毒", radiation_sickness:"辐射病", hypothermia:"失温" }[c] || c;
}

/* ---------- ECharts 雷达图 ---------- */
UI.renderRadar = function (elId) {
  elId = elId || "radar-chart";
  const el = document.getElementById(elId);
  if (!el || typeof echarts === "undefined") return;
  if (el.offsetWidth === 0) return; /* 跳过隐藏元素 */
  const p = gameState.player;
  const indicator = [
    { name:"生命", max:100 }, { name:"饱食", max:100 }, { name:"水分", max:100 },
    { name:"精力", max:100 }, { name:"精神", max:100 }, { name:"辐射", max:100 }
  ];
  const data = [p.hp, p.hunger, p.thirst, 100 - p.fatigue, p.morale, 100 - p.radiation];
  /* 元素被 innerHTML 替换后需重新初始化 */
  if (radarCharts[elId]) {
    try { radarCharts[elId].dispose(); } catch(e) {}
    delete radarCharts[elId];
  }
  radarCharts[elId] = echarts.init(el);
  radarCharts[elId].setOption({
    radar: {
      indicator: indicator,
      shape: "polygon",
      radius: "62%",
      splitNumber: 4,
      axisName: { color: "#d3b17d", fontSize: 11, fontFamily: "Noto Serif SC" },
      splitLine: { lineStyle: { color: "rgba(212,175,125,0.25)" } },
      splitArea: { areaStyle: { color: ["rgba(255,76,0,0.03)","rgba(255,76,0,0.06)"] } },
      axisLine: { lineStyle: { color: "rgba(212,175,125,0.3)" } }
    },
    series: [{ type: "radar", data: [{ value: data, name: "状态" }],
      areaStyle: { color: "rgba(255,76,0,0.25)" },
      lineStyle: { color: "#ff4c00", width: 2 },
      itemStyle: { color: "#ffb61e" } }]
  });
};

/* ---------- Tab 切换 ---------- */
UI.updateTabButtons = function (tab) {
  const moreSubs = ["craft","shop","log"];
  document.querySelectorAll(".tab-btn").forEach(b => {
    const isMoreSub = moreSubs.indexOf(tab) >= 0;
    if (isMoreSub && b.dataset.tab === "more") b.classList.add("active");
    else b.classList.toggle("active", b.dataset.tab === tab);
  });
};
UI.switchTab = function (tab) {
  if (tab === "more") { UI.updateTabButtons(tab); UI.openMobileMore(); return; }
  gameState.ui.activeTab = tab;
  UI.updateTabButtons(tab);
  UI.renderTab();
  Save.markDirty();
};

UI.renderTab = function () {
  const tab = gameState.ui.activeTab || "shelter";
  UI.updateTabButtons(tab);
  const c = document.getElementById("tab-content");
  switch (tab) {
    case "status":   c.innerHTML = UI.renderStatus(); requestAnimationFrame(() => UI.renderRadar("radar-chart-status")); break;
    case "shelter":  c.innerHTML = UI.renderShelter(); break;
    case "scavenge": c.innerHTML = UI.renderScavenge(); break;
    case "inventory":c.innerHTML = UI.renderInventory(); break;
    case "craft":    c.innerHTML = UI.renderCraft(); break;
    case "shop":     c.innerHTML = UI.renderShop(); break;
    case "log":      c.innerHTML = UI.renderLog(); break;
    default:         gameState.ui.activeTab = "shelter"; c.innerHTML = UI.renderShelter(); break;
  }
};

/* ============ 状态面板（移动端 Tab） ============ */
UI.renderStatus = function () {
  const p = gameState.player;
  let html = '<div class="panel-title"><i class="fa-solid fa-user-shield"></i> 幸存者状态</div>';
  html += '<div class="status-summary">'
    + '<div class="ss-item"><i class="fa-solid fa-calendar-day"></i> 第 ' + p.day + ' 天</div>'
    + '<div class="ss-item"><i class="fa-solid fa-leaf"></i> ' + Game.SEASON_NAMES[p.season] + '·' + p.seasonDay + '</div>'
    + '<div class="ss-item"><i class="fa-solid fa-circle-dot"></i> ' + p.caps + ' 盖</div>'
    + '<div class="ss-item"><i class="fa-solid fa-crosshairs"></i> 击杀 ' + p.kills + '</div>'
    + '<div class="ss-item"><i class="fa-solid fa-magnifying-glass"></i> 搜刮 ' + p.scavenges + '</div>'
    + '<div class="ss-item"><i class="fa-solid fa-heart"></i> 善 ' + p.goodPoints + ' / 罪 ' + p.karmaPoints + '</div>'
    + '</div>';
  html += '<div class="stat-bars-status">' + UI.buildStatsHTML() + '</div>';
  html += '<div class="radar-wrap"><div id="radar-chart-status" class="radar-chart"></div></div>';
  return html;
};

/* ============ 移动端"更多"底部弹层 ============ */
UI.openMobileMore = function () {
  let body = '<div class="more-sheet">'
    + '<div class="more-sheet-handle"></div>'
    + '<div class="more-sheet-title">更多功能</div>'
    + '<button class="more-sheet-item" onclick="UI.switchTab(\'craft\');UI.closeModal()"><i class="fa-solid fa-hammer"></i> 制造工坊</button>'
    + '<button class="more-sheet-item" onclick="UI.switchTab(\'shop\');UI.closeModal()"><i class="fa-solid fa-store"></i> 末日商店</button>'
    + '<button class="more-sheet-item" onclick="UI.switchTab(\'log\');UI.closeModal()"><i class="fa-solid fa-scroll"></i> 末日纪事</button>'
    + '<div class="more-sheet-divider"></div>'
    + '<button class="more-sheet-item" onclick="Save.exportFile()"><i class="fa-solid fa-file-export"></i> 导出存档</button>'
    + '<button class="more-sheet-item" onclick="document.getElementById(\'import-file\').click();UI.closeModal()"><i class="fa-solid fa-file-import"></i> 导入存档</button>'
    + '<button class="more-sheet-item" onclick="UI.openModal(helpHTML())"><i class="fa-solid fa-circle-question"></i> 游戏说明</button>'
    + '<button class="more-sheet-item cancel" onclick="UI.closeModal()"><i class="fa-solid fa-xmark"></i> 关闭</button>'
    + '</div>';
  UI.openModal(body);
  document.getElementById("modal-overlay").classList.add("bottom-sheet");
  document.getElementById("modal-box").classList.add("bottom-sheet");
};

/* ============ 避难所面板 ============ */
UI.renderShelter = function () {
  let html = '<div class="panel-title"><i class="fa-solid fa-house-chimney"></i> 避难所</div>';
  html += '<p class="panel-hint">建造与升级设施以提升生存能力。白昼阶段可进行建造。</p>';
  html += '<div class="facility-grid">';
  for (const fid in GameData.facilities) {
    const f = GameData.facilities[fid];
    const lv = Game.facilityLevel(fid);
    const check = Game.canBuild(fid);
    const cost = lv === 0 ? f.buildCost : f.upgradeCosts[lv - 1];
    const maxed = lv >= f.maxLevel;
    const locked = f.requires && !Game.hasFacility(f.requires);
    html += '<div class="facility-card ' + (lv > 0 ? "built" : "") + '">'
      + '<div class="fc-head"><i class="' + f.icon + '"></i><div><div class="fc-name">' + f.name + (lv > 0 ? ' <span class="lv-badge">Lv.' + lv + '</span>' : "") + '</div>'
      + '<div class="fc-cat">' + ({crafting:"制造",living:"生活",survival:"生存",production:"生产",defense:"防御",utility:"辅助"})[f.category] + '</div></div>'
      + '<span class="fc-status ' + (lv > 0 ? "owned" : "unowned") + '"><i class="fa-solid ' + (lv > 0 ? "fa-circle-check" : "fa-circle-minus") + '"></i> ' + (lv > 0 ? "已拥有" : "未拥有") + '</span></div>'
      + '<div class="fc-desc">' + f.desc + '</div>'
      + (lv > 0 ? '<div class="fc-effect"><i class="fa-solid fa-check"></i> ' + (f.descLv[lv - 1] || "") + '</div>' : '')
      + (f.produce ? '<div class="fc-effect"><i class="fa-solid fa-arrow-trend-up"></i> 日产出：' + Object.keys(f.produce).map(k => GameData.items[k === "water" ? "clean_water" : k].name + "×" + f.produce[k]).join("、") + '</div>' : '')
      + (f.dailyUpkeep ? '<div class="fc-effect"><i class="fa-solid fa-arrow-trend-down"></i> 日耗：' + Object.keys(f.dailyUpkeep).map(k => GameData.items[k].name + "×" + f.dailyUpkeep[k]).join("、") + '</div>' : '')
      + (locked ? '<div class="fc-locked"><i class="fa-solid fa-lock"></i> 需先建造 ' + GameData.facilities[f.requires].name + '</div>' : '')
      + (maxed ? '<div class="fc-maxed"><i class="fa-solid fa-star"></i> 已达最高等级</div>' :
         (!locked ? '<div class="fc-cost">' + Object.keys(cost).map(k => '<span class="cost-chip ' + (Game.itemCount(k) >= cost[k] ? "ok" : "no") + '"><i class="' + GameData.items[k].icon + '"></i> ' + GameData.items[k].name + " ×" + cost[k] + '</span>').join("") + '</div>'
           + '<button class="btn-build" onclick="UI.build(\'' + fid + '\')" ' + (check.ok ? "" : "disabled") + '>' + (lv === 0 ? "建造" : "升级至 Lv." + (lv + 1)) + '</button>' : ''))
      + '</div>';
  }
  html += '</div>';
  return html;
};
UI.build = function (fid) { if (Game.buildFacility(fid)) { UI.renderShelter(); UI.renderStats(); UI.toast("建造完成", "good"); } };

/* ============ 探索面板 ============ */
UI.renderScavenge = function () {
  const p = gameState.player;
  let html = '<div class="panel-title"><i class="fa-solid fa-compass"></i> 外出探索</div>';
  if (p.phase !== "night") {
    html += '<div class="phase-notice"><i class="fa-solid fa-sun"></i> 当前为白昼，需先「入夜」方可外出搜刮。</div>';
  } else {
    html += '<p class="panel-hint">夜色掩护下前往各地点搜刮物资，但危险也随之而来。每夜仅能选择一项行动。</p>';
    // 夜间行动
    html += '<div class="night-actions">'
      + '<button class="btn-night" onclick="UI.doGuard()"><i class="fa-solid fa-shield"></i><span>持械守夜</span><small>降低袭击损失·疲劳+</small></button>'
      + '<button class="btn-night" onclick="UI.doSleep()"><i class="fa-solid fa-bed"></i><span>安心休息</span><small>恢复疲劳与生命</small></button>'
      + '</div>';
    html += '<div class="loc-grid">';
    for (const lid in GameData.locations) {
      const loc = GameData.locations[lid];
      const unlocked = p.day >= loc.unlockDay && (!loc.requires || Game.hasItem(loc.requires) || p.flags["unlocked_" + lid]);
      const dangerStars = "★".repeat(loc.danger) + "☆".repeat(5 - loc.danger);
      html += '<div class="loc-card ' + (unlocked ? "" : "locked") + '">'
        + '<div class="lc-head"><i class="' + loc.icon + '"></i><div class="lc-name">' + loc.name + '</div></div>'
        + (unlocked
            ? '<div class="lc-danger">危险度 ' + dangerStars + '</div><div class="lc-desc">' + loc.desc + '</div>'
              + '<button class="btn-scavenge" onclick="UI.doScavenge(\'' + lid + '\')"><i class="fa-solid fa-magnifying-glass"></i> 前往搜刮</button>'
            : '<div class="lc-locked"><i class="fa-solid fa-lock"></i> ' + (loc.requires ? "需要 " + GameData.items[loc.requires].name : "第 " + loc.unlockDay + " 天解锁") + '</div>')
        + '</div>';
    }
    html += '</div>';
  }
  return html;
};
UI.doScavenge = function (lid) { Game.scavenge(lid); UI.afterNightAction(); };
UI.doGuard = function () { Game.guardNight(); UI.afterNightAction(); };
UI.doSleep = function () { Game.sleepNight(); UI.afterNightAction(); };
UI.afterNightAction = function () {
  // 结算已在 finishNight→settleDay 完成
  UI.fullRender();
  UI.toast("天亮了，进入新的一天", "system");
};

/* ============ 背包面板 ============ */
UI.renderInventory = function () {
  let html = '<div class="panel-title"><i class="fa-solid fa-briefcase"></i> 背包物资</div>';
  const byCat = {};
  for (const id in gameState.inventory) {
    const it = GameData.items[id]; if (!it) continue;
    (byCat[it.category] = byCat[it.category] || []).push(id);
  }
  const inv = gameState.inventory;
  let total = 0;
  for (const id in inv) total += inv[id];
  html += '<p class="panel-hint">物资总计 ' + total + ' 件。点击物品可使用/装备/出售。</p>';
  for (const cat of GameData.shopOrder) {
    if (!byCat[cat]) continue;
    const cc = GameData.itemCategories[cat];
    html += '<div class="cat-group"><div class="cat-head" style="color:' + cc.color + '"><i class="' + cc.icon + '"></i> ' + cc.name + '</div><div class="item-grid">';
    for (const id of byCat[cat]) {
      const it = GameData.items[id];
      const cnt = inv[id];
      const equipped = gameState.equipped.weapon === id || gameState.equipped.armor === id;
      html += '<div class="item-card" onclick="UI.itemMenu(\'' + id + '\')">'
        + '<div class="ic-icon"><i class="' + it.icon + '"></i></div>'
        + '<div class="ic-name">' + it.name + (cnt > 1 ? ' <b>×' + cnt + '</b>' : "") + '</div>'
        + '<div class="ic-val">' + it.value + '盖</div>'
        + (equipped ? '<div class="ic-equipped">已装备</div>' : '')
        + '</div>';
    }
    html += '</div></div>';
  }
  if (total === 0) html += '<div class="empty-hint">背包空空如也，去搜刮些物资吧。</div>';
  return html;
};

/* 物品操作菜单（弹窗） */
UI.itemMenu = function (id) {
  const it = GameData.items[id];
  const sellPrice = Game.sellPrice(id);
  let body = '<div class="item-modal-head"><i class="' + it.icon + '"></i> ' + it.name + ' <span class="im-count">×' + Game.itemCount(id) + '</span></div>';
  body += '<div class="item-modal-desc">' + it.desc + '</div>';
  body += '<div class="item-modal-val">价值 ' + it.value + ' 盖 · 售价 ' + sellPrice + ' 盖</div>';
  body += '<div class="item-modal-actions">';
  if (it.category === "food" || it.category === "water") body += '<button class="btn-act" onclick="UI.useItem(\'' + id + '\')"><i class="fa-solid fa-utensils"></i> ' + (it.category === "water" ? "饮用" : "食用") + '</button>';
  if (it.usable) body += '<button class="btn-act" onclick="UI.useItem(\'' + id + '\')"><i class="fa-solid fa-hand-pointer"></i> 使用</button>';
  if (it.weapon) body += '<button class="btn-act" onclick="UI.equipItem(\'' + id + '\')"><i class="fa-solid fa-khanda"></i> 装备</button>';
  if (it.armor) body += '<button class="btn-act" onclick="UI.equipItem(\'' + id + '\')"><i class="fa-solid fa-shield-halved"></i> 穿戴</button>';
  body += '<button class="btn-act sell" onclick="UI.sellFromInv(\'' + id + '\')"><i class="fa-solid fa-coins"></i> 出售(' + sellPrice + '盖)</button>';
  body += '<button class="btn-act cancel" onclick="UI.closeModal()">关闭</button>';
  body += '</div>';
  UI.openModal(body);
};
UI.useItem = function (id) { Game.consume(id); UI.closeModal(); UI.renderStats(); UI.renderTab(); UI.toast("已使用", "system"); };
UI.equipItem = function (id) { Game.equip(id); UI.closeModal(); UI.renderStats(); UI.renderTab(); UI.toast("已装备", "system"); };

UI.unequip = function (slot) {
  const id = gameState.equipped[slot];
  if (!id) return;
  Game.addItem(id, 1); gameState.equipped[slot] = null;
  Game.log("卸下了 " + GameData.items[id].name + "。", "system");
  Save.markDirty();
  UI.renderStats(); UI.renderTab();
};
UI.sellFromInv = function (id) {
  const n = parseInt(document.getElementById("sell-qty") && document.getElementById("sell-qty").value) || 1;
  Game.sell(id, n); UI.closeModal(); UI.renderHeader(); UI.renderTab(); UI.toast("已出售", "good");
};

/* ============ 制造面板 ============ */
UI.renderCraft = function () {
  let html = '<div class="panel-title"><i class="fa-solid fa-hammer"></i> 制造工坊</div>';
  html += '<p class="panel-hint">需要对应设施方可制造。制造消耗材料与少量体力。</p>';
  const groups = { craft:"工具武器", cook:"烹饪", med:"药品", brew:"酿造" };
  for (const type in groups) {
    let items = "";
    for (const rid in GameData.recipes) {
      const r = GameData.recipes[rid];
      if (r.type !== type) continue;
      const check = Game.canCraft(rid);
      const out = Object.keys(r.output).map(k => GameData.items[k].name + "×" + r.output[k]).join("、");
      items += '<div class="recipe-card">'
        + '<div class="rc-out"><i class="fa-solid fa-arrow-right"></i> ' + out + '</div>'
        + '<div class="rc-facility"><i class="fa-solid fa-screwdriver-wrench"></i> ' + (r.facility ? GameData.facilities[r.facility].name + " Lv." + r.facilityLv : "无") + '</div>'
        + '<div class="rc-input">' + Object.keys(r.input).map(k => '<span class="cost-chip ' + (Game.itemCount(k) >= r.input[k] ? "ok" : "no") + '"><i class="' + GameData.items[k].icon + '"></i> ' + GameData.items[k].name + " ×" + r.input[k] + '</span>').join("") + '</div>'
        + '<button class="btn-craft" onclick="UI.craft(\'' + rid + '\')" ' + (check.ok ? "" : "disabled") + '><i class="fa-solid fa-hammer"></i> 制造</button>'
        + '</div>';
    }
    if (items) html += '<div class="craft-group"><div class="cat-head">' + groups[type] + '</div>' + items + '</div>';
  }
  return html;
};
UI.craft = function (rid) { if (Game.craft(rid)) { UI.renderStats(); UI.renderTab(); UI.toast("制造完成", "good"); } };

/* ============ 商店面板 ============ */
UI.renderShop = function () {
  let html = '<div class="panel-title"><i class="fa-solid fa-store"></i> 末日商店</div>';
  const trader = gameState.player.flags.trader_here;
  html += '<p class="panel-hint">用瓶盖买卖物资。' + (trader ? '<span class="trader-on">游商弗兰科在此，售价9折，并有稀有货品！</span>' : '每隔 ' + GameData.shopConfig.restockDays + ' 天补货。') + '</p>';
  // 买入
  html += '<div class="shop-section"><div class="shop-sec-title"><i class="fa-solid fa-cart-arrow-down"></i> 购买</div><div class="shop-grid">';
  const stock = gameState.shop.stock;
  const stockIds = Object.keys(stock).filter(id => GameData.items[id]).sort((a, b) => GameData.shopOrder.indexOf(GameData.items[a].category) - GameData.shopOrder.indexOf(GameData.items[b].category));
  for (const id of stockIds) {
    const it = GameData.items[id];
    const price = Game.buyPrice(id);
    const can = gameState.player.caps >= price;
    html += '<div class="shop-card">'
      + '<div class="sc-icon"><i class="' + it.icon + '"></i></div>'
      + '<div class="sc-name">' + it.name + '</div>'
      + '<div class="sc-stock">库存 ' + stock[id] + '</div>'
      + '<div class="sc-price">' + price + ' 盖</div>'
      + '<button class="btn-buy ' + (can ? "" : "disabled") + '" onclick="UI.buy(\'' + id + '\')" ' + (can ? "" : "disabled") + '>购买</button>'
      + '</div>';
  }
  if (!stockIds.length) html += '<div class="empty-hint">商店暂无货物，等待补货。</div>';
  html += '</div></div>';
  // 卖出
  html += '<div class="shop-section"><div class="shop-sec-title"><i class="fa-solid fa-hand-holding-dollar"></i> 出售你的物资</div><div class="shop-grid">';
  let hasSell = false;
  for (const id in gameState.inventory) {
    const it = GameData.items[id]; if (!it || it.value <= 0) continue;
    hasSell = true;
    const price = Game.sellPrice(id);
    html += '<div class="shop-card sell">'
      + '<div class="sc-icon"><i class="' + it.icon + '"></i></div>'
      + '<div class="sc-name">' + it.name + ' <b>×' + Game.itemCount(id) + '</b></div>'
      + '<div class="sc-price">' + price + ' 盖</div>'
      + '<button class="btn-sell" onclick="UI.sell(\'' + id + '\')">出售</button>'
      + '</div>';
  }
  if (!hasSell) html += '<div class="empty-hint">没有可出售的物资。</div>';
  html += '</div></div>';
  return html;
};
UI.buy = function (id) { if (Game.buy(id, 1)) { UI.renderHeader(); UI.renderTab(); UI.toast("购入成功", "good"); } };
UI.sell = function (id) { if (Game.sell(id, 1)) { UI.renderHeader(); UI.renderTab(); UI.toast("出售成功", "good"); } };

/* ============ 日志面板 ============ */
UI.renderLog = function () {
  let html = '<div class="panel-title"><i class="fa-solid fa-scroll"></i> 末日纪事</div>';
  html += '<div class="log-filter">';
  for (const c in Game.logCategories) {
    const cc = Game.logCategories[c];
    html += '<button class="log-filter-btn" data-cat="' + c + '" style="border-color:' + cc.color + ';color:' + cc.color + '" onclick="UI.filterLog(\'' + c + '\')">' + cc.name + '</button>';
  }
  html += '<button class="log-filter-btn all active" onclick="UI.filterLog(\'all\')">全部</button></div>';
  html += '<div class="log-list" id="log-list">';
  const logs = gameState.log.slice().reverse();
  logs.forEach(m => {
    const cc = Game.logCategories[m.category] || Game.logCategories.narration;
    html += '<div class="log-line cat-' + m.category + '"><span class="log-day">第' + m.day + '天</span><span class="log-text" style="border-left-color:' + cc.color + '">' + m.text + '</span></div>';
  });
  if (!logs.length) html += '<div class="empty-hint">尚无记录。</div>';
  html += '</div>';
  return html;
};
UI.filterLog = function (cat) {
  document.querySelectorAll(".log-filter-btn").forEach(b => b.classList.toggle("active", b.dataset.cat === cat || (cat === "all" && b.classList.contains("all"))));
  document.querySelectorAll("#log-list .log-line").forEach(l => {
    l.style.display = (cat === "all" || l.classList.contains("cat-" + cat)) ? "" : "none";
  });
};

/* ============ 底部行动条 ============ */
UI.renderActions = function () {
  const p = gameState.player;
  const box = document.getElementById("action-bar");
  if (!box) return;
  let html = "";
  if (p.flags.gameover) {
    html = '<button class="btn-main" onclick="UI.restart()"><i class="fa-solid fa-rotate-right"></i> <span class="btn-text">重新开始</span></button>';
  } else if (p.phase === "day") {
    html = '<button class="btn-main primary" onclick="UI.toNight()"><i class="fa-solid fa-moon"></i> <span class="btn-text">入夜</span></button>';
  } else if (p.phase === "night") {
    html = '<div class="action-hint"><i class="fa-solid fa-circle-info"></i> <span class="btn-text">请选择一项夜间行动（见探索页）</span></div>';
  }
  box.innerHTML = html;
};
UI.toNight = function () { Game.toNight(); UI.fullRender(); UI.switchTab("scavenge"); UI.toast("夜幕降临", "system"); };

/* ============ 待处理事件（弹窗） ============ */
UI.renderPendingEvent = function () {
  if (gameState.player.flags.gameover) return;
  if (!Game.pendingEvent) return;
  const e = GameData.events[Game.pendingEvent];
  if (!e) { Game.pendingEvent = null; return; }
  let body = '<div class="event-modal">'
    + '<div class="ev-title"><i class="fa-solid fa-triangle-exclamation"></i> ' + e.name + '</div>'
    + '<div class="ev-text">' + e.text + '</div>'
    + '<div class="ev-choices">';
  e.choices.forEach(ch => {
    const ok = Game.evalReq(ch.require);
    body += '<button class="ev-choice ' + (ok ? "" : "disabled") + '" ' + (ok ? 'onclick="UI.resolveEvent(\'' + ch.id + '\')"' : "disabled") + '>'
      + '<span class="evc-label">' + ch.label + '</span>'
      + (ch.require && !ok ? '<span class="evc-req">' + reqHint(ch.require) + '</span>' : "")
      + '</button>';
  });
  body += '</div></div>';
  UI.openModal(body, true);
};
function reqHint(req) {
  if (req.weapon) return "需要武器";
  if (req.facility) return "需要" + GameData.facilities[req.facility].name;
  if (req.item) return "需要" + GameData.items[req.item].name;
  return "条件不足";
}
UI.resolveEvent = function (choiceId) {
  const e = GameData.events[Game.pendingEvent];
  const ch = e.choices.find(c => c.id === choiceId);
  if (!ch) return;
  // 加权随机抽取结果
  const total = ch.outcomes.reduce((s, o) => s + o.chance, 0);
  let roll = Math.random() * total, picked = ch.outcomes[0];
  for (const o of ch.outcomes) { roll -= o.chance; if (roll <= 0) { picked = o; break; } }
  (picked.effects || []).forEach(eff => Game.applyEffect(eff));
  if (picked.log) Game.log(picked.log, picked.effects && picked.effects.some(x => x.type === "change_stat" && x.value < 0) ? "danger" : "narration");
  Game.clampStats();
  Game.pendingEvent = null;
  UI.closeModal();
  if (gameState.player.hp <= 0) { Game.gameOver("dead"); return; }
  UI.fullRender();
  UI.toast(picked.log ? "事件已处理" : "事件结束", "system");
};

/* ============ 弹窗 / Toast ============ */
UI.openModal = function (content, sticky) {
  const overlay = document.getElementById("modal-overlay");
  const box = document.getElementById("modal-box");
  overlay.classList.remove("bottom-sheet");
  box.classList.remove("bottom-sheet");
  box.innerHTML = content;
  overlay.classList.add("show");
  overlay.dataset.sticky = sticky ? "1" : "0";
};
UI.closeModal = function () {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("show");
  overlay.classList.remove("bottom-sheet");
  document.getElementById("modal-box").classList.remove("bottom-sheet");
  if (gameState && UI.updateTabButtons) UI.updateTabButtons(gameState.ui.activeTab);
};
UI.toast = function (msg, type) {
  type = type || "system";
  const wrap = document.getElementById("toast-wrap");
  const t = document.createElement("div");
  t.className = "toast toast-" + type;
  t.innerHTML = '<i class="fa-solid ' + ({good:"fa-check", danger:"fa-circle-exclamation", system:"fa-circle-info"})[type] + '"></i> ' + msg;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add("hide"); setTimeout(() => t.remove(), 400); }, 2200);
};

UI.showEnding = function (title, desc) {
  let body = '<div class="ending-modal">'
    + '<div class="ending-title">' + title + '</div>'
    + '<div class="ending-desc">' + desc + '</div>'
    + '<div class="ending-stats">生存 ' + gameState.player.day + ' 天 · 善行 ' + gameState.player.goodPoints + ' · 罪孽 ' + gameState.player.karmaPoints + ' · 击杀 ' + gameState.player.kills + ' · 搜刮 ' + gameState.player.scavenges + '</div>'
    + '<button class="btn-main primary" onclick="UI.restart()"><i class="fa-solid fa-rotate-right"></i> 重启废土</button>'
    + '</div>';
  UI.openModal(body, true);
  UI.renderActions();
};
UI.restart = function () {
  if (!confirm("确定要重新开始吗？当前存档将被清除。")) return;
  Save.deleteSave();
  UI.closeModal();
  UI.showStartScreen();
};

/* ============ 存档徽标 ============ */
UI.updateSaveBadge = function () {
  const el = document.getElementById("save-badge");
  if (!el) return;
  const time = new Date(gameState.meta.saveTime || Date.now());
  el.title = "上次保存：" + time.toLocaleString();
};
UI.flashSaveIndicator = function () {
  const el = document.getElementById("save-badge");
  if (!el) return;
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 600);
};
