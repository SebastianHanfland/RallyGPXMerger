import { useDispatch, useSelector } from 'react-redux';
import arrowDown from '../../../assets/arrow-down.svg';
import arrowUp from '../../../assets/arrow-up.svg';
import { GapPoint } from '../../store/types';

import { WarningIcon } from '../../../utils/icons/WarningIcon';
import { getGaps } from '../../calculation/getGaps';
import { mapActions } from '../../store/map.reducer';
import { GeoLinkIcon } from '../../../utils/icons/GeoLinkIcon';

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
    const dispatch = useDispatch();

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
                    onClick={() => dispatch(mapActions.setPointToCenter(gapBefore))}
                >
                    <span className={'mx-1'}>
                        <WarningIcon />
                        <GeoLinkIcon />
                        <img src={arrowUp} alt={'look up'} />
                    </span>
                </span>
            )}
            {gapAfter && (
                <span
                    title={getTitle(gapAfter)}
                    style={{ backgroundColor: 'orange', padding: '5px' }}
                    className={'rounded-2'}
                    onClick={() => dispatch(mapActions.setPointToCenter(gapAfter))}
                >
                    <span className={'mx-1'}>
                        <WarningIcon /> <GeoLinkIcon />
                        <img src={arrowDown} alt={'look down'} />
                    </span>
                </span>
            )}
        </>
    );
}
