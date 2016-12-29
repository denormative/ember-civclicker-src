import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  civClicker: Ember.inject.service(),
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  ready: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.initCivClicker();
      console.log("running");
      $('.menu .item')
        .tab()
      ;
      this.tick();
    });

  },
  tick: function(){
    var self = this;
    this.runLoop();
    Ember.run.later(function(){
      self.tick();
    }, 1000);
  },
  initCivClicker: function() {
    // Start of init program code
    //document.title = "CivClicker ("+versionData+")"; //xxx Not in XML DOM.

    addUITable(basicResources, "basicResources"); // Dynamically create the basic resource table.
    addUITable(homeBuildings, "buildings"); // Dynamically create the building controls table.
    addUITable(homeUnits, "jobs"); // Dynamically create the job controls table.
    addUITable(armyUnits, "party"); // Dynamically create the party controls table.
    addUpgradeRows(); // This sets up the framework for the upgrade items.
    addUITable(normalUpgrades, "upgrades"); // Place the stubs for most upgrades under the upgrades tab.
    addAchievementRows();
    addRaidRows();
    addWonderSelectText();
    makeDeitiesTables();

    if (!load("localStorage")) { //immediately attempts to load
        //Prompt player for names
        renameCiv();
        renameRuler();
    }
    updateSettings();
  },
  runLoop: function() {
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
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
