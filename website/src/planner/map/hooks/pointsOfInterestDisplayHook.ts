import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getShowPointsOfInterest } from '../../store/map.reducer.ts';
import { getPoints } from '../../store/points.reducer.ts';

export function pointsOfInterestDisplayHook(pointsOfInterestLayer: MutableRefObject<LayerGroup | null>) {
    const points = useSelector(getPoints);
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
                const connection = L.circle(point, {
                    radius: point.radiusInM,
                    // weight: options.weight ?? 8,
                    // color: options.color ?? getColorFromUuid(gpxSegment.id),
                    // opacity: options.opacity ?? 0.6,
                }).bindTooltip(point.title + '\n' + '\n' + point.description, {
                    sticky: true,
                });
                connection.addTo(current);
            });
        }
    }, [points, points.length, showPointsOfInterest]);
}
