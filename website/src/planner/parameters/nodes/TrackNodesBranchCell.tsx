import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { useDispatch, useSelector } from 'react-redux';
import { ColorBlob } from '../../../utils/ColorBlob.tsx';
import { getColor } from '../../../utils/colorUtil.ts';
import { TrackNode } from '../../../common/calculation/nodes/nodeFinder.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
    getBranchTrackIds,
} from '../../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';
import { isDefined } from '../../../utils/typeUtil.ts';
import { GeoLinkIcon } from '../../../utils/icons/GeoLinkIcon.tsx';
import { mapActions } from '../../store/map.reducer.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { getLatLng } from '../../../utils/pointUtil.ts';

interface Props {
    trackNode: TrackNode;
}

export const TrackNodesBranchCell = ({ trackNode }: Props) => {
    const tracks = useSelector(getTrackCompositions);
    const branchTrackIds = getBranchTrackIds(trackNode);
    const branchNumbers = useSelector(getBranchNumbersSelector);
    const dispatch = useDispatch();
    const segments = useSelector(getParsedGpxSegments);
    const foundSegment = segments.find((segment) => segment.id === trackNode.segmentIdAfterNode);

    function getColorOfTrackId(trackId: string) {
        const foundTrack = tracks.find((track) => track.id === trackId);
        return getColor(foundTrack ?? { id: trackId });
    }

    function getNameOfTrackId(trackId: string) {
        return tracks.find((track) => track.id === trackId)?.name ?? trackId;
    }
    const trackIdsAfterNode = Object.values(branchTrackIds)
        .filter(isDefined)
        .flatMap((ids) => ids);

    return (
        <>
            {Object.values(branchTrackIds).map((trackIds) => (
                <span>
                    (
                    {trackIds?.map((trackId) => (
                        <span title={getNameOfTrackId(trackId)}>
                            <ColorBlob color={getColorOfTrackId(trackId)} />
                        </span>
                    ))}
                    {trackIds && branchNumbers[getBranchId(trackIds)]})
                </span>
            ))}
            <span>{`=> ${branchNumbers[getBranchId(trackIdsAfterNode)]}`}</span>
            {foundSegment && foundSegment.points.length > 0 && (
                <span
                    style={{ padding: '5px' }}
                    className={'rounded-2'}
                    onClick={() => dispatch(mapActions.setPointToCenter(getLatLng(foundSegment.points[0])))}
                >
                    <GeoLinkIcon />
                </span>
            )}
        </>
    );
};
