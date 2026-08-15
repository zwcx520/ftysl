/* =====================================================================
 * 废土余生录 · 额外物品扩展包 items_extra.js
 * 在已有 GameData.items 基础上追加 100 个不重复的新物品
 * 分类：食物(15) 饮水(5) 药品(15) 材料(20) 武器(10) 防具(8) 燃料(7) 珍品(20)
 * 所有物品 ID 均不与原版 items.js 重复
 * 字段格式与 items.js 完全一致
 * ===================================================================== */
window.GameData = window.GameData || {};
GameData.items = GameData.items || {};

/* ===================== 食物 (15) ===================== */
GameData.items.rice =          { id:"rice",           name:"大米",       icon:"fa-solid fa-bowl-rice",     category:"food", desc:"袋装大米，需炉灶煮熟，耐储存。",             value:6,  stack:true, max:20, nutrition:0,  decay:null };
GameData.items.canned_beans =  { id:"canned_beans",   name:"罐装豆子",   icon:"fa-solid fa-jar",           category:"food", desc:"铁罐密封的茄汁黄豆，开罐即食。",             value:5,  stack:true, max:15, nutrition:14, decay:null };
GameData.items.crackers =      { id:"crackers",       name:"压缩饼干",   icon:"fa-solid fa-cookie",        category:"food", desc:"真空包装的压缩饼干，体积小热量高。",         value:5,  stack:true, max:30, nutrition:12, decay:null };
GameData.items.pemmican =      { id:"pemmican",       name:"干肉饼",     icon:"fa-solid fa-bacon",         category:"food", desc:"传统风干肉脂混合饼，极度耐腐。",             value:10, stack:true, max:15, nutrition:20, decay:null };
GameData.items.canned_fruit =  { id:"canned_fruit",   name:"罐装水果",   icon:"fa-solid fa-apple-whole",   category:"food", desc:"糖水水果罐头，补充糖分和维生素。",           value:5,  stack:true, max:15, nutrition:10, decay:null };
GameData.items.cheese =        { id:"cheese",         name:"奶酪",       icon:"fa-solid fa-cheese",        category:"food", desc:"硬质奶酪，常温下可存放较久。",               value:7,  stack:true, max:10, nutrition:14, decay:60 };
GameData.items.chocolate =     { id:"chocolate",      name:"巧克力条",   icon:"fa-solid fa-square",        category:"food", desc:"高热量巧克力棒，快速补充体力。",             value:6,  stack:true, max:20, nutrition:16, decay:90 };
GameData.items.beef_jerky =    { id:"beef_jerky",     name:"牛肉干",     icon:"fa-solid fa-drumstick-bite",category:"food", desc:"风干腌制牛肉条，便携耐存。",                 value:8,  stack:true, max:15, nutrition:18, decay:null };
GameData.items.powdered_milk = { id:"powdered_milk",  name:"奶粉",       icon:"fa-solid fa-mug-hot",       category:"food", desc:"脱水奶粉，加水冲泡即可饮用。",               value:5,  stack:true, max:20, nutrition:10, decay:null };
GameData.items.canned_soup =   { id:"canned_soup",    name:"罐装浓汤",   icon:"fa-solid fa-mug-saucer",    category:"food", desc:"密封罐装浓缩汤，加热后风味更佳。",           value:5,  stack:true, max:15, nutrition:14, decay:null };
GameData.items.energy_bar =    { id:"energy_bar",     name:"能量棒",     icon:"fa-solid fa-bolt",          category:"food", desc:"营养强化能量棒，运动员和士兵的必备品。",     value:7,  stack:true, max:20, nutrition:16, decay:120 };
GameData.items.canned_tuna =   { id:"canned_tuna",    name:"罐装金枪鱼", icon:"fa-solid fa-fish",          category:"food", desc:"油浸金枪鱼罐头，高蛋白食物。",               value:6,  stack:true, max:15, nutrition:16, decay:null };
GameData.items.flour =         { id:"flour",          name:"面粉",       icon:"fa-solid fa-wheat-awn",     category:"food", desc:"袋装面粉，可烤制面包或煮面糊。",             value:5,  stack:true, max:20, nutrition:0,  decay:null };
GameData.items.cooking_oil =   { id:"cooking_oil",    name:"食用油",     icon:"fa-solid fa-bottle-droplet",category:"food", desc:"塑料瓶装植物油，烹饪和煎炸用。",             value:5,  stack:true, max:15, nutrition:6,  decay:180 };
GameData.items.canned_stew =   { id:"canned_stew",    name:"罐装炖肉",   icon:"fa-solid fa-utensils",      category:"food", desc:"大块肉和蔬菜的罐装炖菜，丰盛一餐。",         value:9,  stack:true, max:12, nutrition:22, decay:null };

/* ===================== 饮水 (5) ===================== */
GameData.items.mineral_water = { id:"mineral_water",  name:"矿泉水",     icon:"fa-solid fa-bottle-water",  category:"water", desc:"未开封的瓶装矿泉水，洁净安全。",             value:3,  stack:true, max:15, nutrition:24 };
GameData.items.soda =          { id:"soda",           name:"汽水",       icon:"fa-solid fa-glass-water",   category:"water", desc:"含糖碳酸饮料，解渴同时补充糖分。",           value:4,  stack:true, max:10, nutrition:18 };
GameData.items.herbal_tea =    { id:"herbal_tea",     name:"草本茶",     icon:"fa-solid fa-mug-hot",       category:"water", desc:"野生草药泡制的茶饮，安神解渴。",             value:5,  stack:true, max:10, nutrition:22 };
GameData.items.coconut_milk =  { id:"coconut_milk",   name:"椰奶",       icon:"fa-solid fa-droplet",       category:"water", desc:"椰子中的天然乳汁，富含电解质。",             value:4,  stack:true, max:10, nutrition:20 };
GameData.items.boiled_water =  { id:"boiled_water",   name:"开水",       icon:"fa-solid fa-mug-saucer",    category:"water", desc:"煮沸冷却后的安全饮用水。",                   value:2,  stack:true, max:20, nutrition:22 };

/* ===================== 药品 (15) ===================== */
GameData.items.gauze =              { id:"gauze",              name:"医用纱布",   icon:"fa-solid fa-bandage",            category:"medicine", desc:"消毒纱布卷，处理外伤防止感染。",            value:10, stack:true,  max:10, usable:true, effects:[{type:"treat",conditions:["bleeding","wounded"],hp:5}] };
GameData.items.antiseptic_wipe =    { id:"antiseptic_wipe",    name:"消毒湿巾",   icon:"fa-solid fa-pump-sanitizer",     category:"medicine", desc:"酒精消毒湿巾，清洁伤口和物品表面。",        value:10, stack:true,  max:20, usable:true, effects:[{type:"treat",conditions:["wounded"],hp:3},{type:"remove_condition",condition:"infection"}] };
GameData.items.antibiotics =        { id:"antibiotics",        name:"抗生素胶囊", icon:"fa-solid fa-pills",              category:"medicine", desc:"广谱抗生素，治疗细菌感染和炎症。",          value:20, stack:true,  max:8,  usable:true, effects:[{type:"treat",conditions:["sick","infection"],hp:10}] };
GameData.items.morphine =           { id:"morphine",           name:"吗啡针剂",   icon:"fa-solid fa-syringe",            category:"medicine", desc:"强效镇痛剂，缓解剧痛和休克。",              value:35, stack:true,  max:5,  usable:true, effects:[{type:"change_stat",stat:"fatigue",value:-30},{type:"change_stat",stat:"hp",value:5}] };
GameData.items.adrenaline =         { id:"adrenaline",         name:"肾上腺素",   icon:"fa-solid fa-bolt",               category:"medicine", desc:"应急注射剂，短时间内大幅提升体能。",        value:30, stack:true,  max:5,  usable:true, effects:[{type:"change_stat",stat:"fatigue",value:-50},{type:"change_stat",stat:"hp",value:-5}] };
GameData.items.iodine_pills =       { id:"iodine_pills",       name:"碘片",       icon:"fa-solid fa-tablets",            category:"medicine", desc:"碘化钾药片，预防放射性碘吸收。",            value:18, stack:true,  max:10, usable:true, effects:[{type:"change_stat",stat:"radiation",value:-25}] };
GameData.items.band_aid =           { id:"band_aid",           name:"创可贴",     icon:"fa-solid fa-bandage",            category:"medicine", desc:"小型粘性绷带，处理轻微擦伤。",              value:10, stack:true,  max:30, usable:true, effects:[{type:"treat",conditions:["bleeding"],hp:2}] };
GameData.items.tourniquet =         { id:"tourniquet",         name:"止血带",     icon:"fa-solid fa-link",               category:"medicine", desc:"紧急止血绑带，阻止四肢大出血。",            value:12, stack:true,  max:5,  usable:true, effects:[{type:"treat",conditions:["bleeding"],hp:0}] };
GameData.items.surgical_kit =       { id:"surgical_kit",       name:"野外手术包", icon:"fa-solid fa-kit-medical",        category:"medicine", desc:"含手术刀和缝合线的完整手术套装。",          value:45, stack:false,         usable:true, effects:[{type:"treat",conditions:["bleeding","wounded","infection"],hp:25}] };
GameData.items.cough_syrup =        { id:"cough_syrup",        name:"止咳糖浆",   icon:"fa-solid fa-prescription-bottle",category:"medicine", desc:"镇咳祛痰糖浆，缓解呼吸道不适。",            value:10, stack:true,  max:8,  usable:true, effects:[{type:"treat",conditions:["sick"],hp:3}] };
GameData.items.burn_ointment =      { id:"burn_ointment",      name:"烫伤膏",     icon:"fa-solid fa-fire-flame-curved",  category:"medicine", desc:"专用烧伤药膏，镇痛并促进愈合。",            value:12, stack:true,  max:8,  usable:true, effects:[{type:"treat",conditions:["wounded"],hp:8}] };
GameData.items.eye_drops =          { id:"eye_drops",          name:"眼药水",     icon:"fa-solid fa-eye",                category:"medicine", desc:"滋润滴眼液，缓解沙尘和辐射引起的眼疾。",    value:10, stack:true,  max:10, usable:true, effects:[{type:"change_stat",stat:"morale",value:3},{type:"change_stat",stat:"radiation",value:-5}] };
GameData.items.anti_diarrhea_pills ={ id:"anti_diarrhea_pills",name:"止泻药",     icon:"fa-solid fa-capsules",           category:"medicine", desc:"止泻胶囊，防止脱水引起的体力流失。",        value:10, stack:true,  max:10, usable:true, effects:[{type:"remove_condition",condition:"food_poisoning"},{type:"change_stat",stat:"hp",value:3}] };
GameData.items.smelling_salts =     { id:"smelling_salts",     name:"嗅盐",       icon:"fa-solid fa-wind",               category:"medicine", desc:"刺激性氨盐，快速唤醒昏迷或眩晕者。",        value:10, stack:true,  max:10, usable:true, effects:[{type:"change_stat",stat:"fatigue",value:-20}] };
GameData.items.blood_bag =          { id:"blood_bag",          name:"血袋",       icon:"fa-solid fa-droplet",            category:"medicine", desc:"密封医用血袋，紧急输血恢复生命。",          value:40, stack:true,  max:3,  usable:true, effects:[{type:"change_stat",stat:"hp",value:30}] };

/* ===================== 材料 (20) ===================== */
GameData.items.iron_plate =     { id:"iron_plate",     name:"铁板",       icon:"fa-solid fa-square",            category:"material", desc:"厚实的铁板，加固建筑和制作防具用。",        value:4, stack:true, max:30 };
GameData.items.nails =          { id:"nails",          name:"钉子",       icon:"fa-solid fa-thumbtack",         category:"material", desc:"盒装铁钉，建造和修缮必备。",                value:2, stack:true, max:50 };
GameData.items.rubber =         { id:"rubber",         name:"橡胶",       icon:"fa-solid fa-circle",            category:"material", desc:"废旧橡胶块，隔音防水用途广泛。",            value:3, stack:true, max:30 };
GameData.items.canvas =         { id:"canvas",         name:"帆布",       icon:"fa-solid fa-square-full",       category:"material", desc:"耐磨防水帆布，搭建帐篷和遮蔽物。",          value:3, stack:true, max:30 };
GameData.items.wire_mesh =      { id:"wire_mesh",      name:"铁丝网",     icon:"fa-solid fa-border-all",        category:"material", desc:"编织铁丝网片，围栏和过滤用。",              value:3, stack:true, max:25 };
GameData.items.metal_pipe =     { id:"metal_pipe",     name:"金属管",     icon:"fa-solid fa-grip-lines-vertical",category:"material",desc:"不锈钢管材，管道和武器制造用。",            value:3, stack:true, max:25 };
GameData.items.brick =          { id:"brick",          name:"砖头",       icon:"fa-solid fa-cube",              category:"material", desc:"烧结红砖，建造墙体和火炉。",                value:2, stack:true, max:50 };
GameData.items.silicone =       { id:"silicone",       name:"硅胶",       icon:"fa-solid fa-flask",             category:"material", desc:"密封硅胶，防水填补缝隙。",                  value:4, stack:true, max:20 };
GameData.items.gear =           { id:"gear",           name:"齿轮",       icon:"fa-solid fa-gear",              category:"material", desc:"精加工金属齿轮，机械传动核心零件。",        value:5, stack:true, max:20 };
GameData.items.spring =         { id:"spring",         name:"弹簧",       icon:"fa-solid fa-wave-square",       category:"material", desc:"高张力金属弹簧，机械和武器配件。",          value:4, stack:true, max:25 };
GameData.items.bearing =        { id:"bearing",        name:"轴承",       icon:"fa-solid fa-circle-dot",        category:"material", desc:"滚珠轴承，减少机械摩擦损耗。",              value:5, stack:true, max:20 };
GameData.items.epoxy =          { id:"epoxy",          name:"环氧树脂",   icon:"fa-solid fa-flask-vial",        category:"material", desc:"双组份环氧树脂胶，强力粘合和浇铸。",        value:5, stack:true, max:15 };
GameData.items.tin_sheet =      { id:"tin_sheet",      name:"马口铁皮",   icon:"fa-solid fa-layer-group",       category:"material", desc:"薄镀锡铁皮，制作容器和屋面。",              value:3, stack:true, max:30 };
GameData.items.fiberglass =     { id:"fiberglass",     name:"玻璃纤维",   icon:"fa-solid fa-feather",           category:"material", desc:"玻璃纤维布，轻质高强度复合材料。",          value:5, stack:true, max:20 };
GameData.items.ceramic_plate =  { id:"ceramic_plate",  name:"陶瓷板",     icon:"fa-solid fa-stop",              category:"material", desc:"防弹陶瓷板，插入护甲提升防护。",            value:6, stack:true, max:15 };
GameData.items.leather =        { id:"leather",        name:"皮革",       icon:"fa-solid fa-mitten",            category:"material", desc:"鞣制兽皮皮革，制作护甲和衣物。",            value:4, stack:true, max:25 };
GameData.items.foam =           { id:"foam",           name:"泡沫板",     icon:"fa-solid fa-square",            category:"material", desc:"闭孔泡沫板，隔热缓冲填充物。",              value:2, stack:true, max:40 };
GameData.items.chain =          { id:"chain",          name:"铁链",       icon:"fa-solid fa-link",              category:"material", desc:"镀锌铁链，牵引锁固和制作防具。",            value:4, stack:true, max:20 };
GameData.items.duct_tape =      { id:"duct_tape",      name:"强力胶带",   icon:"fa-solid fa-tape",              category:"material", desc:"万能布基胶带，修补捆绑无所不能。",          value:3, stack:true, max:30 };
GameData.items.solder =         { id:"solder",         name:"焊锡",       icon:"fa-solid fa-screwdriver-wrench",category:"material",desc:"松香芯焊锡丝，电子元件焊接用。",            value:4, stack:true, max:20 };

/* ===================== 武器 (10) ===================== */
GameData.items.katana =         { id:"katana",         name:"武士刀",     icon:"fa-solid fa-khanda",            category:"weapon", desc:"锋利的日式长刀，威力惊人。",                value:35, stack:false, weapon:true, damage:45, durability:15 };
GameData.items.baseball_bat =   { id:"baseball_bat",   name:"棒球棍",     icon:"fa-solid fa-baseball-bat-ball", category:"weapon", desc:"金属棒球棍，打击感十足的近战武器。",        value:15, stack:false, weapon:true, damage:22, durability:25 };
GameData.items.switchblade =    { id:"switchblade",    name:"弹簧刀",     icon:"fa-solid fa-khanda",            category:"weapon", desc:"可折叠的弹簧跳刀，隐蔽便携。",              value:18, stack:false, weapon:true, damage:18, durability:20 };
GameData.items.sledgehammer =   { id:"sledgehammer",   name:"大锤",       icon:"fa-solid fa-hammer",            category:"weapon", desc:"沉重的长柄大锤，破墙碎骨无坚不摧。",        value:20, stack:false, weapon:true, damage:35, durability:30 };
GameData.items.combat_knife =   { id:"combat_knife",   name:"战术匕首",   icon:"fa-solid fa-khanda",            category:"weapon", desc:"军用制式格斗刀，刺切俱佳。",                value:22, stack:false, weapon:true, damage:25, durability:20 };
GameData.items.sniper_rifle =   { id:"sniper_rifle",   name:"狙击步枪",   icon:"fa-solid fa-crosshairs",        category:"weapon", desc:"高精度狙击步枪，远距离一击必杀。",          value:40, stack:false, weapon:true, damage:60, durability:12, ammo:"ammo" };
GameData.items.nail_gun =       { id:"nail_gun",       name:"射钉枪",     icon:"fa-solid fa-screwdriver-wrench",category:"weapon", desc:"改装电动射钉枪，近距离连射钢钉。",          value:16, stack:false, weapon:true, damage:15, durability:18 };
GameData.items.flamethrower =   { id:"flamethrower",   name:"喷火器",     icon:"fa-solid fa-fire-flame-curved", category:"weapon", desc:"单兵喷火器，喷射烈焰焚烧一切。",            value:38, stack:false, weapon:true, damage:50, durability:10, ammo:"fuel" };
GameData.items.taser =          { id:"taser",          name:"电击枪",     icon:"fa-solid fa-bolt",              category:"weapon", desc:"高压电击枪，非致命制服利器。",              value:25, stack:false, weapon:true, damage:20, durability:15 };
GameData.items.brass_knuckles = { id:"brass_knuckles", name:"指虎",       icon:"fa-solid fa-hand-fist",         category:"weapon", desc:"黄铜指虎套，徒手格斗杀伤力倍增。",          value:15, stack:false, weapon:true, damage:15, durability:Infinity };

/* ===================== 防具 (8) ===================== */
GameData.items.combat_helmet =  { id:"combat_helmet",  name:"战斗头盔",   icon:"fa-solid fa-helmet-safety",     category:"armor", desc:"军用FAST战斗头盔，防护出色。",              value:28, stack:false, armor:true, defense:35 };
GameData.items.tactical_vest =  { id:"tactical_vest",  name:"战术背心",   icon:"fa-solid fa-vest",              category:"armor", desc:"模块化战术背心，可插防弹板。",              value:30, stack:false, armor:true, defense:40 };
GameData.items.biohazard_suit = { id:"biohazard_suit", name:"生化防护服", icon:"fa-solid fa-user-astronaut",    category:"armor", desc:"全封闭生化防护服，隔绝病原和辐射尘埃。",    value:35, stack:false, armor:true, defense:15, radProtect:60 };
GameData.items.kevlar_armor =   { id:"kevlar_armor",   name:"凯夫拉护甲", icon:"fa-solid fa-shield-halved",     category:"armor", desc:"凯夫拉纤维软体护甲，轻便防弹。",            value:32, stack:false, armor:true, defense:45 };
GameData.items.gas_goggles =    { id:"gas_goggles",    name:"防毒风镜",   icon:"fa-solid fa-glasses",           category:"armor", desc:"密封防尘风镜，保护眼睛免受沙尘和毒气。",    value:15, stack:false, armor:true, defense:8,  radProtect:10 };
GameData.items.combat_boots =   { id:"combat_boots",   name:"战斗靴",     icon:"fa-solid fa-boot",              category:"armor", desc:"军规战斗靴，防刺防滑保护足部。",            value:18, stack:false, armor:true, defense:12 };
GameData.items.arm_guard =      { id:"arm_guard",      name:"臂甲",       icon:"fa-solid fa-hand-fist",         category:"armor", desc:"硬质前臂护甲，格挡近战攻击。",              value:16, stack:false, armor:true, defense:15 };
GameData.items.neck_guard =     { id:"neck_guard",     name:"护颈",       icon:"fa-solid fa-user-tie",          category:"armor", desc:"凯夫拉护颈围脖，保护脆弱颈部。",            value:15, stack:false, armor:true, defense:10 };

/* ===================== 燃料 (7) ===================== */
GameData.items.diesel =            { id:"diesel",            name:"柴油",       icon:"fa-solid fa-gas-pump",          category:"fuel", desc:"桶装柴油，发电机高能燃料。",                value:4, stack:true, max:15 };
GameData.items.kerosene =          { id:"kerosene",          name:"煤油",       icon:"fa-solid fa-oil-can",           category:"fuel", desc:"纯净煤油，灯具和炉具通用燃料。",            value:3, stack:true, max:15 };
GameData.items.propane_tank =      { id:"propane_tank",      name:"丙烷罐",     icon:"fa-solid fa-fire",              category:"fuel", desc:"便携丙烷气罐，野外炉灶和取暖用。",          value:5, stack:true, max:10 };
GameData.items.power_cell =        { id:"power_cell",        name:"聚变电池",   icon:"fa-solid fa-bolt",              category:"fuel", desc:"微型聚变能量电池，高能设备电源。",          value:6, stack:true, max:10 };
GameData.items.biofuel =           { id:"biofuel",           name:"生物燃料",   icon:"fa-solid fa-leaf",              category:"fuel", desc:"植物提炼的生物乙醇，可替代汽油。",          value:3, stack:true, max:15 };
GameData.items.charcoal_briquette ={ id:"charcoal_briquette",name:"木炭砖",     icon:"fa-solid fa-fire-flame-simple", category:"fuel", desc:"压缩成型木炭砖，燃烧持久无烟。",            value:2, stack:true, max:30 };
GameData.items.engine_oil =        { id:"engine_oil",        name:"机油",       icon:"fa-solid fa-oil-can",           category:"fuel", desc:"合成发动机润滑油，维护机械必需。",          value:3, stack:true, max:15 };

/* ===================== 珍品 (20) ===================== */
GameData.items.silver_coin =      { id:"silver_coin",      name:"银币",       icon:"fa-solid fa-coins",             category:"special", desc:"旧世界银币，废土有收藏价值。",              value:8,  stack:true,  max:20 };
GameData.items.diamond =          { id:"diamond",          name:"钻石",       icon:"fa-solid fa-gem",               category:"special", desc:"璀璨的切割钻石，废土最稀缺的珍宝。",        value:50, stack:true,  max:10 };
GameData.items.painting =         { id:"painting",         name:"油画",       icon:"fa-solid fa-palette",           category:"special", desc:"装裱精美的古典油画，艺术珍品。",            value:30, stack:false };
GameData.items.vinyl_record =     { id:"vinyl_record",     name:"黑胶唱片",   icon:"fa-solid fa-record-vinyl",      category:"special", desc:"保存完好的黑胶唱片，废土中弥足珍贵。",      value:15, stack:true,  max:10 };
GameData.items.chess_set =        { id:"chess_set",        name:"国际象棋",   icon:"fa-solid fa-chess",             category:"special", desc:"手工木雕棋子套装，消磨时间的雅趣。",        value:12, stack:false };
GameData.items.pocket_watch =     { id:"pocket_watch",     name:"怀表",       icon:"fa-solid fa-stopwatch",         category:"special", desc:"金壳机械怀表，走时精准的工艺品。",          value:25, stack:false };
GameData.items.antique_vase =     { id:"antique_vase",     name:"古董花瓶",   icon:"fa-solid fa-wine-bottle",       category:"special", desc:"釉彩精美的古瓷花瓶，价值不菲。",            value:35, stack:false };
GameData.items.gold_tooth =       { id:"gold_tooth",       name:"金牙",       icon:"fa-solid fa-tooth",             category:"special", desc:"从尸体上拔下的金质假牙，含金量高。",        value:10, stack:true,  max:20 };
GameData.items.silver_spoon =     { id:"silver_spoon",     name:"银汤匙",     icon:"fa-solid fa-utensils",          category:"special", desc:"纯银餐具套装中的汤匙，旧世界奢华。",        value:8,  stack:true,  max:15 };
GameData.items.stamp_collection = { id:"stamp_collection", name:"邮票册",     icon:"fa-solid fa-envelope",          category:"special", desc:"收藏级邮票册，记录旧世界的地理与文化。",    value:18, stack:false };
GameData.items.vintage_wine =     { id:"vintage_wine",     name:"陈年葡萄酒", icon:"fa-solid fa-wine-glass",        category:"special", desc:"陈年窖藏红酒，饮用可提振精神。",            value:20, stack:true,  max:5,  usable:true, effects:[{type:"change_stat",stat:"morale",value:15}] };
GameData.items.violin =           { id:"violin",           name:"小提琴",     icon:"fa-solid fa-music",             category:"special", desc:"音色优美的小提琴，废土中难得的乐器。",      value:28, stack:false };
GameData.items.typewriter =       { id:"typewriter",       name:"打字机",     icon:"fa-solid fa-keyboard",          category:"special", desc:"老式机械打字机，仍可使用的记录工具。",      value:22, stack:false };
GameData.items.camera =           { id:"camera",           name:"照相机",     icon:"fa-solid fa-camera",            category:"special", desc:"单反胶片相机，记录废土景象。",              value:20, stack:false };
GameData.items.sextant =          { id:"sextant",          name:"六分仪",     icon:"fa-solid fa-compass",           category:"special", desc:"精密航海六分仪，无需电力确定方位。",        value:30, stack:false };
GameData.items.pocket_bible =     { id:"pocket_bible",     name:"袖珍圣经",   icon:"fa-solid fa-cross",             category:"special", desc:"磨损的袖珍圣经，废土中精神寄托。",          value:10, stack:false, usable:true, reusable:true, effects:[{type:"change_stat",stat:"morale",value:12}] };
GameData.items.dog_tags =         { id:"dog_tags",         name:"军牌",       icon:"fa-solid fa-id-card",           category:"special", desc:"阵亡士兵的身份牌，锈迹斑斑。",              value:5,  stack:true,  max:10 };
GameData.items.silver_locket =    { id:"silver_locket",    name:"银吊坠",     icon:"fa-solid fa-heart",             category:"special", desc:"银制心形吊坠，内嵌逝者照片。",              value:15, stack:false, usable:true, reusable:true, effects:[{type:"change_stat",stat:"morale",value:10}] };
GameData.items.jade_pendant =     { id:"jade_pendant",     name:"玉佩",       icon:"fa-solid fa-circle",            category:"special", desc:"温润的翡翠玉佩，东方文化的遗存。",          value:25, stack:false };
GameData.items.antique_clock =    { id:"antique_clock",    name:"古董座钟",   icon:"fa-solid fa-clock",             category:"special", desc:"黄铜机械座钟，仍在走时的古董。",            value:32, stack:false };
