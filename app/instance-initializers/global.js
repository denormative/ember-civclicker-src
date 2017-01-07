export function initialize(appInstance) {
  //appInstance.store = appInstance.lookup('service:store');
  //appInstance.civ = appInstance.lookup('service:civClicker');
  appInstance.inject('component', 'civ', 'service:civ-clicker');
  appInstance.inject('route', 'civ', 'service:civ-clicker');
  window.cc = appInstance.lookup('service:civ-clicker');
  window.cc.test();
}

export default {
  name: 'global',
  initialize
};
