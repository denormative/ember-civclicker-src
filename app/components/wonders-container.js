import Ember from 'ember';

export default Ember.Component.extend({
  // do we have the tech to build it, or have a wonder built already
  canBuildWonder: Ember.computed('civ.civData.architecture.owned', 'civ.civData.civilservice.owned', function() {
    console.log(this.get('civ.civData.architecture.owned'));
    console.log(this.get('civ.civData.civilservice.owned'));
    return (this.get('civ.civData.architecture.owned') && this.get('civ.civData.civilservice.owned'));
  }),
  haveWonder: Ember.computed('canBuildWonder', 'civ.curCiv.wonders.length', function() {
    return (this.get('canBuildWonder') || (this.get('civ.curCiv.wonders.length') > 0));
  }),
  canStartBuilding: Ember.computed('canBuildWonder', 'civ.curCiv.curWonder.stage', function() {
    return (this.get('canBuildWonder') && (this.get('civ.curCiv.curWonder.stage') === 0));
  }),
  canSpeedWonder: Ember.computed('civ.wonderInProgress', 'civ.curData.gold.owned', function() {
    return (this.get('civ.wonderInProgress') && (this.civ.canAfford({ gold: 100 })));
  }),
});
