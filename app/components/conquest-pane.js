import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    onInvade: function(event) {
      console.log("invade");
      this.civ.onInvade(event.target);
    },
  }
});
