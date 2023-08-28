import { init } from 'i18not';
import { commitHash } from './utils/browser.js';

init({
  ns: ['main'],
  defaultNS: 'main',
  load: 'languageOnly',
  loadPath: `/locales/{{lng}}/{{ns}}.json?v=${commitHash}`,
  fallbackLng: 'en',
});
