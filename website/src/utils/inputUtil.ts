import { ChangeEvent } from 'react';

export function getCount(value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!value.target.value) {
        return undefined;
    }
    const number = Number(value.target.value);
    return isNaN(number) ? undefined : number;
}
