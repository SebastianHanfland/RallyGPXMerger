import { getLanguage } from '../language.ts';

export function formatNumber(numberToFormat: number, maximumFractionDigits = 2) {
    const language = getLanguage();
    return Intl.NumberFormat(language, { maximumFractionDigits: maximumFractionDigits }).format(numberToFormat);
}

export function formatFixedNumber(numberToFormat: number, fractionDigits: number) {
    const language = getLanguage();
    return Intl.NumberFormat(language, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(numberToFormat);
}
