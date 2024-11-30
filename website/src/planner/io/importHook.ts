import { useRef } from 'react';
import { gpxShortener } from './gpxShortener.ts';
import { storage } from '../store/storage.ts';
import { getBaseUrl } from '../../utils/linkUtil.ts';

export function importHook() {
    const uploadInput = useRef<HTMLInputElement>(null);

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
                    storage.save(JSON.parse(shortenedLoadedState));
                    history.pushState('', '', getBaseUrl() + '?section=menu');
                    history.pushState('', '', getBaseUrl() + '?section=gps');
                    window.location.reload();
                })
                .catch(console.error);
        }
    };
    return { uploadInput, importButtonClicked, changeHandler };
}
