import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { getFixedSegmentSpeeds, getSegmentSpeeds, segmentDataActions } from '../store/segmentData.redux.ts';
import { getAverageSpeedInKmH } from '../store/settings.reducer.ts';
import { formatNumber } from '../../utils/numberUtil.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfSpeed(
    dispatch: AppDispatch,
    speed: number | undefined,
    fixedVelocity: boolean,
    id: string,
    averageSpeed: number
) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(segmentDataActions.setSegmentSpeeds({ id, speed, averageSpeed, fixedVelocity }));
    }, 500);
}

export function SegmentSpeedCells({ id, calculatedSpeed }: { id: string; calculatedSpeed: number | undefined }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const segmentSpeeds = useSelector(getSegmentSpeeds);
    const fixedSegmentSpeeds = useSelector(getFixedSegmentSpeeds);

    const segmentSpeed = segmentSpeeds[id];
    const fixedVelocity = fixedSegmentSpeeds[id] ?? false;
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
                    defaultValue={segmentSpeed === undefined ? '' : `${segmentSpeed}${fixedVelocity ? '!' : ''}`}
                    onChange={(value) => {
                        const input = value.target.value.trim();
                        const isFixed = input.endsWith('!');
                        const numericInput = isFixed ? input.slice(0, -1) : input;
                        const parsedSpeed = numericInput ? Number(numericInput) : undefined;
                        if (numericInput && (parsedSpeed === undefined || !Number.isFinite(parsedSpeed))) {
                            return;
                        }
                        debounceSettingOfSpeed(
                            dispatch,
                            parsedSpeed === undefined ? undefined : Math.max(0, parsedSpeed),
                            isFixed,
                            id,
                            averageSpeed
                        );
                    }}
                />
            </td>
            <td>{calculatedSpeed !== undefined ? formatNumber(calculatedSpeed) : null}</td>
        </>
    );
}
