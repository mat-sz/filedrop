import { init } from 'i18not';

init({
  ns: ['main'],
  defaultNS: 'main',
  load: 'languageOnly',
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  fallbackLng: 'en',
});
