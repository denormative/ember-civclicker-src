import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    onInvade: function(event) {
      onInvade(event.target);
    },
  }
});
