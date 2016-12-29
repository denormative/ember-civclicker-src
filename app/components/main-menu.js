import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    toggleSidebar: function() {
      $('.ui.sidebar')
        .sidebar({
          context: $('.bottom.segment')
        })
        .sidebar('attach events', '#side-bar.item')
      ;
    }
  }
});
