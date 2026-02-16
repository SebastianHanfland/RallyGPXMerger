import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { DraggableIcon } from './DraggableIcon.tsx';
import { TrackBreak } from '../store/types.ts';

interface Props {
    trackId: string;
    trackElement: TrackBreak;
    segmentName: string;
}

function getPauseLabel(trackBreak: TrackBreak) {
    const minutesBreak = trackBreak.minutes;
    return `${minutesBreak > 0 ? '+' : '-'} ${minutesBreak > 0 ? minutesBreak : -1 * minutesBreak} min`;
}

export function TrackSelectionBreakOption({ trackElement, segmentName, trackId }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    return (
        <div
            className={' rounded-2 d-flex justify-content-between'}
            style={{
                border: '1px solid transparent',
                borderColor: 'black',
                cursor: 'pointer',
                margin: '1px',
                backgroundColor: 'white',
            }}
            key={trackElement.id}
        >
            <DraggableIcon />
            <div className={'m-2'} title={segmentName}>
                {getPauseLabel(trackElement)}
            </div>
            <div>
                <Button
                    variant="danger"
                    size={'sm'}
                    className={'m-1'}
                    onClick={() => {
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId: trackElement.id }));
                    }}
                    title={intl.formatMessage({ id: 'msg.removeTrackSegment' }, { segmentName })}
                >
                    X
                </Button>
            </div>
        </div>
    );
}
