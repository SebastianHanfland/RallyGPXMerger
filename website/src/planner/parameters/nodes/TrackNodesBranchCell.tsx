import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { useSelector } from 'react-redux';
import { ColorBlob } from '../../../utils/ColorBlob.tsx';
import { getColor } from '../../../utils/colorUtil.ts';
import { TrackNode } from '../../../common/calculation/nodes/nodeFinder.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
    getBranchTrackIds,
} from '../../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';
import { isDefined } from '../../../utils/typeUtil.ts';

interface Props {
    trackNode: TrackNode;
}

export const TrackNodesBranchCell = ({ trackNode }: Props) => {
    const tracks = useSelector(getTrackCompositions);
    const branchTrackIds = getBranchTrackIds(trackNode);
    const branchNumbers = useSelector(getBranchNumbersSelector);

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
        </>
    );
};
