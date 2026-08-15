/* =====================================================================
 * 废土余生录 · 存档系统 save.js
 * 多层持久化：localStorage 主存 + IndexedDB 持久备份 + 备份键容错
 * 健康检查告警 / 请求持久化存储 / 异步恢复 / 移动端友好存档时机
 * file:// 与移动端浏览器均可使用
 * ===================================================================== */
window.Save = window.Save || {};

const _SAVE = {
  dirty: false,
  timer: null,
  DEBOUNCE: 1200,       // 状态变更后 1.2s 静默再存（移动端更快落盘）
  MAX_INTERVAL: 8000,   // 最长 8s 强制存一次
  storageOK: true,      // localStorage 是否可用
  dbReady: false,       // IndexedDB 是否就绪
  persisted: false,     // 是否已获得持久化存储授权
  warned: false,        // 是否已提示过存储不可用
  lastFlush: 0
};

/* ---------- 同步存储层（localStorage） ---------- */
const Store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  remove(k) { try { localStorage.removeItem(k); } catch (e) { return false; } },
  /* 健康检查：写入后能否读回 */
  health() {
    try {
      const k = "__wasteland_test__";
      localStorage.setItem(k, "1");
      const v = localStorage.getItem(k);
      localStorage.removeItem(k);
      return v === "1";
    } catch (e) { return false; }
  }
};

/* ---------- 异步存储层（IndexedDB）·持久备份 ----------
 * 在 localStorage 被系统回收或被内置浏览器清空时，
 * IndexedDB 通常仍能保留数据，作为兜底恢复源。
 */
const StoreDB = {
  _db: null,
  _pending: [],
  DB_NAME: "wasteland_chronicles",
  STORE: "saves",
  KEY: "main",
  init() {
    if (this._db) { this._flushPending(); return; }
    if (!("indexedDB" in window)) { this._flushPending(); return; }
    try {
      const req = indexedDB.open(this.DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.STORE)) db.createObjectStore(this.STORE);
      };
      req.onsuccess = (e) => { this._db = e.target.result; _SAVE.dbReady = true; this._flushPending(); };
      req.onerror = () => { this._flushPending(); };
    } catch (e) { this._flushPending(); }
  },
  _flushPending() {
    const p = this._pending.splice(0);
    p.forEach(fn => { try { fn(); } catch (e) {} });
  },
  _store(mode) { return this._db.transaction(this.STORE, mode).objectStore(this.STORE); },
  /* 同步发起写入（fire-and-forget），可在同步上下文调用 */
  set(val) {
    if (!this._db) { this._pending.push(() => this.set(val)); return; }
    try { this._store("readwrite").put(val, this.KEY); } catch (e) {}
  },
  clear() {
    if (!this._db) { this._pending.push(() => this.clear()); return; }
    try { this._store("readwrite").delete(this.KEY); } catch (e) {}
  },
  /* 异步读取 */
  get() {
    return new Promise((resolve) => {
      if (!this._db) { resolve(null); return; }
      try {
        const req = this._store("readonly").get(this.KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }
};

/* ---------- 序列化 / 反序列化 ---------- */
Save.serialize = function () {
  const snap = {
    version: SAVE_VERSION,
    meta: Object.assign({}, gameState.meta, { saveTime: Date.now() }),
    player: deepClone(gameState.player),
    inventory: deepClone(gameState.inventory),
    shelter: deepClone(gameState.shelter),
    equipped: deepClone(gameState.equipped),
    shop: deepClone(gameState.shop),
    decay: deepClone(gameState.decay || {}),
    log: gameState.log.slice(-80),
    ui: deepClone(gameState.ui)
  };
  return JSON.stringify(snap);
};

Save.deserialize = function (json) {
  let save;
  try { save = JSON.parse(json); }
  catch (e) { return null; }
  if (!save || typeof save !== "object" || !save.version) return null;
  save = Save.migrate(save);
  if (!save) return null;
  return save;
};

function deepClone(o) {
  if (typeof structuredClone === "function") return structuredClone(o);
  return JSON.parse(JSON.stringify(o));
}
Save.deepClone = deepClone;

/* ---------- 版本迁移 ---------- */
Save.migrate = function (save) {
  const M = {
    "1->2": (s) => { if (!s.shop) s.shop = { stock:{}, lastRestockDay:0, randomItems:[] }; return s; },
    "2->3": (s) => { if (s.player && s.player.seasonDay === undefined) s.player.seasonDay = 1; return s; }
  };
  try {
    while (save.version < SAVE_VERSION) {
      const fn = M[save.version + "->" + (save.version + 1)];
      if (!fn) { console.error("无法迁移存档 v" + save.version); return null; }
      save = fn(save);
      save.version++;
    }
    return save;
  } catch (e) { console.error("迁移失败", e); return null; }
};

/* ---------- 自动存档（脏标记 + 防抖） ---------- */
Save.markDirty = function () {
  if (!gameState) return;
  _SAVE.dirty = true;
  clearTimeout(_SAVE.timer);
  _SAVE.timer = setTimeout(Save.flush, _SAVE.DEBOUNCE);
};

/* ---------- 写入（多层落盘） ---------- */
Save.flush = function () {
  if (!gameState || !_SAVE.dirty) return;
  let data = Save.serialize();
  // 1. localStorage 主写
  let ok = Store.set(SAVE_KEY, data);
  if (!ok) {
    // 容量不足：截断日志后重试一次
    if (gameState.log.length > 30) { gameState.log = gameState.log.slice(-30); data = Save.serialize(); }
    ok = Store.set(SAVE_KEY, data);
  }
  // 2. localStorage 备份键（主键损坏/被删时兜底）
  if (ok) Store.set(SAVE_KEY + "_bk", data);
  // 3. IndexedDB 持久备份（移动端关键兜底）
  StoreDB.set(data);

  if (ok) {
    _SAVE.dirty = false;
    _SAVE.lastFlush = Date.now();
    if (window.UI && UI.flashSaveIndicator) UI.flashSaveIndicator();
  } else {
    // localStorage 不可用（如 iOS 无痕模式）：仍尝试了 IndexedDB
    _SAVE.storageOK = false;
    _SAVE.dirty = false; // 避免定时器反复尝试失败写入
    Save.warnStorage();
  }
};

Save.init = function () {
  // 健康检查
  _SAVE.storageOK = Store.health();
  // IndexedDB 备份初始化
  StoreDB.init();
  // 请求持久化存储授权（移动端防止系统回收存储）
  Save._requestPersist();
  // 页面隐藏/关闭时强制存档（移动端 visibilitychange 最可靠）
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") Save.flush(); });
  window.addEventListener("beforeunload", Save.flush);
  window.addEventListener("pagehide", Save.flush);
  // bfcache 恢复：从浏览器缓存切回时补存一次
  window.addEventListener("pageshow", (e) => { if (e.persisted) Save.flush(); });
  // 页面生命周期被冻结前（移动后台）强制存档
  if ("onfreeze" in window) window.addEventListener("freeze", Save.flush);
  setInterval(() => { if (_SAVE.dirty) Save.flush(); }, _SAVE.MAX_INTERVAL);
  // 异步恢复：localStorage 为空时从 IndexedDB / 备份键拉取
  Save._restoreFromBackup();
  if (!_SAVE.storageOK) Save.warnStorage();
};

/* 请求持久化存储，降低移动端被系统回收的概率 */
Save._requestPersist = function () {
  try {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(p => { _SAVE.persisted = !!p; }).catch(() => {});
    }
  } catch (e) {}
};

/* ---------- 异步恢复备份 ----------
 * 当 localStorage 主存丢失（移动端常见）但 IndexedDB 仍有备份时，
 * 回填 localStorage 并刷新入口界面，使“继续求生”按钮出现。
 */
Save._restoreFromBackup = async function () {
  try {
    if (Store.get(SAVE_KEY)) return; // 主存仍在，无需恢复
    let raw = await StoreDB.get();
    if (!raw) raw = Store.get(SAVE_KEY + "_bk"); // 再试 localStorage 备份键
    if (!raw) return;
    const save = Save.deserialize(raw);
    if (!save || !save.version) return;
    Store.set(SAVE_KEY, raw); // 回填主存
    // 若仍在入口界面（未开始游戏），刷新以显示“继续求生”
    if (!gameState && window.UI && UI.showStartScreen) {
      UI.showStartScreen();
      if (window.UI && UI.toast) UI.toast("已从备份恢复存档", "good");
    }
  } catch (e) { console.error("恢复备份失败", e); }
};

/* ---------- 加载存档 ---------- */
Save.load = function () {
  try {
    let raw = localStorage.getItem(SAVE_KEY);
    if (!raw) raw = localStorage.getItem(SAVE_KEY + "_bk"); // 主键缺失则用备份键
    if (!raw) return null;
    const save = Save.deserialize(raw);
    if (!save) return null;
    gameState = save;
    Game.state = gameState;
    // 兼容缺失字段
    if (!gameState.shop) gameState.shop = { stock:{}, lastRestockDay:0, randomItems:[] };
    if (!gameState.ui) gameState.ui = { activeTab: "shelter" };
    if (!gameState.player.flags) gameState.player.flags = {};
    if (!gameState.player.conditions) gameState.player.conditions = {};
    if (!gameState.decay) gameState.decay = {};
    // 清理商店库存中无效的物品ID（可能由旧版admin手动添加了不存在的ID）
    if (gameState.shop.stock && window.GameData && GameData.items) {
      for (const id in gameState.shop.stock) {
        if (!GameData.items[id]) delete gameState.shop.stock[id];
      }
    }
    return gameState;
  } catch (e) { console.error("读档失败", e); return null; }
};

Save.hasSave = function () {
  try {
    if (localStorage.getItem(SAVE_KEY)) return true;
    if (localStorage.getItem(SAVE_KEY + "_bk")) return true;
    return false;
  } catch (e) { return false; }
};

Save.deleteSave = function () {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  try { localStorage.removeItem(SAVE_KEY + "_bk"); } catch (e) {}
  StoreDB.clear();
};

/* ---------- 导出 / 导入 ---------- */
Save.exportFile = function () {
  Save.flush();
  const data = Save.serialize();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = "废土余生录_存档_" + stamp + "_第" + gameState.player.day + "天.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  Game.log("存档已导出至本地文件。", "system");
};

Save.importFile = function (file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const save = Save.deserialize(e.target.result);
      if (!save) throw new Error("存档格式无效或版本不兼容");
      // 备份当前存档
      try {
        const cur = localStorage.getItem(SAVE_KEY);
        if (cur) localStorage.setItem(SAVE_KEY + "_backup", cur);
      } catch(e){}
      gameState = save;
      Game.state = gameState;
      if (!gameState.shop) gameState.shop = { stock:{}, lastRestockDay:0, randomItems:[] };
      if (!gameState.ui) gameState.ui = { activeTab: "shelter" };
      Save.markDirty();
      Game.log("存档导入成功，欢迎回到废土。", "system");
      if (window.UI && UI.fullRender) UI.fullRender();
      if (window.UI && UI.toast) UI.toast("存档导入成功", "good");
    } catch (err) {
      alert("导入失败：" + err.message);
    }
  };
  reader.readAsText(file);
};

/* ---------- 存储不可用告警 ----------
 * 检测到 localStorage 写入失败（如 iOS 无痕模式、部分内置浏览器）时，
 * 提示用户导出备份或切换至普通浏览器模式。
 */
Save.warnStorage = function () {
  if (_SAVE.warned) return;
  _SAVE.warned = true;
  console.warn("存储不可用：当前环境（可能为无痕模式或受限内置浏览器）无法持久保存进度。");
  const msg = "当前浏览器无法自动保存进度，重载后将丢失存档。请通过菜单“导出存档”备份，或使用非无痕模式 / 系统浏览器打开。";
  if (window.UI && UI.toast) {
    UI.toast(msg, "danger");
    // 持续提示：4 秒后再提醒一次，确保用户注意到
    setTimeout(() => { if (window.UI && UI.toast) UI.toast("存档无法保存，请尽快导出备份", "danger"); }, 4000);
  }
};
