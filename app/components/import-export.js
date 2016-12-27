import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    openModal: function(name) {
      this.$('.ui.' + name + '.modal').modal('show');
      console.log("fnord");
    },

    approveModal: function(element, component) {
      alert('approve ' + component.get('name'));
      return false;
    },

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
