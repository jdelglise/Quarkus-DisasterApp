import translationEN from "./assets/locales/en/translation.json";
import translationFR from "./assets/locales/fr/translation.json";
import * as Localization from "./node_modules/expo-localization";
import i18n from "./node_modules/i18next";
import { initReactI18next } from "./node_modules/react-i18next";

i18n.use(initReactI18next).init({
  lng: Localization.locale,
  fallbackLng: "en",
  resources: {
    en: {
      translation: translationEN,
    },
    fr: {
      translation: translationFR,
    },
  },
});

export default i18n;
