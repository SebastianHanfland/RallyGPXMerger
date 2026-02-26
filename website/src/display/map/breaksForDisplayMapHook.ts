import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getDisplayBreaks } from '../store/displayTracksReducer.ts';
import { toLatLng } from '../../utils/pointUtil.ts';
import { breakIcon, wcIcon } from '../../common/map/MapIcons.ts';
import { getBreakTooltip } from '../../planner/logic/resolving/selectors/getBreakPositions.ts';

export function breaksForDisplayMapHook(breakPointsLayer: MutableRefObject<LayerGroup | null>) {
    const breakPoints = useSelector(getDisplayBreaks);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = breakPointsLayer.current;
        if (!breakPointsLayer || !current) {
            return;
        }
        current.clearLayers();
        breakPoints.forEach((breakPoint) => {
            const breakPointMarker = L.marker(toLatLng(breakPoint.point), {
                icon: breakPoint.hasToilet ? wcIcon : breakIcon,
            }).bindTooltip(getBreakTooltip(breakPoint), { sticky: true });
            breakPointMarker.addTo(current);
        });
    }, [breakPoints, breakPoints.length]);
}
