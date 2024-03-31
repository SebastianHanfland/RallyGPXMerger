import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getShowPointsOfInterest } from '../../store/map.reducer.ts';
import { nodeMergeIcon } from '../../../common/MapIcons.ts';
import { getNodePositions } from '../../logic/resolving/selectors/getNodePositions.ts';
import { toLatLng } from '../../../utils/pointUtil.ts';

export function nodePointsDisplayHook(pointsOfInterestLayer: MutableRefObject<LayerGroup | null>) {
    const points = useSelector(getNodePositions);
    const showPointsOfInterest = useSelector(getShowPointsOfInterest);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = pointsOfInterestLayer.current;
        if (!pointsOfInterestLayer || !current) {
            return;
        }
        current.clearLayers();
        if (showPointsOfInterest) {
            points.forEach((point) => {
                const pointOfInterest = L.marker(toLatLng(point.point), { icon: nodeMergeIcon }).bindTooltip(
                    'Node point' + '\n' + point.tracks.join('\n'),
                    { sticky: true }
                );
                // pointOfInterest.on('contextmenu', () => {
                //     dispatch(pointsActions.setEditPointOfInterest(point));
                // });
                pointOfInterest.addTo(current);
            });
        }
    }, [points, points.length, showPointsOfInterest]);
}
