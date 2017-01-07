import Ember from 'ember';

/* global getReqText ifValid */

export function getCostNote([civObj]) {
  let reqText = getReqText(civObj.require);
  var effectText = ifValid(civObj.effectText);

  var cost = reqText ? reqText : "";
  var note = effectText;

  // if (settings.note === true) {
    return Ember.String.htmlSafe((cost ? `<b>${cost}</b><br>` : "") + note);
  // }
  // else {
  //   return Ember.String.htmlSafe(cost);
  // }
}

export default Ember.Helper.helper(getCostNote);
