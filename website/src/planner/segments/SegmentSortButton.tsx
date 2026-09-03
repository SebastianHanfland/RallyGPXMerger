import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { segmentDataActions, getSegmentSortDirection, getSegmentSortField } from '../store/segmentData.redux.ts';
import { SegmentSortField } from '../store/types.ts';

export function SegmentSortButton({ field, messageId }: { field: SegmentSortField; messageId: string }) {
    const dispatch = useDispatch();
    const intl = useIntl();
    const activeField = useSelector(getSegmentSortField);
    const direction = useSelector(getSegmentSortDirection);

    return (
        <button
            type="button"
            className="btn btn-link p-0 text-reset text-decoration-none"
            onClick={() => dispatch(segmentDataActions.toggleSegmentSort(field))}
            aria-label={intl.formatMessage({ id: messageId })}
        >
            <FormattedMessage id={messageId} />
            {activeField === field && (direction === 'ascending' ? ' ▲' : ' ▼')}
        </button>
    );
}
