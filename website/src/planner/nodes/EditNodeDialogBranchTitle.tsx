import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { getColor } from '../../utils/colorUtil.ts';
import { TrackComposition } from '../store/types.ts';
import { getParticipantsDelay } from '../store/settings.reducer.ts';
import { formatNumber } from '../../utils/numberUtil.ts';

interface Props {
    segmentId: string;
    tracks: TrackComposition[];
    peopleOffset: number;
}
export const EditNodeDialogBranchTitle = ({ segmentId, tracks, peopleOffset }: Props) => {
    const intl = useIntl();
    const participantsDelay = useSelector(getParticipantsDelay);

    return (
        <div key={segmentId} className={'mt-5 mb-2'}>
            {tracks.map((track) => (
                <span
                    key={track.id}
                    title={`${track.name}: ${track.peopleCount ?? 0} ${intl.formatMessage({
                        id: 'msg.trackPeople',
                    })}`}
                    style={{ backgroundColor: getColor(track), cursor: 'pointer' }}
                    className={'rounded-2 p-1'}
                >
                    {track.name}
                </span>
            ))}
            <span className={'mx-3'}>
                <FormattedMessage
                    id={'msg.offsetByXs'}
                    values={{
                        seconds: formatNumber(peopleOffset * participantsDelay, 0),
                    }}
                />
            </span>
        </div>
    );
};
