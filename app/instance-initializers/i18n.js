export function initialize(appInstance) {
  appInstance.lookup('service:i18n').set('locale', calculateLocale());
}

function calculateLocale() {
  // whatever you do to pick a locale for the user:
  return navigator.language || navigator.userLanguage || 'en';
}

export default {
  name: 'i18n',
  initialize
};
