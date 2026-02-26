import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../../store/planningStore.ts';
import { TrackBreak } from '../../store/types.ts';
import { DraggableIcon } from '../../../utils/icons/DraggableIcon.tsx';
import { BreakIcon } from '../../../utils/icons/BreakIcon.tsx';
import { WcIcon } from '../../../utils/icons/WcIcon.tsx';
import { EditIcon } from '../../../utils/icons/EditIcon.tsx';
import { BreakPosition, getBreakPositions } from '../../logic/resolving/selectors/getBreakPositions.ts';
import { mapActions } from '../../store/map.reducer.ts';
import { GeoLinkIcon } from '../../../utils/icons/GeoLinkIcon.tsx';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';

interface Props {
    trackId: string;
    trackElement: TrackBreak;
}

function getBreakLabel(trackBreak: TrackBreak, foundBreak: BreakPosition | undefined) {
    const minutesBreak = trackBreak.minutes;
    const breakText = `${minutesBreak > 0 ? '+' : '-'} ${minutesBreak > 0 ? minutesBreak : -1 * minutesBreak} min`;
    if (!foundBreak) {
        return breakText;
    }
    return `${breakText} at ${formatTimeOnly(foundBreak.at, true)}`;
}

export function TrackSelectionBreakOption({ trackElement, trackId }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const breakPositions = useSelector(getBreakPositions);
    const foundBreak = breakPositions.find((breakPosition) => breakPosition.breakId === trackElement.id);

    return (
        <div
            className={'rounded-2 d-flex justify-content-between'}
            style={{
                border: '1px solid transparent',
                borderColor: 'black',
                cursor: 'pointer',
                margin: '1px',
                backgroundColor: 'white',
            }}
            title={trackElement.description}
            key={trackElement.id}
        >
            <DraggableIcon />
            <div className={'m-2'}>
                {trackElement.hasToilet ? <WcIcon /> : <BreakIcon />}
                {getBreakLabel(trackElement, foundBreak)}
            </div>
            <div>
                {foundBreak && (
                    <span
                        title={intl.formatMessage({ id: 'msg.jumpToBreak' })}
                        style={{ padding: '5px' }}
                        className={'rounded-2'}
                        onClick={() => {
                            dispatch(mapActions.setPointToCenter(toLatLng(foundBreak?.point)));
                            dispatch(mapActions.setShowBreakMarker(true));
                        }}
                    >
                        <GeoLinkIcon />
                    </span>
                )}
                <Button
                    variant="danger"
                    size={'sm'}
                    className={'mx-2 my-1'}
                    onClick={() => {
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId: trackElement.id }));
                    }}
                    title={intl.formatMessage(
                        { id: 'msg.removeBreakSegment' },
                        { breakName: getBreakLabel(trackElement, foundBreak) }
                    )}
                >
                    X
                </Button>
                <span
                    className={'m-1'}
                    onClick={() =>
                        dispatch(trackMergeActions.setBreakEditInfo({ breakId: trackElement.id, trackId: trackId }))
                    }
                >
                    <EditIcon />
                </span>
            </div>
        </div>
    );
}
