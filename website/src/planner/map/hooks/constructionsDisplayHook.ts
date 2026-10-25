import { useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../../common/map/addTrackToMapLayer';
import { getShowConstructions } from '../../store/map.reducer';
import { getConstructionSegments } from '../../store/segmentData.redux';

export function constructionsDisplayHook(gpxSegmentsLayer: RefObject<LayerGroup | null>) {
    const gpxSegments = useSelector(getConstructionSegments) ?? [];
    const showConstructions = useSelector(getShowConstructions) ?? false;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(gpxSegmentsLayer, gpxSegments, showConstructions, {
            showMarker: false,
            color: 'red',
            opacity: 1,
            weight: 12,
        });
    }, [gpxSegments, gpxSegments.length, showConstructions]);
}
