import { useDispatch, useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getShowPointsOfInterest } from '../../store/map.reducer.ts';
import { getPoints, pointsActions } from '../../store/points.reducer.ts';
import { createPointOfInterestMarker } from '../../../common/map/pointOfInterestMarker.ts';
import { getGaps } from '../../calculation/getGaps.ts';

export function pointsOfInterestDisplayHook(pointsOfInterestLayer: RefObject<LayerGroup | null>) {
    const points = useSelector(getPoints);
    const gaps = useSelector(getGaps);
    const showPointsOfInterest = useSelector(getShowPointsOfInterest);
    const dispatch = useDispatch();

    const pointsToDisplay = showPointsOfInterest ? [...points, ...gaps] : gaps;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = pointsOfInterestLayer.current;
        if (!pointsOfInterestLayer || !current) {
            return;
        }
        current.clearLayers();
        pointsToDisplay.forEach((point) => {
            const pointOfInterest = createPointOfInterestMarker(point).bindTooltip(
                point.title + '\n' + '\n' + point.description,
                { sticky: true }
            );
            pointOfInterest.on('contextmenu', () => {
                dispatch(pointsActions.setEditPointOfInterest(point));
            });
            pointOfInterest.addTo(current);
        });
    }, [pointsToDisplay, pointsToDisplay.length, showPointsOfInterest]);
}
