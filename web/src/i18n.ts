import { init } from 'i18not';

init({
  ns: ['main'],
  defaultNS: 'main',
  load: 'languageOnly',
  loadPath: `/locales/{{lng}}/{{ns}}.json?uuid=${__BUILD_UUID__}`,
  fallbackLng: 'en',
});
