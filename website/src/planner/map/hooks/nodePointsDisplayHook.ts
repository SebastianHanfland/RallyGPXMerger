import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getShowMapMarker } from '../../store/map.reducer.ts';
import { nodeMergeIcon } from '../../../common/map/MapIcons.ts';
import { getNodePositions } from '../../logic/resolving/selectors/getNodePositions.ts';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { nodesActions } from '../../store/nodes.reducer.ts';

export function nodePointsDisplayHook(pointsOfInterestLayer: MutableRefObject<LayerGroup | null>) {
    const nodes = useSelector(getNodePositions);
    const showMapMarker = useSelector(getShowMapMarker);
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
                }).bindTooltip('Node point' + '\n' + node.tracks.join('\n'), { sticky: true });
                pointOfInterest.on('click', () => {
                    dispatch(nodesActions.setNodeEditInfo({ segmentAfterId: node.segmentIdAfter }));
                });
                pointOfInterest.addTo(current);
            });
        }
    }, [nodes, nodes.length, showMapMarker]);
}
