import { useDispatch, useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getShowNodeMarker } from '../../store/map.reducer';
import { nodeMergeIcon } from '../../../common/map/MapIcons';
import { getNodePositions } from '../../logic/resolving/selectors/getNodePositions';
import { toLatLng } from '../../../utils/pointUtil';
import { nodesActions } from '../../store/nodes.reducer';
import { TRACK_MARKER } from '../panes';

export function nodePointsDisplayHook(pointsOfInterestLayer: RefObject<LayerGroup | null>) {
    const nodes = useSelector(getNodePositions);
    const showMapMarker = useSelector(getShowNodeMarker);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = pointsOfInterestLayer.current;
        if (!pointsOfInterestLayer || !current) {
            return;
        }
        current.clearLayers();
        if (showMapMarker) {
            nodes.forEach((node) => {
                const pointOfInterest = L.marker(toLatLng(node.point), {
                    icon: nodeMergeIcon,
                    pane: TRACK_MARKER,
                }).bindTooltip('Node point' + '\n' + node.tracks.join('\n'), { sticky: true });
                pointOfInterest.on('click', () => {
                    dispatch(nodesActions.setNodeEditInfo({ segmentAfterId: node.segmentIdAfter }));
                });
                pointOfInterest.addTo(current);
            });
        }
    }, [nodes, nodes.length, showMapMarker]);
}
