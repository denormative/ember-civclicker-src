import Ember from 'ember';

/* global onInvade addUITable
armyUnits:true addUpgradeRows addWonderSelectText
makeDeitiesTables updateSettings tickAutosave
doFarmers doWoodcutters doMiners doBlacksmiths doTanners doClerics doStarve
resourceData doMobs doPestControl tickGlory doShades doEsiege
doRaid doGraveyards doHealers doCorpses doThrone tickGrace tickWalk
doLabourers tickTraders updateResourceTotals testAchievements
updateUpgrades updateResourceRows updateBuildingButtons updateJobButtons
updatePartyButtons updatePopulationUI updateTargets updateDevotion
updateWonder updateReset onPurchase VersionData valOf */

/* global indexArrayByAttr CivObj civDataTable
augmentCivData buildingData:true upgradeData:true powerData:true
unitData:true sackable:true lootable:true killable:true gameLog prettify
resourceData:true LZString mergeObj migrateGameData isValid adjustMorale
updateRequirements updateDeity updateMorale setElemDisplay */

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
  totalPopulation: Ember.computed('population.current', 'curCiv.zombie.owned', function() {
    return this.population.current + this.curCiv.zombie.owned;
  }),
  wonderInProgress: Ember.computed('curCiv.curWonder.stage', function() {
    return (this.get('curCiv.curWonder.stage') === 1);
  }),
  initCivClicker() {
    // Start of init program code

    // addUITable(homeUnits, "jobs"); // Dynamically create the job controls table.
    addUITable(armyUnits, "party"); // Dynamically create the party controls table.
    addUpgradeRows(); // This sets up the framework for the upgrade items.
    // addUITable(normalUpgrades, "upgrades"); // Place the stubs for most upgrades under the upgrades tab.
    addWonderSelectText();
    makeDeitiesTables();

    if (!this.load("localStorage")) { //immediately attempts to load
      //Prompt player for names
      this.renameCiv();
      this.renameRuler();
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
    doEsiege(window.cc.get('civData.esiege'), window.cc.get('civData.fortification'));
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
  incrementBase(objId) {
    var purchaseObj = this.get('civData.'+objId);
    if (!purchaseObj) { console.log("Unknown purchase: "+objId); return; }

    var numArmy = 0;
    unitData.forEach(function(elem) { if ((elem.alignment == "player")&&(elem.species=="human")
    &&(elem.combatType)&&(elem.place == "home"))
    { numArmy += elem.owned; } }); // Nationalism adds military units.

    this.incrementProperty('civData.'+objId+'.owned', purchaseObj.increment
    + (purchaseObj.increment * 9 * (this.civData.civilservice.owned))
    + (purchaseObj.increment * 40 * (this.civData.feudalism.owned))
    + ((this.civData.serfs.owned) * Math.floor(Math.log(this.civData.unemployed.owned * 10 + 1)))
    + ((this.civData.nationalism.owned) * Math.floor(Math.log(numArmy * 10 + 1))));

    //Handles random collection of special resources.
    var specialChance = purchaseObj.specialChance;
    if (specialChance && purchaseObj.specialMaterial && this.civData[purchaseObj.specialMaterial]) {
      if ((purchaseObj === this.civData.food) && (this.civData.flensing.owned))    { specialChance += 0.1; }
      if ((purchaseObj === this.civData.stone) && (this.civData.macerating.owned)) { specialChance += 0.1; }
      if (Math.random() < specialChance){
        var specialMaterial = this.civData[purchaseObj.specialMaterial];
        var specialQty =  purchaseObj.increment * (1 + (9 * (this.civData.guilds.owned)));
        this.incrementProperty('civData.'+purchaseObj.specialMaterial+'.owned', specialQty);
        gameLog("Found " + specialMaterial.getQtyName(specialQty) + " while " + purchaseObj.activity); // I18N
      }
    }
    //Checks to see that resources are not exceeding their limits
    if (purchaseObj.owned > purchaseObj.limit) { this.set('civData.'+objId+'.owned', purchaseObj.limit); }

    document.getElementById("clicks").innerHTML = prettify(Math.round(window.cc.incrementProperty('curCiv.resourceClicks')));
    updateResourceTotals(); //Update the page with totals
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
      this.incrementBase(objId);
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
      morale : { mod:1.0, efficiency: 0.0 },

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
    adjustMorale(0);

    // Caches the total number of each wonder, so that we don't have to recount repeatedly.
    self.set('wonderCount', {});

    window.cc.set('civData', civDataTable());

    augmentCivData();

    // Create 'civData.foo' entries as aliases for the civData element with
    // id = "foo".  This makes it a lot easier to refer to the array
    // elements in a readable fashion.
    indexArrayByAttr(window.cc.get('civData'),"id");

    // Initialize our data. //xxx Should this move to initCivclicker()?
    window.cc.get('civData').forEach( function(elem){ if (elem instanceof CivObj) { elem.init(); } });

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
    self.set('homeUnits', []); // All units to be displayed in the home area
    armyUnits= []; // All units to be displayed in the army area
    self.set('basicResources', []); // All basic (click-to-get) resources
    self.set('normalUpgrades', []); // All upgrades to be listed in the normal upgrades area

    window.cc.get('civData').forEach(function(elem) {
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
          window.cc.get('normalUpgrades').pushObject(elem);
        }
      }
      if (elem.type == "unit") {
        unitData.push(elem);
        if (elem.vulnerable === true) {
          killable.push(elem);
        }
        if (elem.place == "home") {
          self.get('homeUnits').pushObject(elem);
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
      window.cc.get('civData.food'), window.cc.get('civData.wood'), window.cc.get('civData.stone'),
      window.cc.get('civData.skins'), window.cc.get('civData.herbs'), window.cc.get('civData.ore'),
      window.cc.get('civData.leather'), window.cc.get('civData.metal'), window.cc.get('civData.piety')
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
  // Create objects and populate them with the variables, these will be stored in HTML5 localStorage.
  // Cookie-based saves are no longer supported.
  save(savetype) {
    var xmlhttp;

    var saveVar = {
      versionData: window.cc.get('versionData'), // Version information header
      curCiv: window.cc.get('curCiv') // Game data
    };

    var settingsVar = window.cc.get('settings'); // UI Settings are saved separately.

    ////////////////////////////////////////////////////

    // Handle export
    if (savetype == "export") {
      var savestring = "[" + JSON.stringify(saveVar) + "]";
      var compressed = LZString.compressToBase64(savestring);
      console.log("Compressed save from " + savestring.length + " to " + compressed.length + " characters");
      document.getElementById("impexpField").value = compressed;
      gameLog("Exported game to text");
      return true;
    }

    //set localstorage
    try {
      localStorage.setItem(window.cc.get('saveTag'), JSON.stringify(saveVar));

      // We always save the game settings.
      localStorage.setItem(window.cc.get('saveSettingsTag'), JSON.stringify(settingsVar));

      //Update console for debugging, also the player depending on the type of save (manual/auto)
      if (savetype == "auto") {
        console.log("Autosave");
        gameLog("Autosaved");
      } else if (savetype == "manual") {
        alert("Game Saved");
        console.log("Manual Save");
        gameLog("Saved game");
      }
    }
    catch (err) {
      this.andleStorageError(err);

      if (savetype == "auto") {
        console.log("Autosave Failed");
        gameLog("Autosave Failed");
      } else if (savetype == "manual") {
        alert("Save Failed!");
        console.log("Save Failed");
        gameLog("Save Failed");
      }
      return false;
    }

    try {
      xmlhttp = new XMLHttpRequest();
      xmlhttp.overrideMimeType("text/plain");
      xmlhttp.open("GET", "version.txt?r=" + Math.random(), true);
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
          var sVersion = parseInt(xmlhttp.responseText, 10);
          if (window.cc.get('version') < sVersion) {
            this.versionAlert();
          }
        }
      };
      xmlhttp.send(null);
    } catch (err) {
      console.log("XMLHttpRequest failed");
    }

    return true;
  },
  handleStorageError(err)
  {
    var msg;
    if ((err instanceof DOMException) && (err.code == DOMException.SECURITY_ERR))
    { msg = "Browser security settings blocked access to local storage."; }
    else
    { msg = "Cannot access localStorage - browser may not support localStorage, or storage may be corrupt"; }
    console.log(err.toString());
    console.log(msg);
  },
  versionAlert(){
    console.log("New Version Available");
    document.getElementById("versionAlert").style.display = "inline";
  },
  load(loadType){ // eslint-disable-line no-unused-vars
    //define load variables
    var loadVar = {},
    settingsVar = window.cc.get('settings');

    if (loadType === "localStorage"){
      //check for local storage
      var string1;
      var settingsString;
      try {
        settingsString = localStorage.getItem(window.cc.get('saveSettingsTag'));
        string1 = localStorage.getItem(window.cc.get('saveTag'));

        if (!string1) {
          console.log("Unable to find variables in localStorage. Attempting to load cookie.");
          return this.load("cookie");
        }

      } catch(err) {
        if (!string1) { // It could be fine if settingsString fails.
          this.handleStorageError(err);
          return;
        }
      }

      // Try to parse the strings
      if (string1) { try { loadVar  = JSON.parse(string1); } catch(ignore){ /* empty */ } }
      if (settingsString) { try { settingsVar = JSON.parse(settingsString); } catch(ignore){ /* empty */ } }

      if (!loadVar) {
        console.log("Unable to parse variables in localStorage.");
        return;
      }

      //notify user
      gameLog("Loaded saved game from localStorage");
    }

    if (loadType === "import"){
      //take the import string, decompress and parse it
      var compressed = document.getElementById("impexpField").value;
      var decompressed = LZString.decompressFromBase64(compressed);
      var revived = JSON.parse(decompressed);
      //set variables to load from
      loadVar = revived[0];
      if (!loadVar) {
        console.log("Unable to parse saved game string.");
        return false;
      }

      //notify user
      gameLog("Imported saved game");
      //close import/export dialog
    }

    var saveVersion = new VersionData(1,0,0,"legacy");
    saveVersion = mergeObj(saveVersion,loadVar.versionData);
    if (saveVersion.toNumber() > window.cc.get('versionData').toNumber())
    {
      // Refuse to load saved games from future versions.
      var alertStr = "Cannot load; saved game version " + saveVersion + " is newer than game version " + window.cc.get('versionData');
      console.log(alertStr);
      alert(alertStr);
      return false;
    }
    if (saveVersion.toNumber() < window.cc.get('versionData').toNumber()) {
      // Migrate saved game data from older versions.
      var settingsVarReturn = { val: {} };
      migrateGameData(loadVar,settingsVarReturn);
      settingsVar = settingsVarReturn.val;

      // Merge the loaded data into our own, in case we've added fields.
      //mergeObj(window.cc.get('curCiv'), loadVar.curCiv);
      window.cc.set('curCiv', loadVar.curCiv);
    }
    else {
      //curCiv = loadVar.curCiv; // No need to merge if the versions match; this is quicker.
      window.cc.set('curCiv', loadVar.curCiv);
    }

    console.log("Loaded save game version " + saveVersion.major +
    "." + saveVersion.minor + "." + saveVersion.sub + "(" + saveVersion.mod + ").");

    if (isValid(settingsVar)){ window.cc.set('settings', settingsVar); }

    adjustMorale(0);
    updateRequirements(window.cc.get('civData.mill'));
    updateRequirements(window.cc.get('civData.fortification'));
    updateRequirements(window.cc.get('civData.battleAltar'));
    updateRequirements(window.cc.get('civData.fieldsAltar'));
    updateRequirements(window.cc.get('civData.underworldAltar'));
    updateRequirements(window.cc.get('civData.catAltar'));
    updateResourceTotals();
    updateJobButtons();
    makeDeitiesTables();
    updateDeity();
    updateUpgrades();
    updateTargets();
    updateDevotion();
    updatePartyButtons();
    updateMorale();
    updateWonder();
    this.updateWonderCount();
    document.getElementById("clicks").innerHTML = prettify(Math.round(window.cc.get('curCiv').resourceClicks));
    document.getElementById("wonderNameP").innerHTML = window.cc.get('curCiv').curWonder.name;
    document.getElementById("wonderNameC").innerHTML = window.cc.get('curCiv').curWonder.name;

    return true;
  },
  deleteSave(){ // eslint-disable-line no-unused-vars
    //Deletes the current savegame by setting the game's cookies to expire in the past.
    if (!confirm("Really delete save?")) { return; } //Check the player really wanted to do that.

    try {
      localStorage.removeItem(window.cc.get('saveTag'));
      localStorage.removeItem(window.cc.get('saveSettingsTag'));
      gameLog("Save Deleted");
    } catch(err) {
      this.handleStorageError(err);
      alert("Save Deletion Failed!");
    }
  },
  // Tallies the number of each wonder from the wonders array.
  updateWonderCount() {
    window.cc.set('wonderCount', {});
      window.cc.get('curCiv').wonders.forEach(function(elem) {
          var resourceId = elem.resourceId;
          if (!isValid(window.cc.get('wonderCount.' + resourceId))) { window.cc.set('wonderCount.' + resourceId, 0); }
          window.cc.incrementProperty('wonderCount.' + resourceId);
      });
  },
  // Note:  Returns the index (which could be 0), or 'false'.
  haveDeity(name) {
    var i;
    for (i=0;i<window.cc.get('curCiv').deities.length;++i) {
      if (window.cc.get('curCiv').deities[i].name == name) { return i; }
    }

    return false;
  },
  renameRuler(newName){
    if (this.get('curCiv.rulerName') == "Cheater") { return; } // Reputations suck, don't they?
    //Prompts player, uses result as rulerName
    while (!newName || this.haveDeity(newName)!==false) {
      newName = prompt("What is your name?",(newName || this.get('curCiv.rulerName') || "Orteil"));
      if ((newName === null)&&(this.get('curCiv.rulerName'))) { return; } // Cancelled
      if (this.haveDeity(newName)!==false) {
        alert("That would be a blasphemy against the deity "+newName+".");
        newName = "";
      }
    }

    window.cc.set('curCiv.rulerName', newName);
  },

  // Looks to see if the deity already exists.  If it does, that deity
  // is moved to the first slot, overwriting the current entry, and the
  // player's domain is automatically assigned to match (for free).
  renameDeity(newName){ // eslint-disable-line no-unused-vars
    var i = false;
    while (!newName) {
      // Default to ruler's name.  Hey, despots tend to have big egos.
      newName = prompt("Whom do your people worship?",(newName || window.cc.get('curCiv').deities[0].name || window.cc.get('curCiv').rulerName));
      if ((newName === null)&&(window.cc.get('curCiv').deities[0].name)) { return; } // Cancelled

      // If haveDeity returns a number > 0, the name is used by a legacy deity.
      // This is only allowed when naming (not renaming) the active deity.
      i = this.haveDeity(newName);
      if (i && window.cc.get('curCiv').deities[0].name) {
        alert("That deity already exists.");
        newName = "";
      }
    }

    // Rename the active deity.
    window.cc.get('curCiv').deities[0].name = newName;

    // If the name matches a legacy deity, make the legacy deity the active deity.
    if (i) {
      window.cc.get('curCiv').deities[0] = window.cc.get('curCiv').deities[i]; // Copy to front position
      window.cc.get('curCiv').deities.splice(i,1); // Remove from old position
      if (this.getCurDeityDomain()) { // Does deity have a domain?
        this.selectDeity(this.getCurDeityDomain(),true); // Automatically pick that domain.
      }
    }

    makeDeitiesTables();
  },
  getCurDeityDomain() {
    return (window.cc.get('curCiv').deities.length > 0) ? window.cc.get('curCiv').deities[0].domain : undefined;
  },
  //Deity Domains upgrades
  selectDeity(domain,force){
      if (!force) {
          if (window.cc.get('civData.piety.owned') < 500) { return; } // Can't pay
          window.cc.decrementProperty('civData.piety.owned', 500);
      }
      window.cc.get('curCiv').deities[0].domain = domain;

      document.getElementById(domain+"Upgrades").style.display = "inline";
      document.getElementById("deityDomains").style.display = "none";
      makeDeitiesTables();
  },
  // FIXME: remove!
  setCustomQuantities(){
      let i;
      let elems;
      // let curPop = window.cc.get('population').current + window.cc.get('curCiv').zombie.owned;

      setElemDisplay("customJobQuantity",window.cc.get('settings.customIncr'));
      setElemDisplay("customPartyQuantity",window.cc.get('settings.customIncr'));
      setElemDisplay("customBuildQuantity",window.cc.get('settings.customIncr'));
      setElemDisplay("customSpawnQuantity",window.cc.get('settings.customIncr'));

      // elems = document.getElementsByClassName("unit10");
      // for (i = 0; i < elems.length; ++i) { setElemDisplay(elems[i],!window.cc.get('settings.customIncr') && (curPop >= 10)); }
      //
      // elems = document.getElementsByClassName("unit100");
      // for (i = 0; i < elems.length; ++i) { setElemDisplay(elems[i],!window.cc.get('settings.customIncr') && (curPop >= 100)); }
      //
      // elems = document.getElementsByClassName("unit1000");
      // for (i = 0; i < elems.length; ++i) { setElemDisplay(elems[i],!window.cc.get('settings.customIncr') && (curPop >= 1000)); }
      //
      // elems = document.getElementsByClassName("unitInfinity");
      // for (i = 0; i < elems.length; ++i) { setElemDisplay(elems[i],!window.cc.get('settings.customIncr') && (curPop >= 1000)); }
      //
      elems = document.getElementsByClassName("buycustom");
      for (i = 0; i < elems.length; ++i) { setElemDisplay(elems[i],window.cc.get('settings.customIncr')); }
  },
  // Toggles the display of the .notes class
  setNotes(){
      let i;
      let elems = document.getElementsByClassName("note");
      for(i = 0; i < elems.length; ++i) {
          setElemDisplay(elems[i],window.cc.get('settings.notes'));
      }
  },
  // Does nothing yet, will probably toggle display for "icon" and "word" classes
  // as that's probably the simplest way to do this.
  setIcons(){
      let i;
      let elems = document.getElementsByClassName("icon");
      for(i = 0; i < elems.length; ++i) {
          // Worksafe implies no icons.
          elems[i].style.visibility = (window.cc.get('settings.useIcons') && !window.cc.get('settings.worksafe')) ? "visible" : "hidden";
      }
  },
  setWorksafe(){
      //xxx Should this be applied to the document instead of the body?
      if (window.cc.get('settings.worksafe')){
          window.cc.get('body').classList.remove("hasBackground");
      } else {
          window.cc.get('body').classList.add("hasBackground");
      }

      this.setIcons(); // Worksafe overrides icon settings.
  },
  // Returns how many of this item the player can afford.
  // Looks only at the item's cost and the player's resources, and not
  // at any other limits.
  // Negative quantities are always fully permitted.
  // An undefined cost structure is assumed to mean it cannot be purchased.
  // A boolean quantity is converted to +1 (true) -1 (false)
  //xxx Caps nonlinear purchases at +1, blocks nonlinear sales.
  // costObj - The cost substructure of the object to purchase
  canAfford(costObj, qty)
  {
      if (!isValid(costObj)) { return 0; }
      if (qty === undefined) { qty = Infinity; } // default to as many as we can
      if (qty === false) { qty = -1; } // Selling back a boolean item.
      var i;
      for(i in costObj)
      {
          if (costObj[i] === 0) { continue; }

          //xxx We don't handle nonlinear costs here yet.
          // Cap nonlinear purchases to one at a time.
          // Block nonlinear sales.
          if (typeof costObj[i] == "function") { qty = Math.max(0,Math.min(1,qty)); }

          qty = Math.min(qty,Math.floor(this.get('civData.'+i+'.owned')/valOf(costObj[i])));
          if (qty === 0) { return qty; }
      }

      return qty;
  },

});
