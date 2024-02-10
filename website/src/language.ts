export type SupportedLanguages = 'de' | 'en';

let language: SupportedLanguages = 'de';

export const getLanguage = () => language;
export const setLanguage = (newLanguage: SupportedLanguages) => {
    language = newLanguage;
};

export const getInitialLanguage = (): SupportedLanguages => {
    return window.navigator.language.includes('de') ? 'de' : 'en';
};
