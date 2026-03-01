import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getDisplayEntryPoints } from '../store/displayTracksReducer.ts';
import { toLatLng } from '../../utils/pointUtil.ts';
import { entryIcon } from '../../common/map/MapIcons.ts';
import { getEntryPointTooltip } from '../../planner/logic/resolving/selectors/getEntryPointPositions.ts';

export function entryPointsForDisplayMapHook(breakPointsLayer: MutableRefObject<LayerGroup | null>) {
    const entryPointPositions = useSelector(getDisplayEntryPoints);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = breakPointsLayer.current;
        if (!breakPointsLayer || !current) {
            return;
        }
        current.clearLayers();
        entryPointPositions.forEach((entryPoint) => {
            const breakPointMarker = L.marker(toLatLng(entryPoint.point), {
                icon: entryIcon,
            }).bindTooltip(getEntryPointTooltip(entryPoint), { sticky: true });
            breakPointMarker.addTo(current);
        });
    }, [entryPointPositions, entryPointPositions.length]);
}
