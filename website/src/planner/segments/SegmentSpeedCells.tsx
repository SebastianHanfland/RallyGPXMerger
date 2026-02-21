import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { getSegmentSpeeds, segmentDataActions } from '../store/segmentData.redux.ts';
import { ParsedGpxSegment } from '../store/types.ts';
import { getAverageSpeedInKmH } from '../store/settings.reducer.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfSpeed(
    dispatch: AppDispatch,
    speed: number | undefined,
    id: string,
    averageSpeed: number
) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(segmentDataActions.setSegmentSpeeds({ id, speed: speed, averageSpeed }));
    }, 500);
}

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
                    defaultValue={segmentSpeed?.toString() ?? ''}
                    onChange={(value) => {
                        debounceSettingOfSpeed(dispatch, getCount(value), id, averageSpeed);
                    }}
                />
            </td>
        </>
    );
}
