import Ember from 'ember';

export default Ember.Service.extend({
  basicResources: null,
  civSizes: null,

  init() {
    this._super(...arguments);
    this.initCivclicker();
    this.set('basicResources', basicResources);
    this.set('civSizes', civSizes);
  },
  initCivclicker() {
    console.log("Testing!");
  },
  test() {
    console.log("test!");
  },
  onInvade(target) {
    console.log("civ.invade");
    onInvade(target);
  },
  onPurchase(target) {
    console.log("civ.purchase");
    onPurchase(target);
  },
  onIncrement(target) {
    console.log("civ.increment");
    onIncrement(target);
  },
  actions: {
  }
});
