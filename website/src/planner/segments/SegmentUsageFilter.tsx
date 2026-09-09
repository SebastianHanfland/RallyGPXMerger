import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { getShowUnusedSegments, getShowUsedSegments, segmentDataActions } from '../store/segmentData.redux.ts';

export function SegmentUsageFilter() {
    const dispatch = useDispatch();
    const intl = useIntl();
    const showUsedSegments = useSelector(getShowUsedSegments);
    const showUnusedSegments = useSelector(getShowUnusedSegments);

    return (
        <div className="d-flex gap-2 me-2" aria-label={intl.formatMessage({ id: 'msg.segmentUsageFilter' })}>
            <button
                type="button"
                className={`btn rounded-pill`}
                style={{ backgroundColor: showUsedSegments ? '#52b152' : 'white', border: '1px solid #ccc' }}
                aria-pressed={showUsedSegments}
                onClick={() => dispatch(segmentDataActions.toggleShowUsedSegments())}
            >
                <FormattedMessage id="msg.segmentUsage.used" />
            </button>
            <button
                type="button"
                className={`btn rounded-pill`}
                style={{ backgroundColor: showUnusedSegments ? '#f37b7b' : 'white', border: '1px solid #ccc' }}
                aria-pressed={showUnusedSegments}
                onClick={() => dispatch(segmentDataActions.toggleShowUnusedSegments())}
            >
                <FormattedMessage id="msg.segmentUsage.unused" />
            </button>
        </div>
    );
}
