import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
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
    const intl = useIntl();
    const branchNumbers = useSelector(getBranchNumbersSelector);

    const aggregated = true;

    return (
        <ProgressBar key={segmentId} className={'flex-fill mx-2'} style={{ height: '30px' }}>
            <ProgressBar
                now={(offset / total) * 100}
                variant={'gray'}
                className={'bg-transparent'}
                style={{ height: '20px' }}
                visuallyHidden
                key={0}
            />
            {aggregated && (
                <ProgressBar
                    now={((branchNumbers[getBranchId(tracks.map(({ id }) => id))] ?? 0) / total) * 100}
                    style={{ cursor: 'pointer', background: getColor({ id: segmentId }) }}
                />
            )}

            {!aggregated &&
                tracks.map((track) => (
                    <ProgressBar
                        now={((track.peopleCount ?? 0) / total) * 100}
                        title={`${track.name}: ${track.peopleCount ?? 0} ${intl.formatMessage({
                            id: 'msg.trackPeople',
                        })}`}
                        key={track.id}
                        style={{ cursor: 'pointer', background: getColor(track) }}
                    />
                ))}
        </ProgressBar>
    );
};
