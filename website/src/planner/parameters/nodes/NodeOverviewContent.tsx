import { useSelector } from 'react-redux';
import { getDelaysOfTracksSelector } from '../../../common/calculation/calculated-tracks/getSpecifiedDelayPerTrack.ts';
import { getColor } from '../../../utils/colorUtil.ts';
import { ProgressBar } from 'react-bootstrap';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getParticipantsDelay } from '../../store/settings.reducer.ts';
import { useIntl } from 'react-intl';
import { BREAK } from '../../store/types.ts';
import { compareDelays, getTotalDelay } from '../../../utils/delayUtil.ts';

export const NodeOverviewContent = () => {
    const intl = useIntl();
    const delaysOfTracks = useSelector(getDelaysOfTracksSelector);
    const tracks = useSelector(getTrackCompositions);
    const participantsDelay = useSelector(getParticipantsDelay);
    const numbers = delaysOfTracks.map(
        (delayOfTrack) =>
            getTotalDelay(delayOfTrack) / participantsDelay +
            (tracks.find((track) => track.id === delayOfTrack.trackId)?.peopleCount ?? 0)
    );
    const totalSize = Math.max(...numbers);

    const people = intl.formatMessage({ id: 'msg.people' });
    const direction = intl.formatMessage({ id: 'msg.direction' });

    const sortedTrackDelays = delaysOfTracks.sort(compareDelays);

    return (
        <>
            <div>{`<= ${direction}`}</div>
            {sortedTrackDelays.map((trackDelay) => {
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
                                {trackDelay.delays
                                    .filter((delay) => delay.by !== BREAK)
                                    .map((delay) => (
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
