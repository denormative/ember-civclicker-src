import Ember from 'ember';
const { $ } = Ember;

export default Ember.Component.extend({
  didRender() {
    this._super(...arguments);
    $('.ui.sidebar')
      .sidebar({
        context: $('.bottom.segment')
      })
      .sidebar('attach events', '#side-bar.ui.button');
  },
  actions: {
    openModal: function(name) {
      console.log(name);
      this.$('.ui.' + name + '.modal').modal('show');
    },
  }
});
