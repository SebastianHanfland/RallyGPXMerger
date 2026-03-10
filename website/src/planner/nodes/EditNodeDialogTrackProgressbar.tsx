import { useSelector } from 'react-redux';
import { ProgressBar } from 'react-bootstrap';
import { getColor } from '../../utils/colorUtil.ts';
import { BREAK, TrackComposition } from '../store/types.ts';
import {
    getDelaysOfTracksSelector,
    TrackDelayDetails,
} from '../../common/calculation/calculated-tracks/getSpecifiedDelayPerTrack.ts';

interface Props {
    segmentId: string;
    tracks: TrackComposition[];
    offset: number;
    total: number;
}

function getDelayOfTrackUntilSegment(
    delaysOfTrack: TrackDelayDetails[],
    track: TrackComposition,
    segmentId: string
): number {
    let delayCounter = 0;
    let segmentPassed = false;
    const foundTrackDelay = delaysOfTrack.find((trackDelay) => trackDelay.trackId === track.id);
    foundTrackDelay?.delays
        .filter((delay) => delay.by !== BREAK)
        .forEach((delay) => {
            if (!segmentPassed) {
                delayCounter += delay.extraDelay;
            }
            if (delay.segmentId === segmentId) {
                segmentPassed = true;
            }
        });
    return delayCounter;
}

function getAdditionalOffset(
    delaysOfTrack: TrackDelayDetails[],
    track: TrackComposition,
    tracks: TrackComposition[],
    segmentId: string
): number {
    const allOffsetsAtPoint = tracks.map((tr) => getDelayOfTrackUntilSegment(delaysOfTrack, tr, segmentId));
    console.log(allOffsetsAtPoint);
    return getDelayOfTrackUntilSegment(delaysOfTrack, track, segmentId) - Math.min(...allOffsetsAtPoint);
}

export const EditNodeDialogTrackProgressbar = ({ segmentId, tracks, offset, total }: Props) => {
    const delaysOfTrack = useSelector(getDelaysOfTracksSelector);

    return (
        <div className={'flex-fill mx-2'}>
            {tracks.map((track) => {
                const additionalOffset = getAdditionalOffset(delaysOfTrack, track, tracks, segmentId);
                return (
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
                            key={1}
                        />
                        <ProgressBar
                            now={(additionalOffset / total) * 100}
                            variant={'gray'}
                            className={'bg-transparent'}
                            style={{ height: '20px' }}
                            visuallyHidden
                            key={2}
                        />
                        <ProgressBar
                            key={3}
                            now={((track.peopleCount ?? 0) / total) * 100}
                            style={{ cursor: 'pointer', background: getColor(track) }}
                        />
                    </ProgressBar>
                );
            })}
        </div>
    );
};
