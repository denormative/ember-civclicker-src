import Ember from 'ember';
const { $ } = Ember;

/* global reset civData updateResourceTotals */

export default Ember.Component.extend({
  civTypeName: Ember.computed('civ.Sizes', 'civ.population.current', 'civ.population.limit', function() {
    let population = this.get('civ.population');
    let curCiv = this.get('civ.curCiv');
    // Update our civ type name
    let civType = this.get('civ.civSizes').getCivSize(population.current).name;
    if (population.current === 0 && population.limit >= 1000){
        civType = "Ghost Town";
    }
    if (curCiv.zombie.owned >= 1000 && curCiv.zombie.owned >= 2 * population.current){ //easter egg
        civType = "Necropolis";
    }
    return civType;
  }),
  isCheater: Ember.computed('civ.curCiv.rulerName', function() {
    return (this.civ.curCiv.rulerName == "Cheater")
  }),
  currentlyWorshippingDeity: Ember.computed('civ.civData.worship.owned', function() {
    return civData.worship.owned;
  }),
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
    toggleAutosave: function() {
      this.civ.set('settings.autosave', !this.civ.settings.autosave);
    },
    toggleCustomQuantities: function() {
      this.civ.set('settings.customIncr', !this.civ.settings.customIncr);
      this.civ.setCustomQuantities();
    },
    toggleDelimiters: function() {
      this.civ.set('settings.delimiters', !this.civ.settings.delimiters);
      updateResourceTotals();
    },
    toggleNotes: function() {
      this.civ.set('settings.notes', !this.civ.settings.notes);
      this.civ.setNotes();
    },
    toggleWorksafe: function() {
      this.civ.set('settings.worksafe', !this.civ.settings.worksafe);
      this.civ.setWorksafe();
    },
    toggleIcons: function() {
      this.civ.set('settings.useIcons', !this.civ.settings.useIcons);
      this.civ.setIcons();
    },
    manualSave: function() {
      this.civ.save('manual');
    },
    renameCivilization: function() {
      this.civ.renameCiv();
    },
    renameRuler: function() {
      // Cheaters don't get names.
      if(this.get('isCheater')) {
        return;
      }
      this.civ.renameRuler();
    },
    renameDeity: function() {
      this.civ.renameDeity();
    },
    resetGame: function() {
      reset();
    },
    deleteSave: function() {
      this.civ.deleteSave();
    },
  }
});
