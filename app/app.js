import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  civClicker: Ember.inject.service(),
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  ready: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      initCivclicker();
      this.tick();
    });

  },
  tick: function(){
    var self = this;
    runLoop();
    Ember.run.later(function(){
      self.tick();
    }, 1000);
  },
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
