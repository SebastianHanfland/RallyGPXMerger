import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { BREAK_IDENTIFIER } from '../logic/merge/types.ts';
import { DraggableIcon } from './DraggableIcon.tsx';

interface Props {
    trackId: string;
    segmentId: string;
    segmentName: string;
}

function getPauseLabel(segmentId: string) {
    const minutesBreak = Number(segmentId.split(BREAK_IDENTIFIER)[0]);
    return `${minutesBreak > 0 ? '+' : '-'} ${minutesBreak > 0 ? minutesBreak : -1 * minutesBreak} min`;
}

export function TrackSelectionBreakOption({ segmentId, segmentName, trackId }: Props) {
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
                backgroundColor: getColorFromUuid(segmentId),
            }}
            key={segmentId}
        >
            <DraggableIcon />
            <div className={'m-2'} title={segmentName}>
                {getPauseLabel(segmentId)}
            </div>
            <div>
                <Button
                    variant="danger"
                    size={'sm'}
                    className={'m-1'}
                    onClick={() => {
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId }));
                    }}
                    title={intl.formatMessage({ id: 'msg.removeTrackSegment' }, { segmentName })}
                >
                    X
                </Button>
            </div>
        </div>
    );
}
