import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    export: function() {
      this.civ.save('export');
    },

    select: function() {
      document.getElementById('impexpField').select();
    },

    import: function() {
      this.civ.load('import');
    }
  }
});
