import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getSegmentUsageFilter, segmentDataActions } from '../store/segmentData.redux.ts';

export function SegmentUsageFilter() {
    const dispatch = useDispatch();
    const intl = useIntl();
    const usageFilter = useSelector(getSegmentUsageFilter);
    const label = intl.formatMessage({ id: `msg.segmentUsageFilter.${usageFilter}` });

    return (
        <div className="form-check me-2">
            <input
                id="segment-usage-filter"
                className="form-check-input"
                type="checkbox"
                checked={usageFilter === 'used'}
                ref={(element) => {
                    if (element) element.indeterminate = usageFilter === 'unused';
                }}
                onChange={() => dispatch(segmentDataActions.cycleSegmentUsageFilter())}
                aria-label={label}
            />
            <label className="form-check-label" htmlFor="segment-usage-filter">
                {label}
            </label>
        </div>
    );
}
