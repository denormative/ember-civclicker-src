import Ember from 'ember';

/* global save load */

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
