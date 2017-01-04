/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['images'],
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('vendor/civclicker/civclicker.css');
  app.import('vendor/civclicker/lz-string.js');
  app.import('vendor/civclicker/jsutils.js');
  app.import('vendor/civclicker/classList.js');
  app.import('vendor/civclicker/civclicker.js');
  app.import('vendor/civclicker/migrate.js');
  app.import('vendor/civclicker/images/constableLandscapeRetouched.jpg', { destDir: 'assets/images' });
  app.import('vendor/civclicker/images/skins.png', { destDir: 'images' });
  app.import('vendor/civclicker/images/leather.png', { destDir: 'images' });
  app.import('vendor/civclicker/images/herbs.png', { destDir: 'images' });
  app.import('vendor/civclicker/images/piety.png', { destDir: 'images' });
  app.import('vendor/civclicker/images/ore.png', { destDir: 'images' });
  app.import('vendor/civclicker/images/metal.png', { destDir: 'images' });
  app.import('vendor/civclicker/images/gold.png', { destDir: 'images' });
  app.import('vendor/civclicker/images/achLocked.jpg', { destDir: 'assets/images' });
  app.import('vendor/civclicker/images/food.png', { destDir: 'images' });
  app.import('vendor/civclicker/images/wood.png', { destDir: 'images' });
  app.import('vendor/civclicker/images/stone.png', { destDir: 'images' });
  app.import('vendor/civclicker/version.txt', { destDir: '' });
  app.import('bower_components/rpg-awesome/css/rpg-awesome.css');
  app.import('bower_components/rpg-awesome/fonts/rpgawesome-webfont.eot', { destDir: 'fonts' });
  app.import('bower_components/rpg-awesome/fonts/rpgawesome-webfont.svg', { destDir: 'fonts' });
  app.import('bower_components/rpg-awesome/fonts/rpgawesome-webfont.ttf', { destDir: 'fonts' });
  app.import('bower_components/rpg-awesome/fonts/rpgawesome-webfont.woff', { destDir: 'fonts' });

  return app.toTree();
};
