import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getDisplayEntryPoints } from '../store/displayTracksReducer.ts';
import { toLatLng } from '../../utils/pointUtil.ts';
import { markerIcon } from '../../common/map/MapIcons.ts';

import { getEntryPointTime, getEntryPointTooltip } from '../../utils/entryPointUtil.ts';
import { getShowTimes } from '../store/displayMapReducer.ts';
import { useGetUrlParam } from '../../utils/linkUtil.ts';

export function entryPointsForDisplayMapHook(breakPointsLayer: MutableRefObject<LayerGroup | null>) {
    const entryPointPositions = useSelector(getDisplayEntryPoints);
    const showTimes = useSelector(getShowTimes);
    const useTimes = useGetUrlParam('times=');

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
            if (showTimes) {
                addedMarker
                    .bindPopup(getEntryPointTime(entryPoint), {
                        closeButton: false,
                        interactive: false,
                        autoClose: false,
                        closeOnEscapeKey: false,
                        closeOnClick: false,
                        offset: [0, 10],
                        maxWidth: 30,
                        minWidth: 30,
                    })
                    .openPopup();
            }
        });
    }, [entryPointPositions, entryPointPositions.length, showTimes]);
}
