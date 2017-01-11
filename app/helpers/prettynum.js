import Ember from 'ember';

export default Ember.Helper.extend({
  compute([value]) {
    let num = Math.floor(value);
    return (this.civ.settings.delimiters) ? Number(num).toLocaleString() : num.toString();
  }
});
