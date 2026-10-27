import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getSegmentFilterTerm, segmentDataActions } from '../../store/segmentData.redux';

export function SegmentFilter() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const filterTerm = useSelector(getSegmentFilterTerm);

    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.filterSegments' })}
            value={filterTerm ?? ''}
            onChange={(event) => dispatch(segmentDataActions.setFilterTerm(event.target.value))}
        />
    );
}
