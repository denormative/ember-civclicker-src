import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    openModal: function(name) {
      this.$('.ui.' + name + '.modal').modal('show');
    },
  }
});
