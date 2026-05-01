import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getDisplayEntryPoints } from '../store/displayTracksReducer.ts';
import { toLatLng } from '../../utils/pointUtil.ts';
import { entryIcon } from '../../common/map/MapIcons.ts';

import { getEntryPointTime, getEntryPointTooltip } from '../../utils/entryPointUtil.ts';
import { getShowTimes } from '../store/displayMapReducer.ts';

export function entryPointsForDisplayMapHook(breakPointsLayer: MutableRefObject<LayerGroup | null>) {
    const entryPointPositions = useSelector(getDisplayEntryPoints);
    const showTimes = useSelector(getShowTimes);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = breakPointsLayer.current;
        if (!breakPointsLayer || !current) {
            return;
        }
        current.clearLayers();
        current.closePopup();

        entryPointPositions.forEach((entryPoint) => {
            const breakPointMarker = L.marker(toLatLng(entryPoint.point), {
                icon: entryIcon,
            }).bindTooltip(getEntryPointTooltip(entryPoint), { sticky: true });
            const addedMarker = breakPointMarker.addTo(current);
            if (showTimes) {
                addedMarker
                    .bindPopup(getEntryPointTime(entryPoint), {
                        closeButton: false,
                        interactive: false,
                        autoClose: false,
                        closeOnClick: false,
                        offset: [-48, 0],
                    })
                    .openPopup();
            }
        });
    }, [entryPointPositions, entryPointPositions.length, showTimes]);
}
