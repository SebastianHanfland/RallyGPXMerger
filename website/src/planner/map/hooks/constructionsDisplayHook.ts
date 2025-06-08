import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../../common/map/addTrackToMapLayer.ts';
import { getShowConstructions } from '../../store/map.reducer.ts';
import { getConstructionSegments } from '../../new-store/segmentData.redux.ts';

export function constructionsDisplayHook(gpxSegmentsLayer: MutableRefObject<LayerGroup | null>) {
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
