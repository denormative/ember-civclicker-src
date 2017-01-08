import Ember from 'ember';

export function disabled([truth]) {
  return truth ? "disabled" : "";
}

export default Ember.Helper.helper(disabled);
