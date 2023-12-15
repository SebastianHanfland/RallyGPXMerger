import { GpxSegment } from '../../store/types.ts';
import { getAverageSpeedInKmH } from '../../store/trackMerge.reducer.ts';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { getSegmentVelocities, gpxSegmentsActions } from '../../store/gpxSegments.reducer.ts';
import { getCount } from '../../utils/inputUtil.ts';

export function SegmentSpeedRow({ gpxSegment }: { gpxSegment: GpxSegment }) {
    const { filename, id } = gpxSegment;
    const dispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const segmentVelocities = useSelector(getSegmentVelocities);

    const segmentVelocity = segmentVelocities[id];
    const hasCustomVelocity = (segmentVelocity ?? 0) > 0;
    return (
        <tr>
            <td>{filename}</td>
            {hasCustomVelocity ? (
                <td style={{ backgroundColor: 'grey' }}>
                    <s>{averageSpeed.toFixed(1)}</s>
                </td>
            ) : (
                <td>{averageSpeed.toFixed(1)}</td>
            )}
            <td>
                <Form.Control
                    type="number"
                    placeholder="Custom velocity"
                    value={segmentVelocity?.toString()}
                    onChange={(value) =>
                        dispatch(gpxSegmentsActions.setSegmentVelocity({ id, velocity: getCount(value) }))
                    }
                />
            </td>
        </tr>
    );
}
