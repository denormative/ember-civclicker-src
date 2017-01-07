import Ember from 'ember';

export default Ember.Route.extend({
  title: Ember.computed('civ.versionData', function() {
    return `CivClicker (${this.get('civ.versionData')})`;
  })
});
