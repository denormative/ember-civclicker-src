import Ember from 'ember';
/*global settings*/

export function prettynum([value]) {
  //xxx TODO: Add appropriate format options
  return (settings.delimiters) ? Number(value).toLocaleString() : value.toString();
}

export default Ember.Helper.helper(prettynum);
