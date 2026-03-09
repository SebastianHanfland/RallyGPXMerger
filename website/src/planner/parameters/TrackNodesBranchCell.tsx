import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useSelector } from 'react-redux';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { getColor } from '../../utils/colorUtil.ts';
import { TrackNode } from '../../common/calculation/nodes/nodeFinder.ts';
import { getBranchTrackIds } from '../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';

interface Props {
    trackNode: TrackNode;
}

export const TrackNodesBranchCell = ({ trackNode }: Props) => {
    const tracks = useSelector(getTrackCompositions);
    const branchTrackIds = getBranchTrackIds(trackNode);

    function getColorOfTrackId(trackId: string) {
        const foundTrack = tracks.find((track) => track.id === trackId);
        return getColor(foundTrack ?? { id: trackId });
    }

    function getNameOfTrackId(trackId: string) {
        return tracks.find((track) => track.id === trackId)?.name ?? trackId;
    }

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
                    )
                </span>
            ))}
        </>
    );
};
