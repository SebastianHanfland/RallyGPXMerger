import { getAverageSpeedInKmH } from '../store/trackMerge.reducer.ts';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getSegmentSpeeds, segmentDataActions } from '../store/segmentData.redux.ts';
import { ParsedGpxSegment } from '../store/types.ts';

export function SegmentSpeedCells({ gpxSegment }: { gpxSegment: ParsedGpxSegment }) {
    const intl = useIntl();
    const { id } = gpxSegment;
    const dispatch: AppDispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const segmentSpeeds = useSelector(getSegmentSpeeds);

    const segmentSpeed = segmentSpeeds[id];
    const hasCustomSpeed = (segmentSpeed ?? 0) > 0;
    return (
        <>
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
                    onChange={(value) => {
                        dispatch(segmentDataActions.setSegmentSpeeds({ id, speed: getCount(value), averageSpeed }));
                        dispatch(triggerAutomaticCalculation);
                    }}
                />
            </td>
        </>
    );
}
