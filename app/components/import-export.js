import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    export: function() {
      save('export');
    },

    select: function() {
      document.getElementById('impexpField').select();
    },

    import: function() {
      load('import');
    }
  }
});
