import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getShowEntryPointMarker } from '../../store/map.reducer.ts';
import { entryIcon } from '../../../common/map/MapIcons.ts';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { layoutActions } from '../../store/layout.reducer.ts';
import {
    getEntryPointPositions,
    getEntryPointTooltip,
} from '../../logic/resolving/selectors/getEntryPointPositions.ts';

export function entryPointsDisplayHook(breakPointsLayer: MutableRefObject<LayerGroup | null>) {
    const entryPointPositions = useSelector(getEntryPointPositions);
    const showBreakMarker = useSelector(getShowEntryPointMarker);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = breakPointsLayer.current;
        if (!breakPointsLayer || !current) {
            return;
        }
        current.clearLayers();
        if (showBreakMarker) {
            entryPointPositions.forEach((entryPoint) => {
                const breakPointMarker = L.marker(toLatLng(entryPoint.point), {
                    icon: entryIcon,
                }).bindTooltip(getEntryPointTooltip(entryPoint), { sticky: true });
                breakPointMarker.on('click', () => {
                    const breakInfo = { entryPointId: entryPoint.id, trackId: entryPoint.trackId };
                    dispatch(trackMergeActions.setEntryPointEditInfo(breakInfo));
                    dispatch(layoutActions.setSelectedSidebarSection('tracks'));
                    dispatch(layoutActions.setSelectedTrackId(entryPoint.trackId));
                });
                breakPointMarker.addTo(current);
            });
        }
    }, [entryPointPositions, entryPointPositions.length, showBreakMarker]);
}
