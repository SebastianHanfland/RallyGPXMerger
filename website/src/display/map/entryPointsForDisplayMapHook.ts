import { useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getDisplayEntryPoints } from '../store/displayTracksReducer';
import { toLatLng } from '../../utils/pointUtil';
import { markerIcon } from '../../common/map/MapIcons';

import { getEntryPointTime, getEntryPointTooltip } from '../../utils/entryPointUtil';
import { getShowTimes } from '../store/displayMapReducer';
import { useTimesConfig } from './useTimesConfig';

export function entryPointsForDisplayMapHook(breakPointsLayer: RefObject<LayerGroup | null>) {
    const entryPointPositions = useSelector(getDisplayEntryPoints);
    const showTimes = useSelector(getShowTimes);
    const useTimes = useTimesConfig();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = breakPointsLayer.current;
        if (!breakPointsLayer || !current) {
            return;
        }
        current.clearLayers();
        current.closePopup();

        entryPointPositions.forEach((entryPoint) => {
            const breakPointMarker = L.marker(toLatLng(entryPoint.point), { icon: markerIcon }).bindTooltip(
                getEntryPointTooltip(entryPoint),
                { sticky: true }
            );
            const addedMarker = breakPointMarker.addTo(current);
            if (showTimes && ['defaultOff', 'defaultOn'].includes(useTimes)) {
                const marker = addedMarker.bindPopup(getEntryPointTime(entryPoint), {
                    closeButton: false,
                    interactive: false,
                    autoClose: false,
                    closeOnEscapeKey: false,
                    closeOnClick: false,
                    autoPan: false,
                    offset: [0, 10],
                    maxWidth: 30,
                    minWidth: 30,
                });
                marker.openPopup();
            }
        });
    }, [entryPointPositions, entryPointPositions.length, showTimes]);
}
