import Ember from 'ember';

export function getCostNote([params]/*, hash*/) {
  return Ember.String.htmlSafe(getCostNote_Old(params));
}

export default Ember.Helper.helper(getCostNote);
