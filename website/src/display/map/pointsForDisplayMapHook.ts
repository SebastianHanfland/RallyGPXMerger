import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getPlanningState } from '../store/displayTracksReducer.ts';
import { createPointOfInterestMarker } from '../../common/map/pointOfInterestMarker.ts';
import { getPointTypeMessageId, isPublicPointType } from '../../planner/points/pointOfInterestConfig.ts';

export function pointsForDisplayMapHook(pointsLayer: RefObject<LayerGroup | null>) {
    const planningState = useSelector(getPlanningState);
    const intl = useIntl();
    const points = planningState?.points.points.filter((point) => isPublicPointType(point.type)) ?? [];

    useEffect(() => {
        const current = pointsLayer.current;
        if (!current) {
            return;
        }
        current.clearLayers();
        points.forEach((point) => {
            const marker = createPointOfInterestMarker(point).bindTooltip(
                `${intl.formatMessage({ id: getPointTypeMessageId(point.type) })}: ${point.title}\n\n${point.description}`,
                { sticky: true }
            );
            marker.addTo(current);
        });
    }, [pointsLayer, points, points.length, intl]);
}
