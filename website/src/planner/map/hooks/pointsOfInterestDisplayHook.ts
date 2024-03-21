import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getShowPointsOfInterest } from '../../store/map.reducer.ts';
import { getPoints, pointsActions } from '../../store/points.reducer.ts';
import { PointOfInterest, PointOfInterestType } from '../../store/types.ts';
import { wcIcon } from '../../../common/MapIcons.ts';

function createPointOfInterest(point: PointOfInterest) {
    if (point.type === PointOfInterestType.TOILET) {
        return L.marker(point, { icon: wcIcon });
    }

    if (point.type === PointOfInterestType.IMPEDIMENT) {
        return L.circle(point, { radius: point.radiusInM, color: 'red' });
    }

    if (point.type === PointOfInterestType.COMMENT) {
        return L.circle(point, { radius: point.radiusInM, color: 'yellow' });
    }

    if (point.type === PointOfInterestType.GATHERING) {
        return L.circle(point, { radius: point.radiusInM, color: 'green' });
    }

    return L.circle(point, { radius: point.radiusInM, color: 'blue' });
}

export function pointsOfInterestDisplayHook(pointsOfInterestLayer: MutableRefObject<LayerGroup | null>) {
    const points = useSelector(getPoints);
    const showPointsOfInterest = useSelector(getShowPointsOfInterest);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = pointsOfInterestLayer.current;
        if (!pointsOfInterestLayer || !current) {
            return;
        }
        current.clearLayers();
        if (showPointsOfInterest) {
            points.forEach((point) => {
                const pointOfInterest = createPointOfInterest(point).bindTooltip(
                    point.title + '\n' + '\n' + point.description,
                    { sticky: true }
                );
                pointOfInterest.on('contextmenu', () => {
                    dispatch(pointsActions.setEditPointOfInterest(point));
                });
                pointOfInterest.addTo(current);
            });
        }
    }, [points, points.length, showPointsOfInterest]);
}
