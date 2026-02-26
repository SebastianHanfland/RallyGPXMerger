import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../../store/planningStore.ts';
import { TrackEntry } from '../../store/types.ts';
import { DraggableIcon } from '../../../utils/icons/DraggableIcon.tsx';
import { ArrowRightIcon } from '../../../utils/icons/ArrowRightIcon.tsx';
import { EditIcon } from '../../../utils/icons/EditIcon.tsx';

interface Props {
    trackId: string;
    trackElement: TrackEntry;
}

function getEntryPointLabel(trackEntry: TrackEntry) {
    return trackEntry.streetName;
}

export function TrackSelectionEntryPointOption({ trackElement, trackId }: Props) {
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
            title={trackElement.extraInfo}
            key={trackElement.id}
        >
            <DraggableIcon />
            <div className={'m-2'}>
                <ArrowRightIcon />
                {getEntryPointLabel(trackElement)}
            </div>
            <div>
                <Button
                    variant="danger"
                    size={'sm'}
                    className={'mx-2 my-1'}
                    onClick={() => {
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId: trackElement.id }));
                    }}
                    title={intl.formatMessage(
                        { id: 'msg.removeBreakSegment' },
                        { breakName: getEntryPointLabel(trackElement) }
                    )}
                >
                    X
                </Button>
                <span
                    className={'m-1'}
                    onClick={() =>
                        dispatch(trackMergeActions.setEntryPointEditInfo({ entryPointId: trackElement.id, trackId }))
                    }
                >
                    <EditIcon />
                </span>
            </div>
        </div>
    );
}
