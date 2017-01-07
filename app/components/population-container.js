import Ember from 'ember';

/* globals curCiv */

export default Ember.Component.extend({
  zombies: curCiv.zombie,
  graves: curCiv.grave.owned
});
