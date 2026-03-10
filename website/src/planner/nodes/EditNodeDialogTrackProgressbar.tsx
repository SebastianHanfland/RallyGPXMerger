import { useSelector } from 'react-redux';
import { ProgressBar } from 'react-bootstrap';
import { getColor } from '../../utils/colorUtil.ts';
import { TrackComposition } from '../store/types.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
} from '../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';

interface Props {
    segmentId: string;
    tracks: TrackComposition[];
    offset: number;
    total: number;
}

export const EditNodeDialogTrackProgressbar = ({ segmentId, tracks, offset, total }: Props) => {
    const branchNumbers = useSelector(getBranchNumbersSelector);

    return (
        <div className={'flex-fill mx-2'}>
            {tracks.map((track) => (
                <ProgressBar
                    key={segmentId + track.id}
                    className={'flex-fill mx-2'}
                    style={{ height: `${120 / tracks.length}px` }}
                >
                    <ProgressBar
                        now={(offset / total) * 100}
                        variant={'gray'}
                        className={'bg-transparent'}
                        style={{ height: '20px' }}
                        visuallyHidden
                        key={0}
                    />
                    <ProgressBar
                        now={((branchNumbers[getBranchId(tracks.map(({ id }) => id))] ?? 0) / total) * 100}
                        style={{ cursor: 'pointer', background: getColor(track) }}
                    />
                </ProgressBar>
            ))}
        </div>
    );
};
