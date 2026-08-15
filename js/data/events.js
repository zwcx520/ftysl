/* =====================================================================
 * 废土余生录 · 随机事件 events.js
 * event: id category weight(每日权重) trigger{minDay,maxDay,chance}
 *        text choices[{id,label,require(可选),outcomes[{chance,effects,log}]}]
 * effects 类型由 engine.js 的 applyEffect 解析
 * ===================================================================== */
window.GameData = window.GameData || {};

GameData.events = {
  /* ============ 灾难类 ============ */
  raid: {
    id:"raid", name:"夜袭", category:"disaster", weight:0,
    trigger:{minDay:4, chance:0.25, modifiers:{reinforced_door:0.4, watchtower:0.7}},
    text:"夜幕深沉，门外传来粗暴的砸门声与咒骂。一群武装劫匪盯上了你的避难所！",
    choices:[
      { id:"fight", label:"持械死战", require:{weapon:true},
        outcomes:[
          { chance:0.55, effects:[{type:"change_stat",stat:"hp",value:-15},{type:"add_condition",condition:"wounded",duration:1},{type:"morale_event",kind:"good",value:1}], log:"你浴血搏杀，击退了劫匪，但自己也挂了彩。" },
          { chance:0.3,  effects:[{type:"lose_items",count:2},{type:"change_stat",stat:"hp",value:-10},{type:"change_stat",stat:"morale",value:-8}], log:"劫匪抢走了一些物资，打伤了你后扬长而去。" },
          { chance:0.15, effects:[{type:"change_stat",stat:"hp",value:-35},{type:"lose_items",count:3},{type:"change_stat",stat:"morale",value:-15}], log:"寡不敌众，劫匪洗劫了避难所，你身负重伤。" }
        ] },
      { id:"guard", label:"据守瞭望塔", require:{facility:"watchtower"},
        outcomes:[
          { chance:0.8,  effects:[{type:"change_stat",stat:"fatigue",value:15},{type:"morale_event",kind:"good",value:1}], log:"瞭望塔上你早有防备，劫匪见状退去，只是熬了一夜。" },
          { chance:0.2,  effects:[{type:"lose_items",count:1},{type:"change_stat",stat:"hp",value:-8}], log:"劫匪强攻未果，但抢走了门口的一点东西。" }
        ] },
      { id:"hide", label:"熄灯躲藏",
        outcomes:[
          { chance:0.5,  effects:[{type:"lose_items",count:3},{type:"change_stat",stat:"morale",value:-10}], log:"你屏息躲藏，劫匪搜刮了一番后离去，损失不小。" },
          { chance:0.5,  effects:[{type:"lose_items",count:1},{type:"change_stat",stat:"morale",value:-5}], log:"劫匪只翻到一点零碎，很快撤走了。" }
        ] }
    ]
  },

  cold_snap: {
    id:"cold_snap", name:"寒潮", category:"weather", weight:0,
    trigger:{minDay:8, chance:0.2, season:"winter"},
    text:"气温骤降，寒风从破窗灌入，室内呵气成霜。没有火源，人会被活活冻僵。",
    choices:[
      { id:"burn", label:"生火取暖", require:{item:"firewood",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"firewood",count:1},{type:"change_stat",stat:"fatigue",value:5}], log:"你燃起木柴，火光中寒意退去，平安度过了寒夜。" }] },
      { id:"alcohol", label:"饮酒御寒", require:{item:"alcohol",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"alcohol",count:1},{type:"change_stat",stat:"morale",value:6}], log:"烈酒入喉暖身，你蜷缩着熬过了寒夜。" }] },
      { id:"endure", label:"硬扛过去",
        outcomes:[
          { chance:0.6, effects:[{type:"change_stat",stat:"hp",value:-12},{type:"add_condition",condition:"sick",duration:2}], log:"你在严寒中瑟瑟发抖，染上了风寒。" },
          { chance:0.4, effects:[{type:"change_stat",stat:"hp",value:-5},{type:"change_stat",stat:"fatigue",value:10}], log:"冷得彻骨，但总算撑了过来。" }
        ] }
    ]
  },

  blizzard: {
    id:"blizzard", name:"暴风雪", category:"weather", weight:0,
    trigger:{minDay:10, chance:0.15, season:"winter"},
    text:"漫天风雪封死了出路，外出已不可能。库存就是你的全部依靠。",
    choices:[
      { id:"stay", label:"闭门不出",
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"hunger",value:-8},{type:"change_stat",stat:"thirst",value:-8},{type:"set_flag",flag:"blizzard_day",value:true}], log:"风雪肆虐一日，你靠存粮度日，外出计划泡汤。" }] }
    ]
  },

  heatwave: {
    id:"heatwave", name:"热浪", category:"weather", weight:0,
    trigger:{minDay:6, chance:0.15, season:"summer"},
    text:"烈日炙烤大地，暑气蒸腾。水分流失加快，食物也更易变质。",
    choices:[
      { id:"hydrate", label:"多喝水防暑", require:{item:"clean_water",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"clean_water",count:1},{type:"change_stat",stat:"thirst",value:10}], log:"你及时补水，顶住了热浪的侵袭。" }] },
      { id:"endure", label:"省着熬",
        outcomes:[{ chance:0.7, effects:[{type:"change_stat",stat:"thirst",value:-15},{type:"change_stat",stat:"hp",value:-6}], log:"酷热难耐，你脱水虚脱，身体受损。" },
                  { chance:0.3, effects:[{type:"change_stat",stat:"thirst",value:-8}], log:"汗流浃背地熬过了热浪。" }] }
    ]
  },

  radioactive_rain: {
    id:"radioactive_rain", name:"辐射雨", category:"weather", weight:0,
    trigger:{minDay:12, chance:0.12},
    text:"天色发黄，落下的雨带着刺鼻的金属味——这是辐射雨！",
    choices:[
      { id:"mask", label:"戴防毒面具", require:{item:"gas_mask"},
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"radiation",value:2}], log:"防毒面具滤去了大部分辐射，你安然无恙。" }] },
      { id:"shelter", label:"紧闭门窗躲避",
        outcomes:[{ chance:0.8, effects:[{type:"change_stat",stat:"radiation",value:8}], log:"门窗虽挡住大雨，但辐射仍渗了进来。" },
                  { chance:0.2, effects:[{type:"change_stat",stat:"radiation",value:15},{type:"add_condition",condition:"radiation_sickness",duration:2}], log:"避之不及，辐射量骤升，你开始恶心呕吐。" }] }
    ]
  },

  /* ============ 遭遇/道德类 ============ */
  neighbor_help: {
    id:"neighbor_help", name:"邻居求助", category:"encounter", weight:0,
    trigger:{minDay:2, chance:0.18},
    text:"门外传来怯怯的敲门声，一位瘦骨嶙峋的邻居老人恳求你分一点食物。",
    choices:[
      { id:"give", label:"分给食物", require:{item:"canned_food",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"canned_food",count:1},{type:"change_stat",stat:"morale",value:8},{type:"morale_event",kind:"good",value:1},{type:"set_flag",flag:"helped_neighbor",value:true}], log:"老人含泪道谢，临走塞给你一枚旧时代的徽章。善有善报。" }] },
      { id:"refuse", label:"婉言拒绝",
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"morale",value:-6},{type:"morale_event",kind:"karma",value:1}], log:"你狠心关上了门，老人的叹息声在风中消散。良心隐隐作痛。" }] }
    ]
  },

  beggar: {
    id:"beggar", name:"乞丐", category:"encounter", weight:0,
    trigger:{minDay:3, chance:0.12},
    text:"一个衣衫褴褛的乞丐拦住你，眼中满是绝望，哀求一口水喝。",
    choices:[
      { id:"give_water", label:"递上水", require:{item:"clean_water",count:1},
        outcomes:[{ chance:0.6, effects:[{type:"remove_item",item:"clean_water",count:1},{type:"change_stat",stat:"morale",value:6},{type:"morale_event",kind:"good",value:1},{type:"add_item",item:"components",count:2}], log:"乞丐感激涕零，告诉你一处藏物资的地点作为回报。" },
                  { chance:0.4, effects:[{type:"remove_item",item:"clean_water",count:1},{type:"change_stat",stat:"morale",value:4},{type:"morale_event",kind:"good",value:1}], log:"乞丐千恩万谢地离去，你心头一暖。" }] },
      { id:"ignore", label:"视而不见",
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"morale",value:-4},{type:"morale_event",kind:"karma",value:1}], log:"你绕开乞丐径直走过，身后传来虚弱的喘息。" }] }
    ]
  },

  lost_dog: {
    id:"lost_dog", name:"流浪犬", category:"encounter", weight:0,
    trigger:{minDay:5, chance:0.1},
    text:"一只瘦骨嶙峋的流浪狗怯生生地靠近你，摇着尾巴，似乎在求收留。",
    choices:[
      { id:"adopt", label:"收留它", require:{item:"canned_food",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"canned_food",count:1},{type:"change_stat",stat:"morale",value:12},{type:"set_flag",flag:"has_dog",value:true},{type:"morale_event",kind:"good",value:1}], log:"你喂了它半罐罐头，它从此寸步不离。孤独的废土里多了个伙伴，夜里袭击损失也减小了。" }] },
      { id:"shoo", label:"驱赶它",
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"morale",value:-5}], log:"你挥挥手，狗夹着尾巴消失在废墟中。" }] },
      { id:"kill", label:"杀掉取肉",
        outcomes:[{ chance:1, effects:[{type:"add_item",item:"raw_meat",count:2},{type:"change_stat",stat:"morale",value:-20},{type:"morale_event",kind:"karma",value:2}], log:"你举起了武器……手上沾了血，胃里却满了。良心的谴责如影随形。" }] }
    ]
  },

  /* ============ 机遇类 ============ */
  free_supplies: {
    id:"free_supplies", name:"意外馈赠", category:"opportunity", weight:0,
    trigger:{minDay:3, chance:0.1},
    text:"你在避难所门口发现一个布包，附字条：“予有缘人。”里面是邻居悄悄送来的物资。",
    choices:[
      { id:"take", label:"收下",
        outcomes:[{ chance:1, effects:[{type:"add_item",item:"canned_food",count:2},{type:"add_item",item:"clean_water",count:2},{type:"add_item",item:"bandage",count:1},{type:"change_stat",stat:"morale",value:6}], log:"你收下了这份心意，倍感温暖。" }] }
    ]
  },

  skill_book: {
    id:"skill_book", name:"旧书启迪", category:"opportunity", weight:0,
    trigger:{minDay:4, chance:0.08},
    text:"闲暇时你翻开一本旧书，字里行间竟藏着实用的生存知识。",
    choices:[
      { id:"read", label:"细细研读", require:{item:"book",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"book",count:1},{type:"change_stat",stat:"morale",value:10},{type:"change_stat",stat:"fatigue",value:8},{type:"set_flag",flag:"read_book",value:true}], log:"书读罢，你豁然开朗，精神为之一振。" }] }
    ]
  },

  /* ============ 疾病类 ============ */
  food_poisoning_event: {
    id:"food_poisoning_event", name:"上吐下泻", category:"disease", weight:0,
    trigger:{minDay:3, chance:0.1},
    text:"你腹中绞痛难忍，怕是先前吃坏了东西。",
    choices:[
      { id:"meds", label:"服用药物", require:{item:"meds",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"meds",count:1},{type:"remove_condition",condition:"food_poisoning"}], log:"药到病除，你很快恢复了过来。" }] },
      { id:"herbal", label:"喝草药药", require:{item:"herbal_meds",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"herbal_meds",count:1},{type:"remove_condition",condition:"food_poisoning"}], log:"草药药起了效，症状渐渐平息。" }] },
      { id:"endure", label:"硬挺着",
        outcomes:[{ chance:0.6, effects:[{type:"change_stat",stat:"hp",value:-10},{type:"add_condition",condition:"food_poisoning",duration:2}], log:"上吐下泻折腾了一夜，身体更虚弱了。" },
                  { chance:0.4, effects:[{type:"change_stat",stat:"hp",value:-4}], log:"恶心了一阵，勉强撑了过去。" }] }
    ]
  },

  injury: {
    id:"injury", name:"意外受伤", category:"disease", weight:0,
    trigger:{minDay:2, chance:0.12},
    text:"你在修补避难所时一脚踩空，被生锈的钢筋划开了手臂，鲜血直流。",
    choices:[
      { id:"bandage", label:"包扎止血", require:{item:"bandage",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"bandage",count:1},{type:"remove_condition",condition:"bleeding"},{type:"change_stat",stat:"hp",value:5}], log:"绷带缠上伤口，血止住了，你也松了口气。" }] },
      { id:"cloth", label:"撕布条应急", require:{item:"cloth",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"cloth",count:1},{type:"remove_condition",condition:"bleeding"},{type:"add_condition",condition:"wounded",duration:1}], log:"布条草草包扎，虽止了血，伤口仍需时日愈合。" }] },
      { id:"ignore", label:"不以为意",
        outcomes:[{ chance:0.7, effects:[{type:"add_condition",condition:"bleeding",duration:2},{type:"change_stat",stat:"hp",value:-12}], log:"血越流越多，伤口开始感染。" },
                  { chance:0.3, effects:[{type:"change_stat",stat:"hp",value:-6}], log:"小伤无碍，自行止住了血。" }] }
    ]
  },

  /* ============ 商人来访 ============ */
  trader_visit: {
    id:"trader_visit", name:"游商上门", category:"opportunity", weight:0,
    trigger:{minDay:3, chance:0.22},
    text:"一辆吱呀作响的手推车停在门外，游商老弗兰科咧嘴一笑：「幸存者，生意上门了！」",
    choices:[
      { id:"trade", label:"前去交易",
        outcomes:[{ chance:1, effects:[{type:"set_flag",flag:"trader_here",value:true}], log:"弗兰科展开货物，等你挑选。打开【商店】即可交易。" }] },
      { id:"decline", label:"打发走",
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"morale",value:-2}], log:"你婉拒了生意，弗兰科推车离去。" }] }
    ]
  },

  /* ============ 新增：灾难类 ============ */
  earthquake: {
    id:"earthquake", name:"地震", category:"disaster", weight:0,
    trigger:{minDay:10, chance:0.08},
    text:"大地突然剧烈颤抖，避难所的墙壁嘎吱作响，尘土从天花板簌簌落下。地震！",
    choices:[
      { id:"reinforce", label:"紧急加固", require:{facility:"reinforced_door"},
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"fatigue",value:15},{type:"change_stat",stat:"hp",value:-5}], log:"你拼命顶住门框，虽然累得半死，但避难所保住了。" }] },
      { id:"flee", label:"冲出室外",
        outcomes:[
          { chance:0.5, effects:[{type:"change_stat",stat:"hp",value:-8},{type:"lose_items",count:1}], log:"你跌跌撞撞逃出室外，被落石擦伤，丢了一些东西。" },
          { chance:0.5, effects:[{type:"change_stat",stat:"hp",value:-3}], log:"你及时逃出，只是擦破了皮。" }
        ] },
      { id:"ride_out", label:"就地躲避",
        outcomes:[
          { chance:0.4, effects:[{type:"change_stat",stat:"hp",value:-15},{type:"lose_items",count:2},{type:"change_stat",stat:"morale",value:-10}], log:"屋顶塌了一角，砸伤了你，还砸坏了些物资。" },
          { chance:0.6, effects:[{type:"change_stat",stat:"hp",value:-5},{type:"change_stat",stat:"morale",value:-5}], log:"震感强烈但避难所撑住了，你只是受了惊吓。" }
        ] }
    ]
  },

  dust_storm: {
    id:"dust_storm", name:"沙尘暴", category:"weather", weight:0,
    trigger:{minDay:5, chance:0.12, season:"spring"},
    text:"远方地平线升起一道黄色的墙——沙尘暴来了！漫天黄沙遮天蔽日。",
    choices:[
      { id:"seal", label:"封闭门窗", require:{item:"cloth",count:2},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"cloth",count:2},{type:"change_stat",stat:"fatigue",value:10}], log:"你用布条封住所有缝隙，沙尘被挡在了外面。" }] },
      { id:"mask", label:"戴面具撑过", require:{item:"gas_mask"},
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"fatigue",value:12},{type:"change_stat",stat:"radiation",value:3}], log:"防毒面具帮你过滤了大部分沙尘，但依然疲惫不堪。" }] },
      { id:"endure", label:"硬扛",
        outcomes:[
          { chance:0.6, effects:[{type:"change_stat",stat:"hp",value:-10},{type:"add_condition",condition:"sick",duration:2}], log:"漫天沙尘呛得你几乎窒息，肺部灼痛。" },
          { chance:0.4, effects:[{type:"change_stat",stat:"hp",value:-4},{type:"change_stat",stat:"fatigue",value:15}], log:"熬过了风沙，满嘴都是土腥味。" }
        ] }
    ]
  },

  rat_swarm: {
    id:"rat_swarm", name:"鼠群侵袭", category:"disaster", weight:0,
    trigger:{minDay:6, chance:0.1},
    text:"一阵尖锐的吱吱声由远及近——成群的老鼠如潮水般涌入避难所！它们盯上了你的存粮！",
    choices:[
      { id:"fight", label:"持械驱赶", require:{weapon:true},
        outcomes:[
          { chance:0.6, effects:[{type:"change_stat",stat:"fatigue",value:12},{type:"remove_item",item:"grain",count:1}], log:"你挥舞武器击退了鼠群，只被偷走了一点粮食。" },
          { chance:0.3, effects:[{type:"change_stat",stat:"hp",value:-6},{type:"lose_items",count:1},{type:"change_stat",stat:"fatigue",value:15}], log:"鼠群疯狂反扑，你被咬了几口，还丢了些食物。" },
          { chance:0.1, effects:[{type:"change_stat",stat:"hp",value:-3},{type:"add_condition",condition:"sick",duration:1}], log:"鼠群散去，但你不慎被抓伤，担心感染。" }
        ] },
      { id:"fire", label:"点火驱赶", require:{item:"firewood",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"firewood",count:1},{type:"change_stat",stat:"fatigue",value:8}], log:"你点燃火把挥舞，鼠群惧火四散而逃。" }] },
      { id:"let_go", label:"任其扫荡",
        outcomes:[{ chance:1, effects:[{type:"lose_items",count:3},{type:"change_stat",stat:"morale",value:-8}], log:"鼠群席卷了你的存粮柜，损失惨重。" }] }
    ]
  },

  /* ============ 新增：剧情/遭遇类 ============ */
  survivor_group: {
    id:"survivor_group", name:"幸存者团体", category:"encounter", weight:0,
    trigger:{minDay:8, chance:0.1},
    text:"一支有组织的幸存者队伍找上门来，领头的中年人递上一张名片：「我们是'铁壁'幸存者联盟，邀请你加入。」",
    choices:[
      { id:"join", label:"加入联盟",
        outcomes:[
          { chance:0.5, effects:[{type:"add_item",item:"canned_food",count:3},{type:"add_item",item:"ammo",count:5},{type:"add_item",item:"bandage",count:2},{type:"change_stat",stat:"morale",value:12},{type:"set_flag",flag:"alliance_member",value:true},{type:"morale_event",kind:"good",value:1}], log:"你加入了联盟，获得了援助物资与人脉。废土不再孤单。" },
          { chance:0.3, effects:[{type:"change_stat",stat:"morale",value:6},{type:"set_flag",flag:"alliance_member",value:true}], log:"联盟欢迎了你，虽然目前物资有限，但至少有了后盾。" },
          { chance:0.2, effects:[{type:"lose_items",count:2},{type:"change_stat",stat:"morale",value:-10},{type:"morale_event",kind:"karma",value:1}], log:"所谓「联盟」不过是另一伙劫匪的幌子，他们抢了你的东西扬长而去。" }
        ] },
      { id:"decline", label:"婉言谢绝",
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"morale",value:-3}], log:"你谢绝了邀请。独行的路虽难，但至少不必受人摆布。" }] },
      { id:"trade_with", label:"提出交易",
        outcomes:[
          { chance:0.7, effects:[{type:"set_flag",flag:"trader_here",value:true}], log:"对方同意交易，你打开【商店】看看他们有什么好货。" },
          { chance:0.3, effects:[{type:"change_stat",stat:"morale",value:-5}], log:"对方不屑地拒绝了交易，转身离去。" }
        ] }
    ]
  },

  old_friend: {
    id:"old_friend", name:"旧友重逢", category:"encounter", weight:0,
    trigger:{minDay:7, chance:0.07},
    text:"门外站着一个衣衫褴褛的身影，你揉了揉眼——竟是旧日的好友老周！他形容枯槁，眼中却闪着泪光：「没想到你还活着……」",
    choices:[
      { id:"welcome", label:"收留老周", require:{item:"canned_food",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"canned_food",count:1},{type:"change_stat",stat:"morale",value:20},{type:"set_flag",flag:"has_companion",value:true},{type:"morale_event",kind:"good",value:2},{type:"add_item",item:"components",count:3}], log:"老周感激涕零地留下。他懂些修理手艺，还能帮你守夜。废土路上多了一个可信的人。" }] },
      { id:"give_supplies", label:"给物资送走",
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"canned_food",count:1},{type:"remove_item",item:"clean_water",count:1},{type:"change_stat",stat:"morale",value:8},{type:"morale_event",kind:"good",value:1}], log:"你塞给老周一些物资送他上路。他紧紧握了握你的手，消失在废墟中。" }] },
      { id:"refuse", label:"闭门不见",
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"morale",value:-15},{type:"morale_event",kind:"karma",value:2}], log:"你狠心没有开门。老周的敲门声渐渐远去，你的心也沉了下去。" }] }
    ]
  },

  supply_drop: {
    id:"supply_drop", name:"空投物资", category:"opportunity", weight:0,
    trigger:{minDay:9, chance:0.08},
    text:"远处天空传来轰鸣，一个红白相间的降落伞缓缓飘落——是军用空投箱！落点就在几个街区外。",
    choices:[
      { id:"rush", label:"立刻冲过去抢",
        outcomes:[
          { chance:0.4, effects:[{type:"add_item",item:"dried_food",count:3},{type:"add_item",item:"medkit",count:1},{type:"add_item",item:"ammo",count:8},{type:"add_item",item:"radaway",count:1},{type:"change_stat",stat:"fatigue",value:15}], log:"你抢先一步夺得空投箱！满载而归，发了一笔横财！" },
          { chance:0.35, effects:[{type:"add_item",item:"canned_food",count:2},{type:"add_item",item:"ammo",count:4},{type:"change_stat",stat:"fatigue",value:15}], log:"你赶到时箱子已被撬开，但还剩了些物资。" },
          { chance:0.25, effects:[{type:"change_stat",stat:"hp",value:-18},{type:"change_stat",stat:"fatigue",value:20},{type:"change_stat",stat:"morale",value:-8}], log:"你与人争夺空投时被打了一顿，什么也没捞到。" }
        ] },
      { id:"wait", label:"观望再说",
        outcomes:[
          { chance:0.6, effects:[{type:"change_stat",stat:"morale",value:-5}], log:"等你赶到时，空投箱早已被搬空，只留下一地狼藉。" },
          { chance:0.4, effects:[{type:"add_item",item:"components",count:5},{type:"add_item",item:"bandage",count:1}], log:"捡了些别人剩下的零碎，聊胜于无。" }
        ] }
    ]
  },

  mental_breakdown: {
    id:"mental_breakdown", name:"精神崩溃", category:"disease", weight:0,
    trigger:{minDay:6, chance:0.1},
    text:"长期的孤独与恐惧终于压垮了你。你蜷缩在角落里，浑身发抖，脑海中不断闪回灾变那天的画面……",
    choices:[
      { id:"read", label:"翻看旧照片/书", require:{item:"book",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"book",count:1},{type:"change_stat",stat:"morale",value:20}], log:"你翻看着旧书与照片，回忆起曾经的温暖，心渐渐平静下来。" }] },
      { id:"drink", label:"借酒浇愁", require:{item:"alcohol",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"alcohol",count:1},{type:"change_stat",stat:"morale",value:15},{type:"change_stat",stat:"hp",value:-3}], log:"烈酒灌下去，世界模糊了。虽然伤身，但至少暂时忘了痛苦。" }] },
      { id:"smoke", label:"点根烟", require:{item:"cigarettes",count:1},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"cigarettes",count:1},{type:"change_stat",stat:"morale",value:12}], log:"尼古丁入肺，紧绷的神经松弛了些许。" }] },
      { id:"endure", label:"默默忍受",
        outcomes:[
          { chance:0.5, effects:[{type:"change_stat",stat:"morale",value:-15},{type:"change_stat",stat:"hp",value:-5}], log:"你在黑暗中独自煎熬了一夜，精神更加萎靡。" },
          { chance:0.5, effects:[{type:"change_stat",stat:"morale",value:-8}], log:"咬牙挺了过来，但心里的裂痕更深了。" }
        ] }
    ]
  },

  mystery_cache: {
    id:"mystery_cache", name:"神秘储藏", category:"opportunity", weight:0,
    trigger:{minDay:10, chance:0.06},
    text:"你在废墟深处发现一面被刻意封死的墙，墙上有用刀刻的记号——有人在这里藏了东西！",
    choices:[
      { id:"break", label:"撬开墙壁", require:{item:"crowbar"},
        outcomes:[
          { chance:0.5, effects:[{type:"add_item",item:"gold_bar",count:1},{type:"add_item",item:"jewelry",count:2},{type:"change_stat",stat:"morale",value:15}], log:"墙壁被撬开，里面是个保险箱！金条与珠宝在火光中闪耀！" },
          { chance:0.3, effects:[{type:"add_item",item:"medkit",count:2},{type:"add_item",item:"radaway",count:2},{type:"add_item",item:"ammo",count:6}], log:"墙后是个医疗储藏点，药品弹药一应俱全。" },
          { chance:0.2, effects:[{type:"change_stat",stat:"hp",value:-10},{type:"add_condition",condition:"bleeding",duration:1}], log:"墙壁突然塌方，你被碎石砸伤，里面什么也没有。" }
        ] },
      { id:"ignore", label:"不冒险",
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"morale",value:-3}], log:"你选择不冒险，但心中始终惦记着墙后的秘密。" }] }
    ]
  },

  plague: {
    id:"plague", name:"瘟疫蔓延", category:"disaster", weight:0,
    trigger:{minDay:12, chance:0.07},
    text:"收音机里传来沉重的播报：「……不明瘟疫正在南区蔓延，感染者高烧不退……请幸存者做好隔离防护……」",
    choices:[
      { id:"vaccine", label:"注射疫苗", require:{item:"vaccine"},
        outcomes:[{ chance:1, effects:[{type:"remove_item",item:"vaccine",count:1},{type:"set_flag",flag:"vaccinated",value:true},{type:"change_stat",stat:"morale",value:10}], log:"你注射了疫苗，获得了免疫保护，心中安定了许多。" }] },
      { id:"isolate", label:"封闭避难所",
        outcomes:[
          { chance:0.7, effects:[{type:"change_stat",stat:"morale",value:-5},{type:"change_stat",stat:"fatigue",value:8}], log:"你紧闭门户自我隔离，虽然无聊但保住了健康。" },
          { chance:0.3, effects:[{type:"add_condition",condition:"sick",duration:3},{type:"change_stat",stat:"hp",value:-8}], log:"尽管封闭了，你还是出现了发热症状……" }
        ] },
      { id:"risk", label:"不以为意",
        outcomes:[
          { chance:0.5, effects:[{type:"add_condition",condition:"infection",duration:3},{type:"change_stat",stat:"hp",value:-15}], log:"你大意了，高烧袭来，全身剧痛——感染了瘟疫！" },
          { chance:0.5, effects:[{type:"change_stat",stat:"hp",value:-3}], log:"侥幸没有感染，只是虚惊一场。" }
        ] }
    ]
  },

  caravan: {
    id:"caravan", name:"商队经过", category:"opportunity", weight:0,
    trigger:{minDay:7, chance:0.09},
    text:"一支大型商队隆隆驶过街道，押车的武装人员警惕地扫视四周。领头的高喊：「路过的买卖人，有好货便宜卖！」",
    choices:[
      { id:"buy", label:"上前采购",
        outcomes:[{ chance:1, effects:[{type:"set_flag",flag:"trader_here",value:true}], log:"商队停了下来，打开【商店】即可选购他们的货品。" }] },
      { id:"steal", label:"趁乱偷窃",
        outcomes:[
          { chance:0.3, effects:[{type:"add_item",item:"ammo",count:5},{type:"add_item",item:"canned_food",count:2},{type:"morale_event",kind:"karma",value:1}], log:"你趁护卫不注意摸走了一些物资，心跳如鼓。" },
          { chance:0.7, effects:[{type:"change_stat",stat:"hp",value:-20},{type:"add_condition",condition:"bleeding",duration:2},{type:"morale_event",kind:"karma",value:1}], log:"你被护卫发现了！一顿毒打差点丢了命。" }
        ] },
      { id:"wave", label:"挥手目送",
        outcomes:[{ chance:1, effects:[{type:"change_stat",stat:"morale",value:2}], log:"你目送商队远去，车辙印在尘土中渐渐模糊。" }] }
    ]
  }
};

/* 每日随机事件池（按权重抽取，trigger 过滤） */
GameData.dailyEventPool = [
  "raid","cold_snap","blizzard","heatwave","radioactive_rain",
  "neighbor_help","beggar","lost_dog","free_supplies","skill_book",
  "food_poisoning_event","injury","trader_visit",
  "earthquake","dust_storm","rat_swarm","survivor_group","old_friend",
  "supply_drop","mental_breakdown","mystery_cache","plague","caravan"
];
