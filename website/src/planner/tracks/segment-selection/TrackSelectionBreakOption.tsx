import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../../store/planningStore.ts';
import { TrackBreak } from '../../store/types.ts';
import pencil from '../../../assets/pencil.svg';
import { DraggableIcon } from '../../../utils/icons/DraggableIcon.tsx';
import { BreakIcon } from '../../../utils/icons/BreakIcon.tsx';
import { WcIcon } from '../../../utils/icons/WcIcon.tsx';

interface Props {
    trackId: string;
    trackElement: TrackBreak;
}

function getBreakLabel(trackBreak: TrackBreak) {
    const minutesBreak = trackBreak.minutes;
    return `${minutesBreak > 0 ? '+' : '-'} ${minutesBreak > 0 ? minutesBreak : -1 * minutesBreak} min`;
}

export function TrackSelectionBreakOption({ trackElement, trackId }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

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
                {getBreakLabel(trackElement)}
            </div>
            <div>
                <Button
                    variant="danger"
                    size={'sm'}
                    className={'m-1'}
                    onClick={() => {
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId: trackElement.id }));
                    }}
                    title={intl.formatMessage(
                        { id: 'msg.removeBreakSegment' },
                        { breakName: getBreakLabel(trackElement) }
                    )}
                >
                    X
                </Button>
                <span className={'m-1'}>
                    <img
                        src={pencil}
                        className="m-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                            dispatch(trackMergeActions.setBreakEditInfo({ breakId: trackElement.id, trackId: trackId }))
                        }
                        alt="upload file"
                        color={'#ffffff'}
                    />
                </span>
            </div>
        </div>
    );
}
