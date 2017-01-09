import Ember from 'ember';

export function prettynum([value]) {
  //xxx TODO: Add appropriate format options
  let num = Math.floor(value);
  return (this.civ.settings.delimiters) ? Number(num).toLocaleString() : num.toString();
}

export default Ember.Helper.helper(prettynum);
