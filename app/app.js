import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  ready: function() {
    this.tick();
    // initCivclicker();
  },
  tick: function(){
    var self = this;
    console.log("tick");
    //runLoop();
    Ember.run.later(function(){
      self.tick();
    }, 1000);
  },
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
