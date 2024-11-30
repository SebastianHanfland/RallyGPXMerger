import { ChangeEvent } from 'react';

export function getCount(value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!value.target.value) {
        return undefined;
    }
    const number = Number(value.target.value);
    if (isNaN(number)) {
        return undefined;
    }
    if (number < 0) {
        return 0;
    }

    return number;
}
