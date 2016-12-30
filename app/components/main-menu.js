import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    openModal: function(name) {
      console.log(123);
      this.$('.ui.' + name + '.modal').modal('show');
    },
  }
});
