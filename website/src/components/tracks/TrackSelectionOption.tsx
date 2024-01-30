import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../../planner/store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { getColorFromUuid } from '../../utils/colorUtil.ts';

interface Props {
    trackId: string;
    segmentId: string;
    segmentName: string;
}

export function TrackSelectionOption({ segmentId, segmentName, trackId }: Props) {
    const dispatch = useDispatch();

    return (
        <div
            className={'d-flex justify-content-between'}
            style={{
                border: '1px solid transparent',
                borderColor: 'black',
                cursor: 'pointer',
                margin: '1px',
                backgroundColor: getColorFromUuid(segmentId),
            }}
            key={segmentId}
            title={segmentName}
        >
            <div className={'m-1'}>{segmentName}</div>
            <Button
                variant="danger"
                size={'sm'}
                onClick={() => dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId }))}
            >
                X
            </Button>
        </div>
    );
}
