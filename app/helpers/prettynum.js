import Ember from 'ember';

export function prettynum([value, ...rest]) {
  //xxx TODO: Add appropriate format options
  return (settings.delimiters) ? Number(value).toLocaleString() : input.toString();
}

export default Ember.Helper.helper(prettynum);
