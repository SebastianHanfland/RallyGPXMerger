import { getAverageSpeedInKmH } from '../store/trackMerge.reducer.ts';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { getSegmentSpeeds, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { getCount } from '../../utils/inputUtil.ts';
import { GpxSegment } from '../../common/types.ts';
import { useIntl } from 'react-intl';

export function SegmentSpeedRow({ gpxSegment }: { gpxSegment: GpxSegment }) {
    const intl = useIntl();
    const { filename, id } = gpxSegment;
    const dispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const segmentSpeeds = useSelector(getSegmentSpeeds);

    const segmentSpeed = segmentSpeeds[id];
    const hasCustomSpeed = (segmentSpeed ?? 0) > 0;
    return (
        <tr>
            <td>{filename}</td>
            {hasCustomSpeed ? (
                <td style={{ backgroundColor: 'grey' }}>
                    <s>{averageSpeed.toFixed(1)}</s>
                </td>
            ) : (
                <td>{averageSpeed.toFixed(1)}</td>
            )}
            <td>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.customSpeed.placeholder' })}
                    title={intl.formatMessage({ id: 'msg.customSpeed.placeholder' })}
                    value={segmentSpeed?.toString() ?? ''}
                    onChange={(value) => dispatch(gpxSegmentsActions.setSegmentSpeeds({ id, speed: getCount(value) }))}
                />
            </td>
        </tr>
    );
}
