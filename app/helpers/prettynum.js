import Ember from 'ember';

export function prettynum([value]) {
  //xxx TODO: Add appropriate format options
  return (this.civ.settings.delimiters) ? Number(value).toLocaleString() : value.toString();
}

export default Ember.Helper.helper(prettynum);
