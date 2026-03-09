import { useSelector } from 'react-redux';
import { getDelaysOfTracksSelector } from '../../../common/calculation/calculated-tracks/getSpecifiedDelayPerTrack.ts';
import { getColor } from '../../../utils/colorUtil.ts';
import { ProgressBar } from 'react-bootstrap';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getParticipantsDelay } from '../../store/settings.reducer.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
} from '../../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';
import { useIntl } from 'react-intl';

export const NodeOverviewContent = () => {
    const intl = useIntl();
    const delaysOfTracks = useSelector(getDelaysOfTracksSelector);
    const tracks = useSelector(getTrackCompositions);
    const participantsDelay = useSelector(getParticipantsDelay);
    const branchNumbers = useSelector(getBranchNumbersSelector);
    const totalSize = branchNumbers[getBranchId(tracks.map(({ id }) => id))];
    const people = intl.formatMessage({ id: 'msg.people' });
    const direction = intl.formatMessage({ id: 'msg.direction' });

    return (
        <>
            <div>{`<= ${direction}`}</div>
            {delaysOfTracks.map((trackDelay) => {
                const foundTrack = tracks.find((track) => track.id === trackDelay.trackId);
                console.log({ foundTrack });
                return (
                    <div>
                        <div>{`${foundTrack?.name ?? ''} (${foundTrack?.peopleCount} ${people})`}</div>
                        <div>
                            <ProgressBar
                                key={trackDelay.trackId}
                                className={'flex-fill mx-2'}
                                style={{ height: '30px' }}
                            >
                                {trackDelay.delays.map((delay) => (
                                    <ProgressBar
                                        striped={true}
                                        now={(delay.extraDelay / participantsDelay / totalSize) * 100}
                                        key={delay.segmentId}
                                        className={'bg-transparent text-dark'}
                                        label={
                                            (delay.extraDelay / participantsDelay / totalSize) * 100 > 10
                                                ? delay.extraDelay / participantsDelay
                                                : undefined
                                        }
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                                <ProgressBar
                                    now={((foundTrack?.peopleCount ?? 0) / totalSize) * 100}
                                    title={foundTrack?.name}
                                    label={foundTrack?.peopleCount}
                                    className={'text-light'}
                                    style={{ height: '30px', background: foundTrack ? getColor(foundTrack) : 'white' }}
                                    visuallyHidden
                                    key={0}
                                />
                            </ProgressBar>
                        </div>
                    </div>
                );
            })}
        </>
    );
};
