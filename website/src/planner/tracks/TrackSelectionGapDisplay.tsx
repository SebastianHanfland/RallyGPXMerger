import { useSelector } from 'react-redux';
import arrowDown from '../../assets/arrow-down.svg';
import arrowUp from '../../assets/arrow-up.svg';
import { getGaps } from '../logic/calculate/calculatingGaps.ts';
import { GapPoint } from '../store/types.ts';

interface Props {
    segmentId: string;
    trackId: string;
}

function getTitle(gapAfter: GapPoint) {
    return gapAfter?.title + '\n' + gapAfter?.description;
}

export function TrackSelectionGapDisplay({ segmentId, trackId }: Props) {
    const gaps = useSelector(getGaps);
    const gapsOfTrack = gaps.filter((gap) => gap.trackId === trackId);
    const gapBefore = gapsOfTrack.find((gap) => gap.segmentIdAfter === segmentId);
    const gapAfter = gapsOfTrack.find((gap) => gap.segmentIdBefore === segmentId);

    if (!gapAfter && !gapBefore) {
        return null;
    }

    return (
        <>
            {gapBefore && (
                <span
                    title={getTitle(gapBefore)}
                    style={{ backgroundColor: 'orange', padding: '5px' }}
                    className={'rounded-2'}
                >
                    <span className={'mx-1'}>
                        <img src={arrowUp} alt={'look up'} />
                    </span>
                </span>
            )}
            {gapAfter && (
                <span
                    title={getTitle(gapAfter)}
                    style={{ backgroundColor: 'orange', padding: '5px' }}
                    className={'rounded-2'}
                >
                    <span className={'mx-1'}>
                        <img src={arrowDown} alt={'look down'} />
                    </span>
                </span>
            )}
        </>
    );
}
