/* =====================================================================
 * 废土余生录 · 物品数据库 items.js
 * 所有物品定义挂载到全局 GameData.items
 * 字段：id name icon category desc value stack max nutrition decay
 *       effects(使用效果) usable weapon armor currency
 * ===================================================================== */
window.GameData = window.GameData || {};

GameData.items = {
  /* ---------- 食物 ---------- */
  canned_food:   { id:"canned_food",  name:"罐头食品", icon:"fa-solid fa-jar",        category:"food",     desc:"铁皮罐头，保质期近乎永恒，废土硬通货。", value:15, stack:true, max:20, nutrition:28, decay:null },
  raw_meat:      { id:"raw_meat",     name:"生肉",     icon:"fa-solid fa-drumstick-bite", category:"food",  desc:"血淋淋的肉块，生食易致病，须烹熟。",     value:9,  stack:true, max:10, nutrition:16, decay:3, rawRisk:0.35 },
  vegetable:     { id:"vegetable",    name:"蔬菜",     icon:"fa-solid fa-carrot",      category:"food",     desc:"略显萎蔫的菜叶，聊胜于无。",             value:9,  stack:true, max:10, nutrition:12, decay:5 },
  cooked_meat:   { id:"cooked_meat",  name:"熟肉",     icon:"fa-solid fa-bacon",       category:"food",     desc:"炉灶上烤熟的肉，香气在废土中弥足珍贵。", value:20, stack:true, max:5,  nutrition:32, decay:1 },
  dried_food:    { id:"dried_food",   name:"压缩干粮", icon:"fa-solid fa-cookie-bite", category:"food",     desc:"军用压缩口粮，轻便耐存，饱腹感强。",     value:25, stack:true, max:10, nutrition:24, decay:null },
  rotten_food:   { id:"rotten_food",  name:"变质食物", icon:"fa-solid fa-bug",         category:"food",     desc:"长霉发臭的残羹，吃了会食物中毒。",       value:0,  stack:true, max:5,  nutrition:6,  decay:null, rawRisk:0.6 },
  instant_noodles:{id:"instant_noodles",name:"方便面", icon:"fa-solid fa-bowl-food",  category:"food",     desc:"旧世界的速食面饼，热水一冲即可果腹。",   value:8,  stack:true, max:15, nutrition:18, decay:8 },
  mushroom:      { id:"mushroom",     name:"野蘑菇",   icon:"fa-solid fa-circle-dot",  category:"food",     desc:"废土上采到的蘑菇，生食有毒须烹熟。",     value:3,  stack:true, max:10, nutrition:10, decay:4, rawRisk:0.4 },
  fish:          { id:"fish",         name:"生鱼",     icon:"fa-solid fa-fish",        category:"food",     desc:"从河沟里摸来的鱼，生吃有寄生虫风险。",   value:6,  stack:true, max:8,  nutrition:14, decay:2, rawRisk:0.3 },
  fish_cooked:   { id:"fish_cooked",  name:"烤鱼",     icon:"fa-solid fa-fish-fins",   category:"food",     desc:"炭火上烤得焦香的鱼，肉质鲜嫩。",         value:16, stack:true, max:5,  nutrition:30, decay:1 },
  pickled_veg:   { id:"pickled_veg",  name:"腌菜",     icon:"fa-solid fa-pickle",      category:"food",     desc:"盐渍的腌菜，保质期长，废土难得的滋味。", value:12, stack:true, max:10, nutrition:14, decay:null },
  grain:         { id:"grain",        name:"粮食",     icon:"fa-solid fa-wheat-awn",   category:"food",     desc:"袋装粗粮，需炉灶加工成面包或粥。",       value:5,  stack:true, max:20, nutrition:0,  decay:null },
  bread:         { id:"bread",        name:"面包",     icon:"fa-solid fa-bread-slice", category:"food",     desc:"用粮食烤制的粗面包，饱腹耐存。",         value:14, stack:true, max:8,  nutrition:26, decay:3 },
  dried_meat:    { id:"dried_meat",   name:"腊肉",     icon:"fa-solid fa-drumstick-bite",category:"food",   desc:"熏制风干的肉条，耐存且饱腹。",           value:18, stack:true, max:8,  nutrition:30, decay:null },
  honey:         { id:"honey",        name:"蜂蜜",     icon:"fa-solid fa-jar",         category:"food",     desc:"难得的天然甜食，可食用亦可防腐疗伤。",   value:20, stack:true, max:5,  nutrition:16, decay:null, usable:true, effects:[{type:"change_stat",stat:"morale",value:6},{type:"change_stat",stat:"hp",value:5}] },
  wild_fruit:    { id:"wild_fruit",   name:"野果",     icon:"fa-solid fa-apple-whole", category:"food",     desc:"废土灌木丛中结的果子，酸甜可口。",       value:2,  stack:true, max:10, nutrition:8,  decay:3 },
  salt:          { id:"salt",         name:"盐",       icon:"fa-solid fa-cubes",       category:"food",     desc:"调味与防腐的必需品，废土硬通货之一。",   value:3,  stack:true, max:20, nutrition:0,  decay:null },

  /* ---------- 水 ---------- */
  clean_water:   { id:"clean_water",  name:"干净水",   icon:"fa-solid fa-bottle-water",category:"water",    desc:"煮沸或过滤后的净水，生存命脉。",         value:2,  stack:true, max:20, nutrition:26 },
  dirty_water:   { id:"dirty_water",  name:"脏水",     icon:"fa-solid fa-droplet-slash",category:"water",   desc:"浑浊的积水，直接饮用可能生病。",         value:1,  stack:true, max:20, nutrition:20, rawRisk:0.3 },
  bottled_water: { id:"bottled_water",name:"瓶装水",   icon:"fa-solid fa-bottle-droplet",category:"water",  desc:"封存完好的矿泉水，稀有而珍贵。",         value:4,  stack:true, max:10, nutrition:28 },
  rain_water:    { id:"rain_water",   name:"雨水",     icon:"fa-solid fa-cloud-rain",  category:"water",    desc:"收集的雨水，浑浊需煮沸方可饮用。",       value:1,  stack:true, max:15, nutrition:18, rawRisk:0.2 },
  ice:           { id:"ice",          name:"冰块",     icon:"fa-solid fa-snowflake",   category:"water",    desc:"冬天采集的冰块，融化后即为水源。",       value:1,  stack:true, max:10, nutrition:16, rawRisk:0.15 },

  /* ---------- 药品 ---------- */
  bandage:       { id:"bandage",      name:"绷带",     icon:"fa-solid fa-bandage",     category:"medicine", desc:"止血包扎，处理出血与外伤。",            value:27, stack:true, max:10, usable:true,  effects:[{type:"treat",conditions:["bleeding","wounded"],hp:8}] },
  herb:          { id:"herb",         name:"草药",     icon:"fa-solid fa-leaf",        category:"medicine", desc:"山间采来的草药，可制草药药。",          value:2,  stack:true, max:20 },
  herbal_meds:   { id:"herbal_meds",  name:"草药药",   icon:"fa-solid fa-mortar-pestle",category:"medicine",desc:"草药研磨成药，能治轻症。",              value:21, stack:true, max:5,  usable:true,  effects:[{type:"treat",conditions:["sick"],hp:5}] },
  meds:          { id:"meds",         name:"抗生素",   icon:"fa-solid fa-pills",       category:"medicine", desc:"强效药物，治疗重症与感染。",            value:32, stack:true, max:5,  usable:true,  effects:[{type:"treat",conditions:["sick","infection","food_poisoning"],hp:10}] },
  medkit:        { id:"medkit",       name:"急救包",   icon:"fa-solid fa-kit-medical", category:"medicine", desc:"全套急救用品，包治外伤出血。",          value:40, stack:true, max:3,  usable:true,  effects:[{type:"treat",conditions:["bleeding","wounded","sick","infection"],hp:20}] },
  radaway:       { id:"radaway",      name:"抗辐射药", icon:"fa-solid fa-syringe",     category:"medicine", desc:"注射后排辐射，废土必备。",              value:35, stack:true, max:5,  usable:true,  effects:[{type:"change_stat",stat:"radiation",value:-35}] },
  painkiller:    { id:"painkiller",   name:"止痛药",   icon:"fa-solid fa-capsules",    category:"medicine", desc:"暂时镇痛提神，不治本。",                value:15, stack:true, max:10, usable:true,  effects:[{type:"change_stat",stat:"fatigue",value:-25},{type:"change_stat",stat:"hp",value:3}] },
  vaccine:       { id:"vaccine",      name:"疫苗",     icon:"fa-solid fa-syringe",     category:"medicine", desc:"注射后获得短期免疫，降低染病概率。",     value:45, stack:true, max:3,  usable:true,  effects:[{type:"change_stat",stat:"hp",value:5},{type:"set_flag",flag:"vaccinated",value:true}] },
  stimulant:     { id:"stimulant",    name:"兴奋剂",   icon:"fa-solid fa-bolt",        category:"medicine", desc:"强行提振精力，但有副作用。",             value:18, stack:true, max:5,  usable:true,  effects:[{type:"change_stat",stat:"fatigue",value:-40},{type:"change_stat",stat:"hp",value:-5}] },
  antidote:      { id:"antidote",     name:"解毒剂",   icon:"fa-solid fa-vial",        category:"medicine", desc:"中和体内毒素，解除中毒状态。",           value:28, stack:true, max:5,  usable:true,  effects:[{type:"remove_condition",condition:"food_poisoning"},{type:"change_stat",stat:"hp",value:8}] },
  splint:        { id:"splint",       name:"夹板",     icon:"fa-solid fa-bone",        category:"medicine", desc:"固定骨折扭伤，加速外伤恢复。",           value:12, stack:true, max:5,  usable:true,  effects:[{type:"treat",conditions:["wounded"],hp:12}] },
  vitamin:       { id:"vitamin",      name:"维生素",   icon:"fa-solid fa-tablets",     category:"medicine", desc:"补充微量元素，小幅提升生命与精神。",     value:10, stack:true, max:10, usable:true,  effects:[{type:"change_stat",stat:"hp",value:6},{type:"change_stat",stat:"morale",value:4}] },
  sedative:      { id:"sedative",     name:"镇静剂",   icon:"fa-solid fa-moon",        category:"medicine", desc:"安神助眠，大幅恢复疲劳但降低精神。",     value:14, stack:true, max:5,  usable:true,  effects:[{type:"change_stat",stat:"fatigue",value:-35},{type:"change_stat",stat:"morale",value:-5}] },
  herbal_poultice:{id:"herbal_poultice",name:"草药敷料",icon:"fa-solid fa-leaf",       category:"medicine", desc:"捣碎的草药外敷，消肿止血。",             value:8,  stack:true, max:8,  usable:true,  effects:[{type:"treat",conditions:["bleeding","wounded"],hp:6}] },

  /* ---------- 材料 ---------- */
  components:    { id:"components",   name:"零件",     icon:"fa-solid fa-gear",        category:"material", desc:"基础建造材料，废土价值基准。",          value:1,  stack:true, max:99 },
  parts:         { id:"parts",        name:"部件",     icon:"fa-solid fa-screwdriver-wrench",category:"material",desc:"精密部件，高级建造所需。",        value:3,  stack:true, max:50 },
  electronics:   { id:"electronics",  name:"电子元件", icon:"fa-solid fa-microchip",   category:"material", desc:"电路与芯片，电气设施命脉。",            value:5,  stack:true, max:30 },
  wood:          { id:"wood",         name:"木材",     icon:"fa-solid fa-tree",        category:"material", desc:"木板木条，建造与燃料两用。",            value:2,  stack:true, max:50 },
  scrap:         { id:"scrap",        name:"废铁",     icon:"fa-solid fa-bahai",       category:"material", desc:"生锈的铁片，打造工具武器的原料。",      value:1,  stack:true, max:99 },
  cloth:         { id:"cloth",        name:"布料",     icon:"fa-solid fa-shirt",       category:"material", desc:"破旧布匹，制绷带衣物之用。",            value:1,  stack:true, max:50 },
  cement:        { id:"cement",       name:"水泥",     icon:"fa-solid fa-mountain",    category:"material", desc:"袋装水泥，加固建筑必需。",              value:4,  stack:true, max:30 },
  rope:          { id:"rope",         name:"绳索",     icon:"fa-solid fa-rope",        category:"material", desc:"编织的粗绳，建造攀登捆绑之用。",         value:2,  stack:true, max:20 },
  plastic:       { id:"plastic",      name:"塑料",     icon:"fa-solid fa-shapes",      category:"material", desc:"废旧塑料，防水修补多用途。",             value:1,  stack:true, max:50 },
  battery:       { id:"battery",      name:"电池",     icon:"fa-solid fa-battery-full",category:"material", desc:"通用电池，为电器设备供能。",             value:3,  stack:true, max:20 },
  copper_wire:   { id:"copper_wire",  name:"铜线",     icon:"fa-solid fa-bezier-curve",category:"material", desc:"导电的铜线，电气建造的核心材料。",       value:4,  stack:true, max:20 },
  gunpowder:     { id:"gunpowder",    name:"火药",     icon:"fa-solid fa-explosion",   category:"material", desc:"黑火药，制造弹药与爆炸物所需。",         value:6,  stack:true, max:15 },
  steel:         { id:"steel",        name:"钢材",     icon:"fa-solid fa-cube",        category:"material", desc:"优质钢材，高级建筑与武器之骨。",         value:6,  stack:true, max:20 },
  fertilizer:    { id:"fertilizer",   name:"肥料",     icon:"fa-solid fa-seedling",    category:"material", desc:"促进作物生长的肥料，菜园升级所需。",     value:3,  stack:true, max:15 },
  seeds:         { id:"seeds",        name:"种子",     icon:"fa-solid fa-leaf",        category:"material", desc:"各类作物种子，菜园种植的起点。",         value:2,  stack:true, max:10 },
  glue:          { id:"glue",         name:"胶水",     icon:"fa-solid fa-droplet",     category:"material", desc:"强力胶水，修补与黏合材料。",             value:2,  stack:true, max:15 },
  glass:         { id:"glass",        name:"玻璃",     icon:"fa-solid fa-vector-square",category:"material",desc:"碎玻璃与玻璃片，建造温室与器皿。",       value:2,  stack:true, max:20 },

  /* ---------- 武器 ---------- */
  knife:         { id:"knife",        name:"短刀",     icon:"fa-solid fa-khanda",      category:"weapon",   desc:"近战利器，悄无声息地解决威胁。",        value:16, stack:false, weapon:true, damage:25, durability:10 },
  crowbar:       { id:"crowbar",      name:"撬棍",     icon:"fa-solid fa-wrench",      category:"weapon",   desc:"撬门开锁两不误，永不损坏。",            value:10, stack:false, weapon:true, damage:15, durability:Infinity, tool:true },
  hatchet:       { id:"hatchet",      name:"手斧",     icon:"fa-solid fa-axe",         category:"weapon",   desc:"砍柴杀敌皆宜，但会磨损。",              value:20, stack:false, weapon:true, damage:35, durability:10 },
  pistol:        { id:"pistol",       name:"手枪",     icon:"fa-solid fa-gun",         category:"weapon",   desc:"9mm手枪，需弹药，远程威慑。",           value:21, stack:false, weapon:true, damage:40, durability:Infinity, ammo:"ammo" },
  rifle:         { id:"rifle",        name:"步枪",     icon:"fa-solid fa-gun",         category:"weapon",   desc:"军用步枪，威力大射程远。",              value:30, stack:false, weapon:true, damage:50, durability:Infinity, ammo:"ammo" },
  bow:           { id:"bow",          name:"自制弓",   icon:"fa-solid fa-bullseye",    category:"weapon",   desc:"削木为弓，无声远程，会损耗。",          value:8,  stack:false, weapon:true, damage:20, durability:5 },
  ammo:          { id:"ammo",         name:"弹药",     icon:"fa-solid fa-bullets",     category:"weapon",   desc:"通用枪弹，枪械的命根子。",              value:4,  stack:true, max:50 },
  machete:       { id:"machete",      name:"砍刀",     icon:"fa-solid fa-khanda",      category:"weapon",   desc:"宽刃砍刀，威力大，适合近身搏杀。",       value:25, stack:false, weapon:true, damage:40, durability:12 },
  spear:         { id:"spear",        name:"长矛",     icon:"fa-solid fa-staff-snake", category:"weapon",   desc:"削尖的长矛，攻击距离远，安全且实用。",   value:14, stack:false, weapon:true, damage:28, durability:8 },
  shotgun:       { id:"shotgun",      name:"霰弹枪",   icon:"fa-solid fa-gun",         category:"weapon",   desc:"近距离威力巨大，每发耗弹两颗。",         value:35, stack:false, weapon:true, damage:55, durability:Infinity, ammo:"ammo", ammoCost:2 },
  crossbow:      { id:"crossbow",     name:"弩",       icon:"fa-solid fa-bullseye",    category:"weapon",   desc:"无声远程武器，弩箭可回收。",             value:22, stack:false, weapon:true, damage:35, durability:15, ammo:"crossbow_bolt" },
  crossbow_bolt: { id:"crossbow_bolt",name:"弩箭",     icon:"fa-solid fa-arrow-right", category:"weapon",   desc:"弩的专用箭矢，可自制。",                 value:2,  stack:true, max:30 },
  grenade:       { id:"grenade",      name:"手榴弹",   icon:"fa-solid fa-bomb",        category:"weapon",   desc:"一次性爆炸武器，战斗中自动投掷，威力惊人。", value:30, stack:true, max:5 },
  pipe_wrench:   { id:"pipe_wrench",  name:"管钳",     icon:"fa-solid fa-wrench",      category:"weapon",   desc:"沉重的管钳，砸下去比撬棍疼多了。",       value:12, stack:false, weapon:true, damage:22, durability:Infinity, tool:true },

  /* ---------- 防具 ---------- */
  helmet:        { id:"helmet",       name:"头盔",     icon:"fa-solid fa-helmet-safety",category:"armor",   desc:"钢制头盔，减免头部伤害。",              value:18, stack:false, armor:true, defense:20 },
  vest:          { id:"vest",         name:"防弹衣",   icon:"fa-solid fa-shield-halved",category:"armor",   desc:"凯夫拉背心，大幅减免伤害。",            value:38, stack:false, armor:true, defense:40 },
  gas_suit:      { id:"gas_suit",     name:"防护服",   icon:"fa-solid fa-user-astronaut",category:"armor",  desc:"全套防化服，免疫辐射与毒气侵蚀。",       value:30, stack:false, armor:true, defense:15, radProtect:30 },
  leather_armor: { id:"leather_armor",name:"皮甲",     icon:"fa-solid fa-vest-patches",category:"armor",   desc:"兽皮缝制的护甲，轻便实用。",             value:15, stack:false, armor:true, defense:25 },
  riot_helmet:   { id:"riot_helmet",  name:"防暴头盔", icon:"fa-solid fa-helmet-safety",category:"armor",  desc:"带面罩的防暴头盔，防护全面。",           value:25, stack:false, armor:true, defense:30 },
  shield:        { id:"shield",       name:"简易盾牌", icon:"fa-solid fa-shield",      category:"armor",   desc:"木板铁皮拼凑的盾牌，格挡攻击。",         value:10, stack:false, armor:true, defense:18 },

  /* ---------- 燃料 ---------- */
  fuel:          { id:"fuel",         name:"燃料",     icon:"fa-solid fa-gas-pump",    category:"fuel",     desc:"罐装燃料，发电机与车辆的动力。",        value:2,  stack:true, max:20 },
  firewood:      { id:"firewood",     name:"木柴",     icon:"fa-solid fa-fire-burner", category:"fuel",     desc:"劈好的木柴，生火取暖烹饪。",            value:1,  stack:true, max:30 },
  alcohol:       { id:"alcohol",      name:"纯酒精",   icon:"fa-solid fa-wine-bottle", category:"fuel",     desc:"可燃可饮可制药，多用途。",              value:12, stack:true, max:10, usable:true, effects:[{type:"change_stat",stat:"morale",value:8},{type:"change_stat",stat:"fatigue",value:-10}] },
  coal:          { id:"coal",         name:"煤炭",     icon:"fa-solid fa-mountain",    category:"fuel",     desc:"黑色石块，燃烧持久，供暖首选。",         value:2,  stack:true, max:20 },
  candle:        { id:"candle",       name:"蜡烛",     icon:"fa-solid fa-fire-flame-simple",category:"fuel",desc:"照明用的蜡烛，微弱但温暖。",            value:1,  stack:true, max:15 },
  battery_pack:  { id:"battery_pack", name:"电池组",   icon:"fa-solid fa-battery-three-quarters",category:"fuel",desc:"大容量电池组，为发电机供能。",     value:8,  stack:true, max:10 },

  /* ---------- 特殊/奢侈品 ---------- */
  cigarettes:    { id:"cigarettes",   name:"香烟",     icon:"fa-solid fa-smoking",     category:"special",  desc:"废土硬通货，可换物资，亦可提神。",      value:2,  stack:true, max:50, usable:true, effects:[{type:"change_stat",stat:"morale",value:5},{type:"change_stat",stat:"fatigue",value:-5}] },
  jewelry:       { id:"jewelry",      name:"珠宝",     icon:"fa-solid fa-gem",         category:"special",  desc:"旧世界的遗物，价值连城。",              value:13, stack:true, max:10 },
  book:          { id:"book",         name:"书籍",     icon:"fa-solid fa-book",        category:"special",  desc:"旧书一册，可读可烧，安抚精神。",        value:1,  stack:true, max:10, usable:true, effects:[{type:"change_stat",stat:"morale",value:10}] },
  radio:         { id:"radio",        name:"收音机",   icon:"fa-solid fa-tower-broadcast",category:"special",desc:"手摇收音机，可收听废土广播。",          value:10, stack:false, usable:true, reusable:true, effects:[{type:"radio_signal"}] },
  flashlight:    { id:"flashlight",   name:"手电筒",   icon:"fa-solid fa-flashlight",  category:"special",  desc:"照亮黑暗，搜刮时降低风险。",            value:8,  stack:false },
  gas_mask:      { id:"gas_mask",     name:"防毒面具", icon:"fa-solid fa-mask-face",   category:"special",  desc:"过滤毒气辐射，进入污染区必备。",        value:15, stack:false },
  map:           { id:"map",          name:"地图",     icon:"fa-solid fa-map",         category:"special",  desc:"手绘废土地图，解锁更多地点。",          value:10, stack:false },
  coffee:        { id:"coffee",       name:"咖啡",     icon:"fa-solid fa-mug-hot",     category:"special",  desc:"提神饮品，废土上的奢侈品。",            value:2,  stack:true, max:20, usable:true, effects:[{type:"change_stat",stat:"fatigue",value:-20}] },
  playing_cards: { id:"playing_cards",name:"扑克牌",   icon:"fa-solid fa-clubs",       category:"special",  desc:"一副旧扑克，消磨时光安抚精神。",        value:3,  stack:false, usable:true, reusable:true, effects:[{type:"change_stat",stat:"morale",value:8},{type:"change_stat",stat:"fatigue",value:-5}] },
  photo:         { id:"photo",        name:"旧照片",   icon:"fa-solid fa-image",       category:"special",  desc:"泛黄的全家福，看着它心中五味杂陈。",    value:1,  stack:false, usable:true, reusable:true, effects:[{type:"change_stat",stat:"morale",value:12}] },
  harmonica:     { id:"harmonica",    name:"口琴",     icon:"fa-solid fa-music",       category:"special",  desc:"一把旧口琴，吹出的曲子抚慰废土孤寂。",  value:8,  stack:false, usable:true, reusable:true, effects:[{type:"change_stat",stat:"morale",value:15},{type:"change_stat",stat:"fatigue",value:-8}] },
  compass:       { id:"compass",      name:"指南针",   icon:"fa-solid fa-compass",     category:"special",  desc:"旧式指南针，探索时降低迷路风险。",      value:8,  stack:false },
  binoculars:    { id:"binoculars",   name:"望远镜",   icon:"fa-solid fa-binoculars",  category:"special",  desc:"观察远处的利器，搜刮时预警危险。",      value:12, stack:false },
  diary:         { id:"diary",        name:"日记本",   icon:"fa-solid fa-book-open",   category:"special",  desc:"记录废土见闻，倾诉心声的伙伴。",        value:2,  stack:false, usable:true, reusable:true, effects:[{type:"change_stat",stat:"morale",value:10}] },
  whistle:       { id:"whistle",      name:"哨子",     icon:"fa-solid fa-bell",        category:"special",  desc:"求救或预警的哨子，小巧实用。",          value:3,  stack:false },
  watch:         { id:"watch",        name:"手表",     icon:"fa-solid fa-clock",       category:"special",  desc:"旧世界的手表，走时精准，价值不菲。",    value:15, stack:false },
  gold_bar:      { id:"gold_bar",     name:"金条",     icon:"fa-solid fa-gold",        category:"special",  desc:"纯金条，旧世界财富的象征，废土天价。",  value:50, stack:true, max:5 },
  sewing_kit:    { id:"sewing_kit",   name:"针线包",   icon:"fa-solid fa-spider",      category:"special",  desc:"缝补衣物与绷带的工具包。",              value:5,  stack:false },
  toolkit:       { id:"toolkit",      name:"工具箱",   icon:"fa-solid fa-toolbox",     category:"special",  desc:"全套修车工具，制造时提升效率。",        value:20, stack:false },
  energy_drink:  { id:"energy_drink", name:"能量饮料", icon:"fa-solid fa-bolt",        category:"special",  desc:"旧世界的功能饮料，瞬间恢复精力。",      value:6,  stack:true, max:10, usable:true, effects:[{type:"change_stat",stat:"fatigue",value:-30},{type:"change_stat",stat:"morale",value:3}] },
  letter:        { id:"letter",       name:"信件",     icon:"fa-solid fa-envelope",    category:"special",  desc:"一封未寄出的家书，字迹模糊。",          value:1,  stack:false, usable:true, effects:[{type:"change_stat",stat:"morale",value:15}] },
  incense:       { id:"incense",      name:"线香",     icon:"fa-solid fa-fire-flame-simple",category:"special",desc:"庙宇中寻得的线香，点燃可安神定心。",   value:4,  stack:true, max:10, usable:true, effects:[{type:"change_stat",stat:"morale",value:10},{type:"change_stat",stat:"radiation",value:-5}] },
  paper:         { id:"paper",        name:"纸张",     icon:"fa-solid fa-file-lines",  category:"material", desc:"旧纸张，可引火或记录，废土上的奢侈品。", value:1,  stack:true, max:30 },
  medicine_bottle:{id:"medicine_bottle",name:"药瓶",   icon:"fa-solid fa-prescription-bottle",category:"material",desc:"空药瓶，可盛水或储存物品。",        value:1,  stack:true, max:15 }
};

/* 物品分类显示配置 */
GameData.itemCategories = {
  food:     { name:"食物",   icon:"fa-solid fa-utensils",     color:"#c0392b" },
  water:    { name:"饮水",   icon:"fa-solid fa-droplet",      color:"#2980b9" },
  medicine: { name:"药品",   icon:"fa-solid fa-staff-snake",  color:"#27ae60" },
  material: { name:"材料",   icon:"fa-solid fa-cubes-stacked",color:"#b9770e" },
  weapon:   { name:"武器",   icon:"fa-solid fa-khanda",       color:"#7f8c8d" },
  armor:    { name:"防具",   icon:"fa-solid fa-shield-halved",color:"#566573" },
  fuel:     { name:"燃料",   icon:"fa-solid fa-fire",         color:"#e67e22" },
  special:  { name:"珍品",   icon:"fa-solid fa-star",         color:"#f1c40f" }
};
