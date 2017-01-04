import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
const { $ } = Ember;

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  civClicker: Ember.inject.service(),
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  ready: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.__container__.lookup('service:civ-clicker').initCivClicker();

      $('.menu .item')
        .tab()
      ;
    });

  },
  apptest: function(){
    console.log("apptest");
  },
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
