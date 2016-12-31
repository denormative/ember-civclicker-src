import Ember from 'ember';

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
  }
});
