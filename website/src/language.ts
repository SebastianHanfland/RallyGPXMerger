type Language = 'de' | 'en';

let language: Language = 'de';

export const getLanguage = () => language;
export const setLanguage = (newLanguage: Language) => {
    language = newLanguage;
};
