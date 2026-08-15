/* =====================================================================
 * 废土余生录 · 主入口 main.js
 * 启动流程、开始/继续界面、顶部菜单按钮绑定
 * ===================================================================== */
window.Game = window.Game || {};
window.UI = window.UI || {};
Game.pendingEvent = null;

/* ---------- 启动 ---------- */
window.addEventListener("DOMContentLoaded", () => {
  Save.init();
  bindMenuButtons();
  showEntry();
  /* Admin快捷键 Ctrl+Shift+A */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) { e.preventDefault(); _adminEnter(); }
  });
  /* URL参数入口 ?admin=1 */
  if (new URLSearchParams(location.search).get("admin") === "1") _adminEnter();
});

function bindMenuButtons() {
  document.getElementById("btn-export").onclick = () => { if (gameState) Save.exportFile(); };
  document.getElementById("btn-import").onclick = () => document.getElementById("import-file").click();
  document.getElementById("import-file").onchange = (e) => { if (e.target.files[0]) Save.importFile(e.target.files[0]); e.target.value = ""; };
  document.getElementById("btn-menu").onclick = () => UI.openModal(menuHTML());
  document.getElementById("btn-help").onclick = () => UI.openModal(helpHTML());
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay" && e.currentTarget.dataset.sticky !== "1") UI.closeModal();
  });
  // Tab 按钮
  document.querySelectorAll(".tab-btn").forEach(b => b.onclick = () => UI.switchTab(b.dataset.tab));
  // 窗口尺寸变化重绘雷达
  window.addEventListener("resize", () => { for (const id in radarCharts) { try { radarCharts[id].resize(); } catch(e) {} } });
}

/* ---------- 入口（开始/继续） ---------- */
function showEntry() {
  const has = Save.hasSave();
  let body = '<div class="entry-screen">'
    + '<div class="entry-logo"><i class="fa-solid fa-radiation"></i></div>'
    + '<h1 class="entry-title">废土余生录</h1>'
    + '<p class="entry-sub">中式民间 · 末日生存 · 文字数值模拟</p>'
    + '<p class="entry-desc">大灾变之后，天地倾覆，红尘成灰。你于废墟中醒来，唯有残破的年画与锈蚀的钢筋作伴。在这片死寂的废土上，你能活过几日？</p>'
    + (has ? '<button class="btn-main primary big" onclick="continueGame()"><i class="fa-solid fa-play"></i> 继续求生</button>' : "")
    + '<button class="btn-main big" onclick="newGameScreen()"><i class="fa-solid fa-seedling"></i> 开启新档</button>'
    + '<button class="btn-main big ghost" onclick="UI.openModal(helpHTML())"><i class="fa-solid fa-circle-question"></i> 游戏说明</button>'
    + '</div>';
  UI.openModal(body, true);
}

function continueGame() {
  if (!Save.load()) { UI.toast("存档读取失败", "danger"); showEntry(); return; }
  UI.closeModal();
  UI.fullRender();
  UI.toast("欢迎回到废土，" + gameState.player.name, "good");
}

function newGameScreen() {
  let body = '<div class="entry-screen">'
    + '<h2 class="entry-title small">为幸存者命名</h2>'
    + '<p class="entry-desc">在这片废土上，你的名字是你最后的尊严。</p>'
    + '<input id="new-name" class="name-input" maxlength="12" placeholder="输入幸存者姓名" value="无名幸存者"/>'
    + '<button class="btn-main primary big" onclick="startNew()"><i class="fa-solid fa-flag"></i> 踏入废土</button>'
    + '<button class="btn-main ghost" onclick="UI.closeModal(); showEntry();"><i class="fa-solid fa-arrow-left"></i> 返回</button>'
    + '</div>';
  UI.openModal(body, true);
  setTimeout(() => { const inp = document.getElementById("new-name"); if (inp) { inp.focus(); inp.select(); } }, 100);
}

function startNew() {
  const name = (document.getElementById("new-name").value || "").trim() || "无名幸存者";
  Game.newGame(name);
  UI.closeModal();
  UI.fullRender();
  UI.toast("求生之旅开始！" + name, "good");
}

UI.showStartScreen = showEntry;

/* ---------- 菜单 / 帮助 ---------- */
function menuHTML() {
  return '<div class="menu-modal">'
    + '<div class="menu-title"><i class="fa-solid fa-bars"></i> 菜单</div>'
    + '<button class="menu-item" onclick="Save.exportFile()"><i class="fa-solid fa-file-export"></i> 导出存档</button>'
    + '<button class="menu-item" onclick="document.getElementById(\'import-file\').click()"><i class="fa-solid fa-file-import"></i> 导入存档</button>'
    + '<button class="menu-item" onclick="UI.restart()"><i class="fa-solid fa-rotate-right"></i> 重新开始</button>'
    + '<button class="menu-item" onclick="UI.openModal(helpHTML())"><i class="fa-solid fa-circle-question"></i> 游戏说明</button>'
    + '<button class="menu-item cancel" onclick="UI.closeModal()"><i class="fa-solid fa-xmark"></i> 关闭</button>'
    + '</div>';
}

/* —— 隐藏的Admin入口：三种方式 —— */
/* 1. 双击"求生指南"文字  2. 快捷键 Ctrl+Shift+A  3. URL参数 ?admin=1 */
function _adminEnter() { window.location.href = "admin.html"; }

function helpHTML() {
  return '<div class="help-modal">'
    + '<div class="help-title"><i class="fa-solid fa-book"></i> <span style="cursor:default;user-select:none" ondblclick="_adminEnter()">求生指南</span></div>'

    + '<div class="help-section"><b>核心目标</b><p>在末日废土中尽可能长久地生存，直至第 ' + Game.CEASEFIRE_DAY + ' 天停火日来临。你的善行与罪孽将决定结局走向：幸存者、黯淡或业报。</p></div>'

    + '<div class="help-section"><b>六大属性</b><p>'
    + '<i class="fa-solid fa-heart" style="color:#8B1A1A"></i> 生命：归零即死亡。<br/>'
    + '<i class="fa-solid fa-utensils" style="color:#b9770e"></i> 饱食：每日下降，过低持续扣血。<br/>'
    + '<i class="fa-solid fa-droplet" style="color:#2980b9"></i> 水分：每日下降，过低持续扣血，夏季消耗更快。<br/>'
    + '<i class="fa-solid fa-bed" style="color:#7f8c8d"></i> 疲劳：搜刮、守夜、制造均会增加，过高扣血，休息可恢复。<br/>'
    + '<i class="fa-solid fa-face-smile" style="color:#f1c40f"></i> 精神：受事件影响，过低扣血，书籍、音乐、行善可提升。<br/>'
    + '<i class="fa-solid fa-radiation" style="color:#39FF14"></i> 辐射：辐射雨、污染区会增加，过高引发辐射病。</p></div>'

    + '<div class="help-section"><b>昼夜循环</b><p>'
    + '<b>白昼</b>：可建造设施、制造物品、烹饪食物、交易买卖。<br/>'
    + '<b>夜晚</b>：选择外出搜刮、持械守夜或安心休息。每夜结束自动结算进入新一天。<br/>'
    + '结算时：饱食水分下降、状态效果结算、设施产出与维护、食物腐烂、随机事件触发。</p></div>'

    + '<div class="help-section"><b>避难所建设</b><p>'
    + '<b>工作台</b>：制造之基，解锁工具武器配方。<br/>'
    + '<b>床铺</b>：休息时疲劳恢复量大幅提升。<br/>'
    + '<b>火炉</b>：御寒保暖，冬季必备，消耗木柴。<br/>'
    + '<b>炉灶</b>：烹饪生食、煮沸脏水，提升食物效用。<br/>'
    + '<b>雨水收集器</b>：每日自动产出净水。<br/>'
    + '<b>菜园</b>：每日产出蔬菜，需消耗水。<br/>'
    + '<b>医务室</b>：制药疗伤，自动缓解疾病。<br/>'
    + '<b>蒸馏器</b>：酿造纯酒精，硬通货之一。<br/>'
    + '<b>瞭望塔</b>：预警袭击，降低夜间损失。<br/>'
    + '<b>强化门</b>：抵御劫匪，大幅减少被抢。<br/>'
    + '<b>收音机</b>：收听废土广播，获取情报。<br/>'
    + '<b>发电机</b>：为设施供能，提升所有产出+15%/30%。<br/>'
    + '<b>熏制房</b>：将生肉熏成腊肉、蔬菜腌成腌菜，延长保质期。<br/>'
    + '<b>鱼塘</b>：每日产出鲜鱼，可升级为生态鱼塘。<br/>'
    + '<b>陷阱</b>：自动捕获小动物产出生肉，Lv2偶尔获野果。<br/>'
    + '<b>水井</b>：产出地下水（需煮沸），稳定水源。<br/>'
    + '<b>军械台</b>：制造弹药、火药、武器与爆炸物。</p></div>'

    + '<div class="help-section"><b>搜刮探索</b><p>'
    + '夜间前往各地点搜刮物资，共18个地点等你探索。<br/>'
    + '地点越危险回报越丰，但遭遇劫匪与军队的概率也更高。<br/>'
    + '<b>装备加成</b>：手电筒(+20%搜刮)、地图(+15%)、指南针(+10%)、望远镜(+15%)。<br/>'
    + '<b>特殊地点</b>：庙宇出草药线香、学校出书籍种子、工厂出钢材零件、发电站出电子元件、下水道有金条、图书馆出地图。</p></div>'

    + '<div class="help-section"><b>战斗系统</b><p>'
    + '遭遇敌人时自动进入战斗。攻击力=武器伤害+防具防御×0.6+精神加成。<br/>'
    + '<b>武器类型</b>：近战（刀/斧/矛/棍）、远程（枪械需弹药、弩需弩箭）。<br/>'
    + '<b>特殊道具</b>：手榴弹有30%几率自动投掷，+60伤害。<br/>'
    + '<b>同伴加成</b>：收留同伴+12战力、收养流浪犬+5战力、加入联盟+8战力。<br/>'
    + '战败可能受伤、流血、丢失物资。战胜有几率获得战利品。</p></div>'

    + '<div class="help-section"><b>制造工坊</b><p>'
    + '需要对应设施方可制造，消耗材料与少量体力。<br/>'
    + '<b>工具武器</b>：撬棍、短刀、手斧、弓、长矛、弩、盾牌、皮甲、砍刀等。<br/>'
    + '<b>烹饪</b>：熟肉、面包、烤鱼、炒蘑菇、煮面、煮沸水等。<br/>'
    + '<b>熏制</b>：腊肉、腌菜（保质期长）。<br/>'
    + '<b>药品</b>：草药药、绷带、草药敷料、抗生素、疫苗、解毒剂、维生素。<br/>'
    + '<b>酿造</b>：纯酒精。<br/>'
    + '<b>军械</b>：火药、弹药、砍刀、防暴头盔、手榴弹。</p></div>'

    + '<div class="help-section"><b>末日商店</b><p>'
    + '用瓶盖买卖物资。出售搜刮所得换取急需药品武器。<br/>'
    + '每隔3天自动补货，随机刷新6种商品。商品池已扩充至160+种物资。<br/>'
    + '<b>常驻库存</b>：罐头、净水、绷带、零件、木材、弹药、大米、饼干等基础物资。<br/>'
    + '<b>随机商品</b>：从食物、饮水、药品、材料、燃料、珍品中随机刷新。<br/>'
    + '<b>游商上门</b>：售价9折，并追加稀有货品（武士刀、狙击步枪、凯夫拉护甲、钻石等）。<br/>'
    + '<b>商队经过</b>：类似游商，可选择偷窃（高风险高回报）。</p></div>'

    + '<div class="help-section"><b>保底物资</b><p>'
    + '每日结算时自动获得2-3件基础生存物资，代表废土拾荒所得。<br/>'
    + '物资池包括：野果、脏水、废铁、零件、罐头、净水、绷带、木柴等。<br/>'
    + '<b>紧急保底</b>：当饱食或水分低于15时，额外获得一份紧急物资，避免断粮致死。</p></div>'

    + '<div class="help-section"><b>状态与疾病</b><p>'
    + '出血：每日-8HP，绷带/草药敷料可治。<br/>'
    + '外伤：每日-4HP，绷带/夹板可治。<br/>'
    + '生病：每日-6HP+8疲劳，草药药/抗生素可治。<br/>'
    + '感染：每日-10HP，抗生素/急救包可治。<br/>'
    + '食物中毒：每日-5HP-10水分，解毒剂/抗生素可治。<br/>'
    + '辐射病：辐射≥80触发，每日-5HP。<br/>'
    + '<b>疫苗</b>：注射后免疫疾病传染。<br/>'
    + '<b>医务室</b>：自动缓解生病状态。</p></div>'

    + '<div class="help-section"><b>随机事件</b><p>'
    + '每日可能触发一个随机事件，包括：<br/>'
    + '<b>灾难</b>：夜袭、地震、鼠群侵袭、瘟疫蔓延。<br/>'
    + '<b>天气</b>：寒潮、暴风雪、热浪、辐射雨、沙尘暴。<br/>'
    + '<b>遭遇</b>：邻居求助、乞丐、流浪犬、幸存者团体、旧友重逢。<br/>'
    + '<b>机遇</b>：意外馈赠、旧书启迪、游商上门、空投物资、神秘储藏、商队经过。<br/>'
    + '<b>身心</b>：食物中毒、意外受伤、精神崩溃。<br/>'
    + '每个选择都会影响你的善行/罪孽值，进而决定结局。</p></div>'

    + '<div class="help-section"><b>道德与结局</b><p>'
    + '善行点数：帮助他人、行善积德。<br/>'
    + '罪孽点数：冷血无情、杀人偷窃。<br/>'
    + '第' + Game.CEASEFIRE_DAY + '天停火日判定结局：<br/>'
    + '<b>幸存者结局</b>：善行≥3且罪孽≤1，坚守人性。<br/>'
    + '<b>黯淡结局</b>：善恶不明，只剩空壳。<br/>'
    + '<b>业报结局</b>：罪孽≥3，善恶终有报。</p></div>'

    + '<div class="help-section"><b>自动存档</b><p>'
    + '所有操作实时自动保存到浏览器本地，无需手动操作。<br/>'
    + '可随时导出为JSON文件备份，或导入存档继续。数据仅存于本机。<br/>'
    + '更换浏览器或清除缓存会导致存档丢失，请定期导出备份。</p></div>'

    + '<div class="help-section"><b>物品分类</b><p>'
    + '食物/饮水：恢复饱食水分，部分会腐烂变质。<br/>'
    + '药品：治疗伤病，部分可日常使用提升状态。<br/>'
    + '材料：建造与制造的原材料。<br/>'
    + '武器：装备后提升战斗力，部分需弹药。<br/>'
    + '防具：装备后减免伤害，部分有特殊保护。<br/>'
    + '燃料：火炉、发电机等设施的消耗品。<br/>'
    + '珍品：奢侈品与特殊道具，价值高或有特殊效果。</p></div>'

    + '<button class="btn-main primary" onclick="UI.closeModal()"><i class="fa-solid fa-check"></i> 我明白了</button>'
    + '</div>';
}
