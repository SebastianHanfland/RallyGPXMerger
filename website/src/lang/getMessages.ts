import { getLanguage } from '../language.ts';
import en from './en.json';
import de from './de.json';
export function getMessages() {
    const language = getLanguage();
    switch (language) {
        case 'de':
            return de;
        case 'en':
            return en;
    }
}
