import { useSelector } from 'react-redux';
import arrowDown from '../../assets/arrow-down.svg';
import arrowUp from '../../assets/arrow-up.svg';
import { getGaps } from '../logic/calculate/calculatingGaps.ts';

interface Props {
    segmentId: string;
    trackId: string;
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
                    title={gapBefore?.description}
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
                    title={gapAfter?.description}
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
