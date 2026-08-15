/* =====================================================================
 * 废土余生录 · 避难所设施 + 制造配方 facilities.js
 * 设施 facility: name icon desc category buildCost upgradeCosts maxLevel
 *               dailyProduce dailyUpkeep effects(对结算的影响) requires
 * 配方 recipes: 按设施分组，output + input{item:count}
 * ===================================================================== */
window.GameData = window.GameData || {};

GameData.facilities = {
  workshop: {
    id:"workshop", name:"工作台", icon:"fa-solid fa-screwdriver-wrench", category:"crafting",
    desc:"一切制造与建造的根基。有了它，方能打造工具、加固门窗。",
    buildCost:{components:6, wood:3}, maxLevel:3,
    upgradeCosts:[{components:10, parts:3},{components:18, parts:6, electronics:2}],
    dailyUpkeep:null, requires:null,
    descLv:["简陋的工作台，可制造基础工具。","升级后可打造近战武器与防具。","高级工作台，可加固门窗、修理装备。"]
  },
  bed: {
    id:"bed", name:"床铺", icon:"fa-solid fa-bed", category:"living",
    desc:"一张能安睡的床。睡眠是恢复疲劳、维系精神的良药。",
    buildCost:{wood:4, cloth:2}, maxLevel:1,
    upgradeCosts:[], dailyUpkeep:null, requires:null,
    descLv:["有了床铺，休息时疲劳恢复量大幅提升。"]
  },
  heater: {
    id:"heater", name:"火炉", icon:"fa-solid fa-fire-flame-curved", category:"survival",
    desc:"驱散寒夜与湿冷的火炉，需消耗燃料。冬日里它就是命。",
    buildCost:{components:5, parts:2, scrap:3}, maxLevel:2,
    upgradeCosts:[{components:8, electronics:2}],
    dailyUpkeep:{firewood:1}, requires:null,
    descLv:["简易火炉，能维持室内温度，避免失温。","强化火炉，燃料消耗减半，供暖更稳。"]
  },
  stove: {
    id:"stove", name:"炉灶", icon:"fa-solid fa-fire-burner", category:"survival",
    desc:"烹饪生食、煮沸脏水的炉灶。熟食饱腹且不易致病。",
    buildCost:{components:6, parts:3, scrap:2}, maxLevel:2,
    upgradeCosts:[{components:8, parts:4}],
    dailyUpkeep:null, requires:null,
    descLv:["可烹饪食物与烧水，提升食物效用。","高级炉灶，烹饪不消耗额外燃料。"]
  },
  rain_collector: {
    id:"rain_collector", name:"雨水收集器", icon:"fa-solid fa-cloud-rain", category:"production",
    desc:"将天降雨水化为水源的装置，每日产出净水。",
    buildCost:{components:5, cloth:2, scrap:2}, maxLevel:2,
    upgradeCosts:[{components:8, parts:3, electronics:1}],
    dailyUpkeep:null, requires:null,
    produce:{water:2}, descLv:["每日产出2份水源。","过滤型，每日产出3份干净水。"]
  },
  garden: {
    id:"garden", name:"菜园", icon:"fa-solid fa-seedling", category:"production",
    desc:"在废土上开辟的一方菜畦，需浇水，但能自给食物。",
    buildCost:{components:6, wood:3, clean_water:1}, maxLevel:2,
    upgradeCosts:[{components:8, electronics:2, cement:2}],
    dailyUpkeep:{clean_water:1}, requires:null,
    produce:{vegetable:1}, descLv:["每日产出1份蔬菜，需消耗水。","温室菜园，每日产出2份蔬菜。"]
  },
  infirmary: {
    id:"infirmary", name:"医务室", icon:"fa-solid fa-staff-snake", category:"crafting",
    desc:"配备器械的医务室，可制药、疗伤，降低疾病恶化风险。",
    buildCost:{components:10, parts:5, herb:2}, maxLevel:2,
    upgradeCosts:[{components:12, electronics:3, parts:4}],
    dailyUpkeep:null, requires:"workshop",
    descLv:["可制作草药药，疗伤效率提升。","野战医院，可制作抗生素与急救包。"]
  },
  distillery: {
    id:"distillery", name:"蒸馏器", icon:"fa-solid fa-flask", category:"crafting",
    desc:"酿造酒精的蒸馏器，酒精可换钱、提神、制药。",
    buildCost:{components:10, parts:5, scrap:3}, maxLevel:1,
    upgradeCosts:[], dailyUpkeep:null, requires:"workshop",
    descLv:["可酿造纯酒精，硬通货之一。"]
  },
  watchtower: {
    id:"watchtower", name:"瞭望塔", icon:"fa-solid fa-tower-observation", category:"defense",
    desc:"居高临下的瞭望塔，提前预警袭击，降低夜间损失。",
    buildCost:{wood:10, components:5, scrap:3}, maxLevel:2,
    upgradeCosts:[{wood:8, parts:4}],
    dailyUpkeep:null, requires:"workshop",
    descLv:["夜间袭击损失降低30%。","狙击塔，袭击损失降低60%。"]
  },
  reinforced_door: {
    id:"reinforced_door", name:"强化门", icon:"fa-solid fa-door-closed", category:"defense",
    desc:"加固的钢铁大门，抵御劫匪闯入的最强屏障。",
    buildCost:{components:15, parts:8, wood:5, cement:2}, maxLevel:1,
    upgradeCosts:[], dailyUpkeep:null, requires:"workshop",
    descLv:["袭击防御+50%，大幅减少物资被抢。"]
  },
  radio_station: {
    id:"radio_station", name:"收音机", icon:"fa-solid fa-tower-broadcast", category:"utility",
    desc:"收听废土广播，预知天气、动向与机遇。",
    buildCost:{electronics:3, components:5, parts:2}, maxLevel:1,
    upgradeCosts:[], dailyUpkeep:null, requires:"workshop",
    descLv:["每日可收听一次废土广播，获取情报。"]
  },
  generator: {
    id:"generator", name:"发电机", icon:"fa-solid fa-plug", category:"utility",
    desc:"燃烧燃料发电的机器，为电气设施供能，提升所有设施效率。",
    buildCost:{components:12, parts:6, electronics:3, steel:2}, maxLevel:2,
    upgradeCosts:[{components:10, electronics:4, copper_wire:3}],
    dailyUpkeep:{fuel:1}, requires:"workshop",
    descLv:["为电气设施供能，设施产出+15%。","高效发电机，设施产出+30%，燃料消耗不变。"]
  },
  smokehouse: {
    id:"smokehouse", name:"熏制房", icon:"fa-solid fa-smoking", category:"production",
    desc:"用烟火熏制食物，延长保质期，将生肉制成腊肉。",
    buildCost:{wood:8, components:5, scrap:3}, maxLevel:1,
    upgradeCosts:[], dailyUpkeep:{firewood:1}, requires:"workshop",
    descLv:["可将生肉熏制成腊肉，蔬菜腌成腌菜，延长保质期。"]
  },
  fish_pond: {
    id:"fish_pond", name:"鱼塘", icon:"fa-solid fa-fish", category:"production",
    desc:"在避难所旁挖出的鱼塘，放养鱼苗，每日产出鲜鱼。",
    buildCost:{cement:5, components:6, clean_water:2}, maxLevel:2,
    upgradeCosts:[{cement:4, parts:3, fertilizer:2}],
    dailyUpkeep:null, requires:null,
    produce:{fish:1}, descLv:["每日产出1条生鱼。","生态鱼塘，每日产出2条生鱼。"]
  },
  trap: {
    id:"trap", name:"陷阱", icon:"fa-solid fa-mound", category:"production",
    desc:"设在避难所周围的捕兽陷阱，偶尔捕获小动物。",
    buildCost:{wood:4, rope:2, scrap:2}, maxLevel:2,
    upgradeCosts:[{wood:3, rope:2, parts:2}],
    dailyUpkeep:null, requires:null,
    produce:{raw_meat:1}, descLv:["偶尔捕获小动物，产出生肉。","精巧陷阱，产出稳定，偶尔获得野果。"]
  },
  water_well: {
    id:"water_well", name:"水井", icon:"fa-solid fa-water", category:"production",
    desc:"深入地下的水井，提供稳定的地下水源，需煮沸饮用。",
    buildCost:{cement:8, components:5, steel:2}, maxLevel:1,
    upgradeCosts:[], dailyUpkeep:null, requires:null,
    produce:{rain_water:2}, descLv:["每日产出2份地下水（需煮沸）。"]
  },
  armory: {
    id:"armory", name:"军械台", icon:"fa-solid fa-shield-halved", category:"crafting",
    desc:"专门打造武器弹药的军械工作台，可制造枪械与火药。",
    buildCost:{steel:5, components:10, parts:6, scrap:5}, maxLevel:2,
    upgradeCosts:[{steel:5, electronics:3, parts:4}],
    dailyUpkeep:null, requires:"workshop",
    descLv:["可制造弹药、火药与近战武器。","高级军械台，可修理枪械与制造爆炸物。"]
  }
};

/* ---------- 制造配方（按设施/动作分组） ---------- */
/* type: build(设施建造) craft(工具武器) cook(烹饪) brew(酿造) med(制药) */
GameData.recipes = {
  /* 工作台制造 */
  crowbar:   { type:"craft", facility:"workshop", facilityLv:1, output:{crowbar:1},    input:{scrap:3, components:2}, time:1 },
  knife:     { type:"craft", facility:"workshop", facilityLv:2, output:{knife:1},      input:{scrap:2, components:3}, time:1 },
  hatchet:   { type:"craft", facility:"workshop", facilityLv:3, output:{hatchet:1},    input:{scrap:3, components:4, wood:1}, time:1 },
  bow:       { type:"craft", facility:"workshop", facilityLv:1, output:{bow:1},        input:{wood:3, cloth:1, scrap:1}, time:1 },
  ammo:      { type:"craft", facility:"workshop", facilityLv:2, output:{ammo:3},       input:{scrap:4, components:2, parts:1}, time:1 },

  /* 炉灶烹饪 */
  cooked_meat:{ type:"cook", facility:"stove", facilityLv:1, output:{cooked_meat:1}, input:{raw_meat:1, firewood:1}, time:1 },
  clean_water_from_dirty:{ type:"cook", facility:"stove", facilityLv:1, output:{clean_water:1}, input:{dirty_water:1, firewood:1}, time:1, label:"煮沸脏水" },

  /* 医务室制药 */
  herbal_meds_recipe:{ type:"med", facility:"infirmary", facilityLv:1, output:{herbal_meds:1}, input:{herb:3}, time:1, label:"研磨草药药" },
  meds_recipe:       { type:"med", facility:"infirmary", facilityLv:2, output:{meds:1}, input:{herb:2, alcohol:1, components:2}, time:1, label:"提炼抗生素" },
  bandage_recipe:    { type:"med", facility:"infirmary", facilityLv:1, output:{bandage:2}, input:{cloth:3}, time:1, label:"缝制绷带" },

  /* 蒸馏器酿造 */
  brew_alcohol:{ type:"brew", facility:"distillery", facilityLv:1, output:{alcohol:1}, input:{vegetable:2, clean_water:1}, time:1, label:"酿造纯酒精" },

  /* 炉灶烹饪（新增） */
  bread_recipe:    { type:"cook", facility:"stove", facilityLv:1, output:{bread:2}, input:{grain:3, firewood:1}, time:1, label:"烤制面包" },
  fish_cooked_recipe:{type:"cook", facility:"stove", facilityLv:1, output:{fish_cooked:1}, input:{fish:1, firewood:1}, time:1, label:"烤鱼" },
  mushroom_recipe: { type:"cook", facility:"stove", facilityLv:1, output:{cooked_meat:1}, input:{mushroom:2, firewood:1}, time:1, label:"炒蘑菇" },
  clean_water_from_rain:{ type:"cook", facility:"stove", facilityLv:1, output:{clean_water:1}, input:{rain_water:1, firewood:1}, time:1, label:"煮沸雨水" },
  clean_water_from_ice:{ type:"cook", facility:"stove", facilityLv:1, output:{clean_water:1}, input:{ice:1, firewood:1}, time:1, label:"融化冰块" },
  instant_noodles_recipe:{ type:"cook", facility:"stove", facilityLv:1, output:{instant_noodles:1}, input:{grain:1, clean_water:1}, time:1, label:"煮面" },

  /* 熏制房加工 */
  dried_meat_recipe:{ type:"cook", facility:"smokehouse", facilityLv:1, output:{dried_meat:1}, input:{raw_meat:2, salt:1}, time:1, label:"熏制腊肉" },
  pickled_veg_recipe:{ type:"cook", facility:"smokehouse", facilityLv:1, output:{pickled_veg:2}, input:{vegetable:3, salt:1}, time:1, label:"腌制蔬菜" },

  /* 医务室制药（新增） */
  herbal_poultice_recipe:{ type:"med", facility:"infirmary", facilityLv:1, output:{herbal_poultice:2}, input:{herb:2, cloth:1}, time:1, label:"制作草药敷料" },
  vaccine_recipe:   { type:"med", facility:"infirmary", facilityLv:2, output:{vaccine:1}, input:{meds:1, herb:3, alcohol:1}, time:1, label:"研制疫苗" },
  antidote_recipe:  { type:"med", facility:"infirmary", facilityLv:2, output:{antidote:1}, input:{herb:3, alcohol:1, components:1}, time:1, label:"配制解毒剂" },
  vitamin_recipe:   { type:"med", facility:"infirmary", facilityLv:1, output:{vitamin:2}, input:{herb:2, wild_fruit:2}, time:1, label:"提取维生素" },

  /* 工作台制造（新增） */
  spear_recipe:    { type:"craft", facility:"workshop", facilityLv:1, output:{spear:1}, input:{wood:3, scrap:2, rope:1}, time:1, label:"制长矛" },
  crossbow_recipe: { type:"craft", facility:"workshop", facilityLv:3, output:{crossbow:1}, input:{wood:4, parts:3, scrap:2, rope:1}, time:1, label:"制弩" },
  crossbow_bolt_recipe:{ type:"craft", facility:"workshop", facilityLv:1, output:{crossbow_bolt:3}, input:{wood:2, scrap:1}, time:1, label:"制弩箭" },
  shield_recipe:   { type:"craft", facility:"workshop", facilityLv:2, output:{shield:1}, input:{wood:4, scrap:2, rope:1}, time:1, label:"制盾牌" },
  leather_armor_recipe:{ type:"craft", facility:"workshop", facilityLv:3, output:{leather_armor:1}, input:{cloth:4, rope:2, scrap:2}, time:1, label:"缝制皮甲" },
  sewing_kit_recipe:{ type:"craft", facility:"workshop", facilityLv:1, output:{sewing_kit:1}, input:{cloth:2, scrap:1, rope:1}, time:1, label:"制针线包" },

  /* 军械台制造 */
  gunpowder_recipe:{ type:"craft", facility:"armory", facilityLv:1, output:{gunpowder:2}, input:{scrap:3, components:2}, time:1, label:"制火药" },
  ammo_recipe_adv: { type:"craft", facility:"armory", facilityLv:1, output:{ammo:5}, input:{gunpowder:2, scrap:3, parts:1}, time:1, label:"装填弹药" },
  machete_recipe:  { type:"craft", facility:"armory", facilityLv:1, output:{machete:1}, input:{steel:2, scrap:3, components:2}, time:1, label:"锻砍刀" },
  riot_helmet_recipe:{ type:"craft", facility:"armory", facilityLv:1, output:{riot_helmet:1}, input:{steel:2, components:3, cloth:1}, time:1, label:"制防暴头盔" },
  grenade_recipe:  { type:"craft", facility:"armory", facilityLv:2, output:{grenade:1}, input:{gunpowder:3, scrap:3, parts:2}, time:1, label:"制手榴弹" }
};

/* 设施建造/升级的可用材料校验由 engine 完成；此处仅定义数据 */
