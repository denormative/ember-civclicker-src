import Ember from 'ember';

export default Ember.Service.extend({
  basicResources: null,

  init() {
    this._super(...arguments);
    this.initCivclicker();
    this.set('basicResources', basicResources);
  },
  initCivclicker() {
    console.log("Testing!");
  },
  test() {
    console.log("test!");
  }
});
