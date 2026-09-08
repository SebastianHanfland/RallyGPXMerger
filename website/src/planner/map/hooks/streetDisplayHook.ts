import { RefObject, useEffect } from 'react';
import L, { LayerGroup, LeafletMouseEvent } from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { getShowBlockStreets, mapActions } from '../../store/map.reducer.ts';
import { getTrackStreetInfos } from '../../calculation/getTrackStreetInfos.ts';
import { TrackWayPointType } from '../../logic/resolving/types.ts';
import { getStreetPath } from '../../streets/streetEditing.ts';
import { getColor } from '../../../utils/colorUtil.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';

export function streetDisplayHook(streetsLayer: RefObject<LayerGroup | null>) {
    const streetInfos = useSelector(getTrackStreetInfos);
    const tracks = useSelector(getTrackCompositions);
    const showStreets = useSelector(getShowBlockStreets);
    const dispatch = useDispatch();

    useEffect(() => {
        const current = streetsLayer.current;
        if (!current) return;
        current.clearLayers();
        if (!showStreets) return;

        streetInfos.forEach((trackInfo) => {
            const track = tracks.find(({ id }) => id === trackInfo.id);
            trackInfo.wayPoints
                .filter((waypoint) => waypoint.type === TrackWayPointType.Track && waypoint.s !== undefined)
                .forEach((waypoint) => {
                    const path = getStreetPath(waypoint);
                    const line = L.polyline(
                        path.map((point) => ({ lat: point.lat, lng: point.lon })),
                        {
                            color: getColor(track ?? { id: trackInfo.id }),
                            weight: 8,
                            opacity: 0.85,
                        }
                    );
                    line.bindTooltip(`${trackInfo.name}: ${waypoint.streetName ?? 'unknown'}`, { sticky: true });
                    line.on('mouseover', () => line.setStyle({ weight: 12 }));
                    line.on('mouseout', () => line.setStyle({ weight: 8 }));
                    line.on('click', (event: LeafletMouseEvent) => {
                        event.originalEvent?.stopPropagation();
                        dispatch(
                            mapActions.setClickOnStreet({
                                trackId: trackInfo.id,
                                streetIndex: waypoint.s!,
                                lat: event.latlng.lat,
                                lng: event.latlng.lng,
                            })
                        );
                    });
                    line.addTo(current);
                });
        });
    }, [dispatch, showStreets, streetInfos, tracks, streetsLayer]);
}
