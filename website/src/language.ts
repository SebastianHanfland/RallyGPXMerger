export type SupportedLanguages = 'de' | 'en';

export const getInitialLanguage = (): SupportedLanguages => {
    console.log('Evaluating language', window.navigator.language);
    return window.navigator.language.includes('de') ? 'de' : 'en';
};

let language: SupportedLanguages = getInitialLanguage();

export const getLanguage = () => language;
export const setLanguage = (newLanguage: SupportedLanguages) => {
    language = newLanguage;
};
