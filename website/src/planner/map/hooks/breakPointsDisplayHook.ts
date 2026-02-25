import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getShowBreakMarker } from '../../store/map.reducer.ts';
import { breakIcon, wcIcon } from '../../../common/map/MapIcons.ts';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { getBreakPositions } from '../../logic/resolving/selectors/getBreakPositions.ts';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';

export function breakPointsDisplayHook(breakPointsLayer: MutableRefObject<LayerGroup | null>) {
    const breakPoints = useSelector(getBreakPositions);
    const showBreakMarker = useSelector(getShowBreakMarker);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = breakPointsLayer.current;
        if (!breakPointsLayer || !current) {
            return;
        }
        current.clearLayers();
        if (showBreakMarker) {
            breakPoints.forEach((breakPoint) => {
                const breakPointMarker = L.marker(toLatLng(breakPoint.point), {
                    icon: breakPoint.hasToilet ? wcIcon : breakIcon,
                }).bindTooltip(breakPoint.description + ` break ${breakPoint.minutes} minutes`, { sticky: true });
                breakPointMarker.on('click', () => {
                    dispatch(
                        trackMergeActions.setBreakEditInfo({ breakId: breakPoint.breakId, trackId: breakPoint.trackId })
                    );
                });
                breakPointMarker.addTo(current);
            });
        }
    }, [breakPoints, breakPoints.length, showBreakMarker]);
}
