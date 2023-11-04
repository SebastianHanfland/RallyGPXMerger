import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import { getGeoApifyKey } from '../store/geoCoding.reducer.ts';
import { addResolvedPosition, fromKey } from './initializeResolvedPositions.ts';
import { geoapifyFetchAddress } from './geoapifyApi.ts';
import { storage } from '../store/storage.ts';

export const resolvePositions = (_: Dispatch, getState: () => State) => {
    const geoApifyKey = getGeoApifyKey(getState());
    if (!geoApifyKey) {
        return;
    }
    let counter = 0;
    const resolvedPositions = storage.getResolvedPositions();
    Object.entries(resolvedPositions).forEach((entry) => {
        const [positionKey, streetValue] = entry;
        if (streetValue === null) {
            setTimeout(() => {
                const { lat, lon } = fromKey(positionKey);
                console.log({ lat, lon }, 'Retrieiving the Position');
                geoapifyFetchAddress(geoApifyKey)(lat, lon).then((streetValue) =>
                    addResolvedPosition(positionKey, streetValue)
                );
            }, 1000 * counter);
            counter += 1;
        }
    });
};
