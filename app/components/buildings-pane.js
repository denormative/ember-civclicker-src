import Ember from 'ember';

export default Ember.Component.extend({
  negativeList: {
    "Infinity": {text: "-&infin;", value: -Infinity, hiddenPop: 0},
    "custom": {text: "-X", value: "-custom", hiddenPop: 0},
    "10000": {text: "-10k", value: -10000, hiddenPop: 100000},
    "1000": {text: "-1k", value: -1000, hiddenPop: 10000},
    "100": {text: "-100", value: -100, hiddenPop: 1000},
    "10": {text: "-10", value: -10, hiddenPop: 100},
    "1": {text: "-1", value: -1, hiddenPop: 0},
  },
  positiveList: {
    "1": {text: "+1", value: 1, hiddenPop: 0},
    "10": {text: "+10", value: 10, hiddenPop: 100},
    "100": {text: "+100", value: 100, hiddenPop: 1000},
    "1000": {text: "+1k", value: 1000, hiddenPop: 10000},
    "10000": {text: "+10k", value: 10000, hiddenPop: 100000},
    "custom": {text: "+X", value: "custom", hiddenPop: 0},
    "Infinity": {text: "+&infin;", value: Infinity, hiddenPop: 0},
  },
});
