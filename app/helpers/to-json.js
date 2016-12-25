import Ember from 'ember';

export function toJson(params/*, hash*/) {
  return JSON.stringify(params);
}

export default Ember.Helper.helper(toJson);
