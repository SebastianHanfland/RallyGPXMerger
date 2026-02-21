import { useRef } from 'react';
import { gpxShortener } from './gpxShortener.ts';
import { storage } from '../store/storage.ts';
import { State } from '../store/types.ts';
import { useDispatch } from 'react-redux';
import { loadStateAndSetUpPlanner } from '../useLoadPlanningFromServer.tsx';
import { useNavigate } from 'react-router';
import { StateOld } from '../store/typesOld.ts';
import { isOldState } from '../../migrate/types.ts';
import { migrateVersion1To2 } from '../../migrate/migrateVersion1To2.ts';

export function importHook() {
    const uploadInput = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const navigateTo = useNavigate();

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
                    const wholeState: State | StateOld = JSON.parse(shortenedLoadedState);
                    const correctedState = isOldState(wholeState) ? migrateVersion1To2(wholeState) : wholeState;

                    storage.save(correctedState);
                    loadStateAndSetUpPlanner(dispatch, correctedState);
                    navigateTo('?section=gps');
                })
                .catch(console.error);
        }
    };
    return { uploadInput, importButtonClicked, changeHandler };
}
