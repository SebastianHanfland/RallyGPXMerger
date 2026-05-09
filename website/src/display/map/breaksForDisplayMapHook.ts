import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getDisplayBreaks, getDisplayEntryPoints } from '../store/displayTracksReducer.ts';
import { toLatLng } from '../../utils/pointUtil.ts';
import { breakIcon, loweredBreakIcon, loweredWcIcon, wcIcon } from '../../common/map/MapIcons.ts';
import { getBreakTooltip } from '../../planner/logic/resolving/selectors/getBreakPositions.ts';

function getLocationKey(point: { lat: number; lon: number }): string {
    return `${point.lat}${point.lon}`;
}

function getIcon(hasToilet: boolean, hasAlsoEntryPoint: boolean) {
    if (hasAlsoEntryPoint) {
        return hasToilet ? loweredWcIcon : loweredBreakIcon;
    }
    return hasToilet ? wcIcon : breakIcon;
}

export function breaksForDisplayMapHook(breakPointsLayer: MutableRefObject<LayerGroup | null>) {
    const entryPointPositions = useSelector(getDisplayEntryPoints);
    const breakPoints = useSelector(getDisplayBreaks);
    const entryRecords: Record<string, boolean | undefined> = {};
    entryPointPositions.forEach((entryPoint) => {
        const locationKey = getLocationKey(entryPoint.point);
        entryRecords[locationKey] = true;
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = breakPointsLayer.current;
        if (!breakPointsLayer || !current) {
            return;
        }
        current.clearLayers();
        breakPoints.forEach((breakPoint) => {
            const hasAlsoEntryPoint = !!entryRecords[getLocationKey(breakPoint.point)];

            const breakPointMarker = L.marker(toLatLng(breakPoint.point), {
                icon: getIcon(breakPoint.hasToilet, hasAlsoEntryPoint),
            }).bindTooltip(getBreakTooltip(breakPoint), { sticky: true });
            breakPointMarker.addTo(current);
        });
    }, [breakPoints, breakPoints.length]);
}
