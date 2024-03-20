import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { useIntl } from 'react-intl';
import { mapActions } from '../store/map.reducer.ts';

interface Props {
    trackId: string;
    segmentId: string;
    segmentName: string;
}

export function TrackSelectionOption({ segmentId, segmentName, trackId }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();

    return (
        <div
            onMouseEnter={() => dispatch(mapActions.setHighlightedSegmentId(segmentId))}
            onMouseLeave={() => dispatch(mapActions.setHighlightedSegmentId(undefined))}
            className={'d-flex justify-content-between'}
            style={{
                border: '1px solid transparent',
                borderColor: 'black',
                cursor: 'pointer',
                margin: '1px',
                backgroundColor: getColorFromUuid(segmentId),
            }}
            key={segmentId}
        >
            <div className={'m-1'} title={segmentName}>
                {segmentName}
            </div>
            <Button
                variant="danger"
                size={'sm'}
                onClick={() => dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId }))}
                title={intl.formatMessage({ id: 'msg.removeTrackSegment' }, { segmentName })}
            >
                X
            </Button>
        </div>
    );
}
