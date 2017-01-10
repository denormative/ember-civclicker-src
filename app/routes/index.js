import Ember from 'ember';
import { EKMixin, keyDown } from 'ember-keyboard';

/* global spawn */

export default Ember.Route.extend(EKMixin, {
  init() {
    this._super(...arguments);
    this.set('keyboardActivated', true);

  },
  title: Ember.computed('civ.versionData', function() {
    return `CivClicker (${this.get('civ.versionData')})`;
  }),
  incFood: Ember.on(keyDown('KeyF'), function() {
    this.civ.incrementBase('food');
  }),
  incWood: Ember.on(keyDown('KeyD'), function() {
    this.civ.incrementBase('wood');
  }),
  incStone: Ember.on(keyDown('KeyS'), function() {
    this.civ.incrementBase('stone');
  }),
  incWorkers: Ember.on(keyDown('KeyR'), function() {
    spawn(Infinity)
  }),
});
