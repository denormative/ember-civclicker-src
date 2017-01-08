import Ember from 'ember';

/* global onInvade addUITable
homeUnits:true armyUnits:true addUpgradeRows normalUpgrades:true addWonderSelectText
makeDeitiesTables load renameRuler updateSettings tickAutosave
doFarmers doWoodcutters doMiners doBlacksmiths doTanners doClerics doStarve
resourceData doMobs doPestControl tickGlory doShades doEsiege civData:true
doRaid doGraveyards doHealers doCorpses doThrone tickGrace tickWalk
doLabourers tickTraders updateResourceTotals testAchievements
updateUpgrades updateResourceRows updateBuildingButtons updateJobButtons
updatePartyButtons updatePopulationUI updateTargets updateDevotion
updateWonder updateReset onPurchase VersionData*/

/* global indexArrayByAttr CivObj civDataTable
augmentCivData buildingData:true upgradeData:true powerData:true
unitData:true sackable:true lootable:true killable:true gameLog prettify
resourceData:true */

export default Ember.Service.extend({

  init() {
    this._super(...arguments);
  },
  postinit() {
    //FIXME: this should eventually be put into init but we're kinda hacky at the moment
    this.initConstants();
    console.log("post window.cc");
  },
  test() {
    console.log("test!");
  },
  onInvade(target) {
    console.log("civ.invade");
    onInvade(target);
  },
  initCivClicker() {
    // Start of init program code

    addUITable(homeUnits, "jobs"); // Dynamically create the job controls table.
    addUITable(armyUnits, "party"); // Dynamically create the party controls table.
    addUpgradeRows(); // This sets up the framework for the upgrade items.
    addUITable(normalUpgrades, "upgrades"); // Place the stubs for most upgrades under the upgrades tab.
    addWonderSelectText();
    makeDeitiesTables();

    if (!load("localStorage")) { //immediately attempts to load
      //Prompt player for names
      this.renameCiv();
      renameRuler();
    }
    updateSettings();

    this.tick();
  },
  tick(){
    var self = this;
    // window.EmberCivclicker.apptest();
    this.runLoop();
    Ember.run.later(function(){
      self.tick();
    }, 1000);
  },
  runLoop() {
    // This sets up the main game loop, which is scheduled to execute once per second.
    //debugging - mark beginning of loop execution
    //var start = new Date().getTime();

    tickAutosave();

    // Production workers do their thing.
    doFarmers();
    doWoodcutters();
    doMiners();
    doBlacksmiths();
    doTanners();
    doClerics();

    // Check for starvation
    doStarve();
    //xxx Need to kill workers who die from exposure.

    //Resources occasionally go above their caps.
    //Cull the excess /after/ other workers have taken their inputs.
    resourceData.forEach( function(elem){ if (elem.owned > elem.limit) { elem.owned = elem.limit; } });

    //Timers - routines that do not occur every second
    doMobs();
    doPestControl();
    tickGlory();
    doShades();
    doEsiege(civData.esiege, civData.fortification);
    doRaid("party","player","enemy");

    //Population-related
    doGraveyards();
    doHealers();
    doCorpses();
    doThrone();
    tickGrace();
    tickWalk();
    doLabourers();
    tickTraders();

    updateResourceTotals(); //This is the point where the page is updated with new resource totals
    testAchievements();

    //Data changes should be done; now update the UI.
    updateUpgrades();
    updateResourceRows(); //Update resource display
    updateBuildingButtons();
    updateJobButtons();
    updatePartyButtons();
    updatePopulationUI();
    updateTargets();
    updateDevotion();
    updateWonder();
    updateReset();

    //Debugging - mark end of main loop and calculate delta in milliseconds
    //var end = new Date().getTime();
    //var time = end - start;
    //console.log("Main loop execution time: " + time + "ms");
  },
  actions: {
    onInvade(event) {
      onInvade(event.target);
    },
    onPurchase(event) {
      onPurchase(event.target);
    },
    //This function is called every time a player clicks on a primary resource button
    increment(objId){
      var purchaseObj = civData[objId];
      if (!purchaseObj) { console.log("Unknown purchase: "+objId); return; }

      var numArmy = 0;
      unitData.forEach(function(elem) { if ((elem.alignment == "player")&&(elem.species=="human")
      &&(elem.combatType)&&(elem.place == "home"))
      { numArmy += elem.owned; } }); // Nationalism adds military units.

      purchaseObj.owned += purchaseObj.increment
      + (purchaseObj.increment * 9 * (civData.civilservice.owned))
      + (purchaseObj.increment * 40 * (civData.feudalism.owned))
      + ((civData.serfs.owned) * Math.floor(Math.log(civData.unemployed.owned * 10 + 1)))
      + ((civData.nationalism.owned) * Math.floor(Math.log(numArmy * 10 + 1)));

      //Handles random collection of special resources.
      var specialChance = purchaseObj.specialChance;
      if (specialChance && purchaseObj.specialMaterial && civData[purchaseObj.specialMaterial]) {
        if ((purchaseObj === civData.food) && (civData.flensing.owned))    { specialChance += 0.1; }
        if ((purchaseObj === civData.stone) && (civData.macerating.owned)) { specialChance += 0.1; }
        if (Math.random() < specialChance){
          var specialMaterial = civData[purchaseObj.specialMaterial];
          var specialQty =  purchaseObj.increment * (1 + (9 * (civData.guilds.owned)));
          specialMaterial.owned += specialQty;
          gameLog("Found " + specialMaterial.getQtyName(specialQty) + " while " + purchaseObj.activity); // I18N
        }
      }
      //Checks to see that resources are not exceeding their limits
      if (purchaseObj.owned > purchaseObj.limit) { purchaseObj.owned = purchaseObj.limit; }

      document.getElementById("clicks").innerHTML = prettify(Math.round(window.cc.incrementProperty('curCiv.resourceClicks')));
      updateResourceTotals(); //Update the page with totals
    }
  },
  initConstants() { // eslint-disable-line no-unused-vars
    let self = this;

    // This is an ordinal used to trigger reloads.
    self.set('version', 19);
    self.set('versionData', new VersionData(1,1,59,"alpha"));

    self.set('saveTag', "civ");
    self.set('saveSettingsTag', "civSettings");
    self.set('logRepeat', 1);

    // Civ size category minimums
    self.set('civSizes', [
      { min_pop :      0, name : "Thorp"       , id : "thorp"      },
      { min_pop :     20, name : "Hamlet"      , id : "hamlet"     },
      { min_pop :     60, name : "Village"     , id : "village"    },
      { min_pop :    200, name : "Small Town"  , id : "smallTown"  },
      //xxx This is a really big jump.  Reduce it.
      { min_pop :   2000, name : "Large Town"  , id : "largeTown"  },
      { min_pop :   5000, name : "Small City"  , id : "smallCity"  },
      { min_pop :  10000, name : "Large City"  , id : "largeCity"  },
      { min_pop :  20000, name:"Metro&shy;polis",id : "metropolis" },
      { min_pop :  50000, name : "Small Nation", id : "smallNation"},
      { min_pop : 100000, name : "Nation"      , id : "nation"     },
      { min_pop : 200000, name : "Large Nation", id : "largeNation"},
      { min_pop : 500000, name : "Empire"      , id : "empire"     }
    ]);
    indexArrayByAttr(self.get('civSizes'), "id");

    // Annotate with max population and index.
    self.get('civSizes').forEach(function(elem,i,arr) {
      elem.max_pop = (i+1 < arr.length) ? (arr[i+1].min_pop - 1) : Infinity;
      elem.idx = i;
    });

    self.set('civSizes.getCivSize', function(popcnt) {
      var i;
      for(i = 0; i< this.length; ++i){
        if (popcnt <= this[i].max_pop) { return this[i]; }
      }
      return this[0];
    });

    // Declare variables here so they can be referenced later.
    self.set('curCiv', {
      civName : "Woodstock",
      rulerName : "Orteil",

      zombie: { owned:0 },
      grave: { owned:0 },
      enemySlain: { owned:0 },
      morale : { mod:1.0 },

      resourceClicks : 0, // For NeverClick
      attackCounter : 0, // How long since last attack?

      trader : {
        materialId:"",
        requested:0,
        timer:0,
        counter : 0 // How long since last trader?
      },

      raid: {
        raiding:false, // Are we in a raid right now?
        victory:false, // Are we in a "raid succeeded" (Plunder-enabled) state right now?
        epop:0,  // Population of enemy we're raiding.
        plunderLoot: {}, // Loot we get if we win.
        last:"",
        targetMax : self.get('civSizes')[0].id // Largest target allowed
      },

      curWonder : {
        name:"",
        stage:0, // 0 = Not started, 1 = Building, 2 = Built, awaiting selection, 3 = Finished.
        progress:0, // Percentage completed.
        rushed:false
      },
      wonders:[],  // Array of {name: name, resourceId: resourceId} for all wonders.

      // Known deities.  The 0th element is the current game's deity.
      // If the name is "", no deity has been created (can also check for worship upgrade)
      // If the name is populated but the domain is not, the domain has not been selected.
      deities : [ { name:"", domain:"", maxDev:0 } ]  // array of { name, domain, maxDev }

      //xxx We're still accessing many of the properties put here by civData
      //elements without going through the civData accessors.  That should
      //change.
    });

    // These are not saved, but we need them up here for the asset data to init properly.
    self.set('population', {
      current:0,
      limit:0,
      healthy:0,
      totalSick:0
    });

    // Caches the total number of each wonder, so that we don't have to recount repeatedly.
    self.set('wonderCount', {});

    civData = civDataTable();

    augmentCivData();

    // Create 'civData.foo' entries as aliases for the civData element with
    // id = "foo".  This makes it a lot easier to refer to the array
    // elements in a readable fashion.
    indexArrayByAttr(civData,"id");

    // Initialize our data. //xxx Should this move to initCivclicker()?
    civData.forEach( function(elem){ if (elem instanceof CivObj) { elem.init(); } });

    // Build a variety of additional indices so that we can iterate over specific
    // subsets of our civ objects.
    resourceData= []; // All resources
    buildingData= []; // All buildings
    upgradeData = []; // All upgrades
    powerData = []; // All 'powers' //xxx This needs refinement.
    unitData = []; // All units
    self.set('achData', []); // All achievements
    sackable= []; // All buildings that can be destroyed
    lootable= []; // All resources that can be stolen
    killable= []; // All units that can be destroyed
    self.set('homeBuildings', []); // All buildings to be displayed in the home area
    homeUnits= []; // All units to be displayed in the home area
    armyUnits= []; // All units to be displayed in the army area
    self.set('basicResources', []); // All basic (click-to-get) resources
    normalUpgrades= []; // All upgrades to be listed in the normal upgrades area

    civData.forEach(function(elem) {
      if (!(elem instanceof CivObj)) {
        return;
      } // Unknown type
      if (elem.type == "resource") {
        resourceData.push(elem);
        // console.log(elem.name);
        // console.log(elem);
        if (elem.vulnerable === true) {
          lootable.push(elem);
        }
        if (elem.subType == "basic") {
          self.get('basicResources').pushObject(elem);
          // console.log(elem.type);
          // console.log(elem.name);
        }
      }
      if (elem.type == "building") {
        buildingData.push(elem);
        if (elem.vulnerable === true) {
          sackable.push(elem);
        }
        if (elem.subType == "normal" || elem.subType == "land") {
          window.cc.get('homeBuildings').pushObject(elem);
        }
      }
      if (elem.subType == "prayer") {
        powerData.push(elem);
      } else if (elem.type == "upgrade") {
        upgradeData.push(elem);
        if (elem.subType == "upgrade") {
          normalUpgrades.push(elem);
        }
      }
      if (elem.type == "unit") {
        unitData.push(elem);
        if (elem.vulnerable === true) {
          killable.push(elem);
        }
        if (elem.place == "home") {
          homeUnits.push(elem);
        }
        if (elem.place == "party") {
          armyUnits.push(elem);
        }
      }
      if (elem.type == "achievement") {
        self.get('achData').pushObject(elem);
      }
    });

    // The resources that Wonders consume, and can give bonuses for.
    self.set('wonderResources', [
      civData.food, civData.wood, civData.stone,
      civData.skins, civData.herbs, civData.ore,
      civData.leather, civData.metal, civData.piety
    ]);

    // These are settings that should probably be tied to the browser.
    self.set('settings', {
      autosave : true,
      autosaveCounter : 1,
      autosaveTime : 60, //Currently autosave is every minute. Might change to 5 mins in future.
      customIncr : false,
      fontSize : 1.0,
      delimiters : true,
      textShadow : false,
      notes : true,
      worksafe : false,
      useIcons : true
    });

    //FIXME: Ug, this is more awful then usual...
    self.set('body', document.getElementsByTagName("body")[0]);

  },
  renameCiv(newName) {
    //Prompts player, uses result as new civName
    while (!newName) {
      newName = prompt("Please name your civilisation", (newName || this.get('curCiv.civName') || "Woodstock"));
      if ((newName === null) && (this.get('civName'))) {
        return;
      } // Cancelled
    }
    this.set('curCiv.civName', newName);
  },

});
