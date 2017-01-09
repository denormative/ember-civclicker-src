import Ember from 'ember';

export function hideIf([truth]) {
  return truth ? "hide" : "";
}

export default Ember.Helper.helper(hideIf);
