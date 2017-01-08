import Ember from 'ember';
const { $ } = Ember;

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
      console.log(this.civ.settings.autosave);
    },
    manualSave: function() {
      this.civ.save('manual');
    },
    renameCivilization: function() {
    },
    renameYourself: function() {
    },
    renameCurrentDeity: function() {
    },
  }
});
