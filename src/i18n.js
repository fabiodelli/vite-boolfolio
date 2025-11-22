import { createI18n } from 'vue-i18n';
import it from './locales/it.json';
import en from './locales/en.json';

const i18n = createI18n({
  legacy: false, // Vuoi usare Composition API (o comunque modalità moderna)
  locale: 'it', // lingua di default
  fallbackLocale: 'en',
  globalInjection: true, // permette di usare $t nel template senza setup extra
  messages: {
    it,
    en
  }
});

export default i18n;
