import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    onIncrement: function(event) {
      console.log("increment");
      this.civ.onIncrement(event.target);
    },
  }
});
