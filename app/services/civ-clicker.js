import Ember from 'ember';

export default Ember.Service.extend({
  basicResources: null,

  init() {
    this._super(...arguments);
    //initCivclicker();
    this.set('basicResources', basicResources);
  },
  initCivclicker() {
    console.log("Testing!");
  }
});
