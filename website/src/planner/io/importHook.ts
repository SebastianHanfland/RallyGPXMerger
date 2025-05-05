import { useRef } from 'react';
import { gpxShortener } from './gpxShortener.ts';
import { storage } from '../store/storage.ts';
import { State } from '../store/types.ts';
import { useDispatch } from 'react-redux';

export function importHook() {
    const uploadInput = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const importButtonClicked = () => {
        const current = uploadInput.current;
        if (current) {
            current.click();
        }
    };

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            files[0]
                ?.text()
                .then((loadedState) => {
                    const shortenedLoadedState = gpxShortener(loadedState);
                    const wholeState: State = JSON.parse(shortenedLoadedState);
                    storage.save(wholeState);
                    dispatch({ payload: wholeState, type: 'wholeState' });
                })
                .catch(console.error);
        }
    };
    return { uploadInput, importButtonClicked, changeHandler };
}
