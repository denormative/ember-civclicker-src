import Ember from 'ember';

export default Ember.Component.extend({
  //FIXME: a hack, but the original game had a hack for these as well
  foodLimit: Ember.computed('civ.civData.food.limit', 'civ.civData.barn.owned', 'civ.civData.granaries.owned', function() {
    console.log(this.get('civ.civData.food.limit'));
    return this.get('civ.civData.food.limit');
  }),
  woodLimit: Ember.computed('civ.civData.wood.limit','civData.woodstock.owned', function() {
    console.log(this.get('civ.civData.wood.limit'));
    return this.get('civ.civData.wood.limit');
  }),
  stoneLimit: Ember.computed('civ.civData.stone.limit', 'civData.stonestock.owned', function() {
    console.log(this.get('civ.civData.stone.limit'));
    return this.get('civ.civData.stone.limit');
  }),
});
