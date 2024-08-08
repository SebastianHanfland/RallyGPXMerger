import { getLanguage, SupportedLanguages } from '../language.ts';
import en from './en.json';
import de from './de.json';
export function getMessages(displayLanguage?: SupportedLanguages) {
    const language = displayLanguage ?? getLanguage();
    switch (language) {
        case 'de':
            return de;
        case 'en':
            return en;
    }
}
