import Ember from 'ember';

export default Ember.Component.extend({
  negativeList: {
    "Infinity": {text: "-&infin;", value: -Infinity},
    "custom": {text: "-X", value: "-custom"},
    "10000": {text: "-10k", value: -10000},
    "1000": {text: "-1k", value: -1000},
    "100": {text: "-100", value: -100},
    "10": {text: "-10", value: -10},
    "1": {text: "-1", value: -1},
  },
  positiveList: {
    "1": {text: "+1", value: 1},
    "10": {text: "+10", value: 10},
    "100": {text: "+100", value: 100},
    "1000": {text: "+1k", value: 1000},
    "10000": {text: "+10k", value: 10000},
    "custom": {text: "+X", value: "custom"},
    "Infinity": {text: "+&infin;", value: Infinity},
  },
});
