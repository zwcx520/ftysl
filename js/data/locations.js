/* =====================================================================
 * 废土余生录 · 搜刮地点 locations.js
 * 每个地点：name icon danger desc loot[{item,chance,min,max}]
 *           encounter{chance, table[{type,weight}]} unlockDay requires
 * ===================================================================== */
window.GameData = window.GameData || {};

GameData.locations = {
  abandoned_house: {
    id:"abandoned_house", name:"废弃民宅", icon:"fa-solid fa-house-chimney-window",
    danger:1, unlockDay:1, requires:null,
    desc:"一栋半塌的居民楼，门框歪斜，地上散落着逃难者遗弃的杂物。空气中飘着陈腐的霉味。",
    loot:[
      {item:"canned_food", chance:0.55, min:1, max:2},
      {item:"clean_water", chance:0.45, min:1, max:2},
      {item:"components",  chance:0.6,  min:1, max:3},
      {item:"cloth",       chance:0.5,  min:1, max:3},
      {item:"wood",        chance:0.4,  min:1, max:2},
      {item:"bandage",     chance:0.2,  min:0, max:1},
      {item:"rotten_food", chance:0.3,  min:0, max:1}
    ],
    encounter:{ chance:0.2, table:[
      {type:"friendly_survivor", weight:25},
      {type:"beggar", weight:15},
      {type:"hostile_bandit", weight:20},
      {type:"none", weight:40}
    ]}
  },
  supermarket: {
    id:"supermarket", name:"废弃超市", icon:"fa-solid fa-cart-shopping",
    danger:2, unlockDay:1, requires:null,
    desc:"货架倾倒，碎玻璃铺满地面。曾是物资丰饶之地，如今也引来了觊觎的目光。",
    loot:[
      {item:"canned_food",   chance:0.8, min:2, max:4},
      {item:"bottled_water", chance:0.5, min:1, max:3},
      {item:"clean_water",   chance:0.6, min:1, max:3},
      {item:"cigarettes",    chance:0.3, min:0, max:2},
      {item:"coffee",        chance:0.25,min:0, max:1},
      {item:"medkit",        chance:0.1, min:0, max:1}
    ],
    encounter:{ chance:0.45, table:[
      {type:"hostile_bandit", weight:35},
      {type:"military_patrol",weight:15},
      {type:"friendly_survivor",weight:15},
      {type:"none", weight:35}
    ]}
  },
  pharmacy: {
    id:"pharmacy", name:"药店", icon:"fa-solid fa-prescription-bottle-medical",
    danger:3, unlockDay:2, requires:null,
    desc:"药房的卷帘门被撬开，药柜十室九空，但角落里或许还藏着救命之物。",
    loot:[
      {item:"bandage",    chance:0.7, min:1, max:3},
      {item:"meds",       chance:0.5, min:0, max:2},
      {item:"herbal_meds",chance:0.6, min:1, max:2},
      {item:"radaway",    chance:0.3, min:0, max:1},
      {item:"painkiller", chance:0.5, min:1, max:2},
      {item:"medkit",     chance:0.2, min:0, max:1}
    ],
    encounter:{ chance:0.4, table:[
      {type:"hostile_bandit", weight:40},
      {type:"military_patrol",weight:10},
      {type:"none", weight:50}
    ]}
  },
  gas_station: {
    id:"gas_station", name:"加油站", icon:"fa-solid fa-gas-pump",
    danger:2, unlockDay:2, requires:null,
    desc:"加油机锈迹斑斑，地下储油罐却未必干涸。火星四溅的风险时刻存在。",
    loot:[
      {item:"fuel",     chance:0.8, min:2, max:4},
      {item:"firewood", chance:0.4, min:1, max:2},
      {item:"components",chance:0.5, min:1, max:3},
      {item:"bottled_water",chance:0.4,min:0,max:2},
      {item:"cigarettes",chance:0.3, min:0, max:2}
    ],
    encounter:{ chance:0.4, table:[
      {type:"hostile_bandit", weight:30},
      {type:"fire_hazard",    weight:10},
      {type:"none", weight:60}
    ]}
  },
  warehouse: {
    id:"warehouse", name:"仓库", icon:"fa-solid fa-warehouse",
    danger:3, unlockDay:3, requires:null,
    desc:"高耸的钢结构仓库，铁门紧锁。里面堆满了旧世界的建材与零件。",
    loot:[
      {item:"components", chance:0.85,min:3, max:6},
      {item:"parts",      chance:0.6, min:1, max:3},
      {item:"wood",       chance:0.7, min:2, max:4},
      {item:"cement",     chance:0.5, min:1, max:2},
      {item:"scrap",      chance:0.7, min:2, max:5},
      {item:"electronics",chance:0.3, min:0, max:1}
    ],
    encounter:{ chance:0.45, table:[
      {type:"hostile_bandit", weight:40},
      {type:"military_patrol",weight:10},
      {type:"none", weight:50}
    ]}
  },
  police_station: {
    id:"police_station", name:"警察局", icon:"fa-solid fa-building-shield",
    danger:4, unlockDay:4, requires:"map",
    desc:"警徽蒙尘的派出所，武器库的铁门需要撬开。这里也是匪徒经常出没之地。",
    loot:[
      {item:"pistol",  chance:0.4, min:0, max:1},
      {item:"ammo",    chance:0.7, min:2, max:5},
      {item:"vest",    chance:0.3, min:0, max:1},
      {item:"helmet",  chance:0.35,min:0, max:1},
      {item:"medkit",  chance:0.3, min:0, max:1},
      {item:"rifle",   chance:0.15,min:0, max:1}
    ],
    encounter:{ chance:0.55, table:[
      {type:"hostile_bandit", weight:45},
      {type:"military_patrol",weight:20},
      {type:"none", weight:35}
    ]}
  },
  military_outpost: {
    id:"military_outpost", name:"军事哨所", icon:"fa-solid fa-shield",
    danger:5, unlockDay:6, requires:"map",
    desc:"沙袋掩体与铁丝网构成的哨所，残存的军火与药品令人垂涎，但驻守者火力凶猛。",
    loot:[
      {item:"rifle",    chance:0.4, min:0, max:1},
      {item:"ammo",     chance:0.8, min:3, max:6},
      {item:"vest",     chance:0.4, min:0, max:1},
      {item:"helmet",   chance:0.4, min:0, max:1},
      {item:"medkit",   chance:0.5, min:1, max:2},
      {item:"radaway",  chance:0.4, min:1, max:2},
      {item:"dried_food",chance:0.6,min:1, max:2}
    ],
    encounter:{ chance:0.65, table:[
      {type:"military_patrol",weight:55},
      {type:"hostile_bandit", weight:15},
      {type:"none", weight:30}
    ]}
  },
  hospital: {
    id:"hospital", name:"医院", icon:"fa-solid fa-hospital",
    danger:2, unlockDay:5, requires:"map",
    desc:"惨白的医院走廊弥漫着消毒水与血腥气。这里药品最多，但也常有染病者游荡。",
    loot:[
      {item:"medkit",   chance:0.5, min:1, max:2},
      {item:"meds",     chance:0.7, min:1, max:3},
      {item:"bandage",  chance:0.8, min:2, max:4},
      {item:"radaway",  chance:0.4, min:0, max:2},
      {item:"painkiller",chance:0.7,min:1, max:3},
      {item:"alcohol",  chance:0.4, min:0, max:2}
    ],
    encounter:{ chance:0.35, table:[
      {type:"diseased",  weight:30},
      {type:"friendly_survivor",weight:20},
      {type:"none", weight:50}
    ]}
  },
  construction_site: {
    id:"construction_site", name:"建筑工地", icon:"fa-solid fa-helmet-safety",
    danger:2, unlockDay:3, requires:null,
    desc:"半成型的混凝土骨架，脚手架林立。建材与工具俯拾皆是，但坍塌隐患四伏。",
    loot:[
      {item:"cement",    chance:0.8, min:2, max:4},
      {item:"components",chance:0.7, min:2, max:4},
      {item:"parts",     chance:0.5, min:1, max:2},
      {item:"scrap",     chance:0.7, min:2, max:4},
      {item:"wood",      chance:0.6, min:1, max:3},
      {item:"helmet",    chance:0.25,min:0, max:1}
    ],
    encounter:{ chance:0.35, table:[
      {type:"hostile_bandit", weight:30},
      {type:"collapse",   weight:10},
      {type:"none", weight:60}
    ]}
  },
  church: {
    id:"church", name:"教堂", icon:"fa-solid fa-church",
    danger:1, unlockDay:4, requires:null,
    desc:"彩窗破碎的教堂，烛火摇曳。这里偶有避难者聚集，是难得的安宁之地与精神寄托。",
    loot:[
      {item:"book",       chance:0.6, min:1, max:2},
      {item:"canned_food",chance:0.4, min:0, max:2},
      {item:"clean_water",chance:0.4, min:0, max:2},
      {item:"jewelry",    chance:0.15,min:0, max:1},
      {item:"cloth",      chance:0.5, min:1, max:2}
    ],
    encounter:{ chance:0.4, table:[
      {type:"friendly_survivor",weight:35},
      {type:"beggar", weight:25},
      {type:"moral_event",  weight:10},
      {type:"none", weight:30}
    ]}
  },
  subway_station: {
    id:"subway_station", name:"地铁站", icon:"fa-solid fa-train-subway",
    danger:4, unlockDay:5, requires:"map",
    desc:"幽暗的地铁隧道延伸向未知深处，空气中弥漫着霉湿与铁锈。隧道深处似有回响……",
    loot:[
      {item:"components",  chance:0.7, min:2, max:5},
      {item:"electronics", chance:0.5, min:1, max:2},
      {item:"bottled_water",chance:0.4,min:1, max:2},
      {item:"canned_food", chance:0.5, min:1, max:2},
      {item:"rope",        chance:0.4, min:1, max:2},
      {item:"battery",     chance:0.5, min:1, max:3},
      {item:"plastic",     chance:0.6, min:1, max:3}
    ],
    encounter:{ chance:0.5, table:[
      {type:"hostile_bandit", weight:25},
      {type:"diseased",       weight:25},
      {type:"collapse",       weight:10},
      {type:"none", weight:40}
    ]}
  },
  school: {
    id:"school", name:"学校", icon:"fa-solid fa-school",
    danger:2, unlockDay:4, requires:null,
    desc:"操场上长满了荒草，教学楼的窗户黑洞洞的。教室里的课桌还保持着大灾变当日的模样。",
    loot:[
      {item:"book",       chance:0.7, min:1, max:3},
      {item:"canned_food",chance:0.4, min:0, max:2},
      {item:"cloth",      chance:0.5, min:1, max:3},
      {item:"wood",       chance:0.5, min:1, max:3},
      {item:"seeds",      chance:0.3, min:0, max:2},
      {item:"diary",      chance:0.2, min:0, max:1},
      {item:"photo",      chance:0.15,min:0, max:1}
    ],
    encounter:{ chance:0.3, table:[
      {type:"friendly_survivor",weight:30},
      {type:"beggar", weight:15},
      {type:"hostile_bandit", weight:15},
      {type:"none", weight:40}
    ]}
  },
  factory: {
    id:"factory", name:"工厂", icon:"fa-solid fa-industry",
    danger:4, unlockDay:5, requires:"map",
    desc:"高耸的烟囱不再冒烟，厂房里散落着机床与半成品。金属碰撞声在空旷中回荡。",
    loot:[
      {item:"steel",       chance:0.7, min:2, max:4},
      {item:"parts",       chance:0.7, min:2, max:4},
      {item:"components",  chance:0.6, min:2, max:5},
      {item:"scrap",       chance:0.8, min:3, max:6},
      {item:"copper_wire", chance:0.5, min:1, max:3},
      {item:"fuel",        chance:0.4, min:1, max:2},
      {item:"toolkit",     chance:0.15,min:0, max:1}
    ],
    encounter:{ chance:0.5, table:[
      {type:"hostile_bandit", weight:35},
      {type:"fire_hazard",    weight:15},
      {type:"collapse",       weight:10},
      {type:"none", weight:40}
    ]}
  },
  temple: {
    id:"temple", name:"庙宇", icon:"fa-solid fa-place-of-worship",
    danger:1, unlockDay:6, requires:null,
    desc:"山门半掩的古刹，佛堂里香炉犹温。住持不知去向，案上供果已成干尸。灵异与安详并存之地。",
    loot:[
      {item:"herb",       chance:0.6, min:1, max:3},
      {item:"book",       chance:0.5, min:1, max:2},
      {item:"incense",    chance:0.4, min:0, max:2},
      {item:"canned_food",chance:0.3, min:0, max:1},
      {item:"jewelry",    chance:0.2, min:0, max:1},
      {item:"wild_fruit", chance:0.5, min:1, max:2},
      {item:"mushroom",   chance:0.4, min:0, max:2}
    ],
    encounter:{ chance:0.35, table:[
      {type:"friendly_survivor",weight:30},
      {type:"moral_event",  weight:15},
      {type:"beggar", weight:15},
      {type:"none", weight:40}
    ]}
  },
  sewer: {
    id:"sewer", name:"下水道", icon:"fa-solid fa-water",
    danger:5, unlockDay:7, requires:"map",
    desc:"黑暗潮湿的地下管道，污水横流，鼠群四窜。恶臭几乎令人窒息，但据说有人在此藏了大量物资。",
    loot:[
      {item:"components",  chance:0.6, min:2, max:5},
      {item:"scrap",       chance:0.7, min:2, max:5},
      {item:"gunpowder",   chance:0.3, min:0, max:2},
      {item:"medicine_bottle",chance:0.2,min:0,max:1},
      {item:"rope",        chance:0.4, min:1, max:2},
      {item:"plastic",     chance:0.5, min:1, max:3},
      {item:"gold_bar",    chance:0.05,min:0, max:1}
    ],
    encounter:{ chance:0.6, table:[
      {type:"diseased",       weight:30},
      {type:"hostile_bandit", weight:20},
      {type:"none", weight:50}
    ]}
  },
  park: {
    id:"park", name:"荒野公园", icon:"fa-solid fa-tree",
    danger:1, unlockDay:2, requires:null,
    desc:"曾经的城市绿肺如今杂草丛生，灌木疯长。溪流还在流淌，偶尔能觅得野果与草药。",
    loot:[
      {item:"wild_fruit", chance:0.7, min:1, max:3},
      {item:"herb",       chance:0.6, min:1, max:2},
      {item:"mushroom",   chance:0.5, min:0, max:2},
      {item:"wood",       chance:0.5, min:1, max:3},
      {item:"seeds",      chance:0.4, min:0, max:2},
      {item:"fish",       chance:0.3, min:0, max:1}
    ],
    encounter:{ chance:0.25, table:[
      {type:"friendly_survivor",weight:20},
      {type:"beggar", weight:15},
      {type:"none", weight:65}
    ]}
  },
  power_plant: {
    id:"power_plant", name:"发电站", icon:"fa-solid fa-bolt",
    danger:5, unlockDay:8, requires:"map",
    desc:"冷却塔巍然矗立，控制室面板早已黑屏。辐射警告标志随处可见，但电气元件堆积如山。",
    loot:[
      {item:"electronics",  chance:0.8, min:2, max:4},
      {item:"copper_wire",  chance:0.7, min:2, max:4},
      {item:"battery",      chance:0.6, min:2, max:4},
      {item:"parts",        chance:0.6, min:1, max:3},
      {item:"battery_pack", chance:0.3, min:0, max:2},
      {item:"steel",        chance:0.5, min:1, max:3}
    ],
    encounter:{ chance:0.55, table:[
      {type:"military_patrol",weight:30},
      {type:"hostile_bandit", weight:15},
      {type:"none", weight:55}
    ]}
  },
  library: {
    id:"library", name:"图书馆", icon:"fa-solid fa-book-bookmark",
    danger:1, unlockDay:3, requires:null,
    desc:"书架倾倒如多米诺骨牌，空气中飘着纸张的霉味。这里是旧世界知识的坟墓，也是精神的矿藏。",
    loot:[
      {item:"book",     chance:0.9, min:2, max:4},
      {item:"map",      chance:0.2, min:0, max:1},
      {item:"paper",    chance:0.7, min:1, max:3},
      {item:"cloth",    chance:0.4, min:1, max:2},
      {item:"letter",   chance:0.25,min:0, max:1},
      {item:"compass",  chance:0.1, min:0, max:1}
    ],
    encounter:{ chance:0.25, table:[
      {type:"friendly_survivor",weight:25},
      {type:"none", weight:75}
    ]}
  },
  gas_station_rural: {
    id:"gas_station_rural", name:"乡道加油站", icon:"fa-solid fa-gas-pump",
    danger:2, unlockDay:6, requires:null,
    desc:"远离城区的乡道旁，一座小型加油站孤零零地立着。便利店的卷帘门半开，加油机旁停着辆锈车。",
    loot:[
      {item:"fuel",        chance:0.8, min:2, max:4},
      {item:"firewood",    chance:0.4, min:1, max:2},
      {item:"canned_food", chance:0.5, min:1, max:2},
      {item:"cigarettes",  chance:0.3, min:0, max:2},
      {item:"bottled_water",chance:0.4,min:0, max:2},
      {item:"coffee",      chance:0.2, min:0, max:1}
    ],
    encounter:{ chance:0.35, table:[
      {type:"hostile_bandit", weight:25},
      {type:"fire_hazard",    weight:10},
      {type:"friendly_survivor",weight:15},
      {type:"none", weight:50}
    ]}
  }
};

/* 遭遇类型 → 引擎处理标签（用于 engine.js 解析） */
GameData.encounterTypes = {
  hostile_survivor:  { name:"武装劫匪",   combat:true,  icon:"fa-solid fa-skull" },
  hostile_bandit:    { name:"劫匪",       combat:true,  icon:"fa-solid fa-skull-crossbones" },
  military_patrol:   { name:"军队巡逻队", combat:true,  icon:"fa-solid fa-shield" },
  friendly_survivor: { name:"友善幸存者", trade:true,   icon:"fa-solid fa-user" },
  beggar:            { name:"乞讨者",     moral:true,   icon:"fa-solid fa-hand-holding" },
  diseased:          { name:"染病者",     danger:true,  icon:"fa-solid fa-virus" },
  fire_hazard:       { name:"火灾隐患",   hazard:true,  icon:"fa-solid fa-fire" },
  collapse:          { name:"建筑坍塌",   hazard:true,  icon:"fa-solid fa-house-crack" },
  moral_event:       { name:"道德抉择",   moral:true,   icon:"fa-solid fa-scale-balanced" },
  none:              { name:"平安无事",   combat:false, icon:"fa-solid fa-feather" }
};
