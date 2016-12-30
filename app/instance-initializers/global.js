export function initialize(appInstance) {
  //appInstance.store = appInstance.lookup('service:store');
  //appInstance.civ = appInstance.lookup('service:civClicker');
  appInstance.inject('component', 'civ', 'service:civ-clicker');
}

export default {
  name: 'global',
  initialize
};
