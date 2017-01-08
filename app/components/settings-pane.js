import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    renameCiv: function() {
      this.civ.renameCiv();
    },
  }
});
