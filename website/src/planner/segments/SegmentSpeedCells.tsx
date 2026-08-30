import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { getForcedSegmentSpeeds, getSegmentSpeeds, segmentDataActions } from '../store/segmentData.redux.ts';
import { ParsedGpxSegment } from '../store/types.ts';
import { getAverageSpeedInKmH, getForcedAverageSpeed } from '../store/settings.reducer.ts';
import {
    formatSegmentSpeedInput,
    isForcedSegmentSpeed,
    parseSegmentSpeedInput,
    ParsedSegmentSpeedInput,
} from './segmentSpeedUtil.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfSpeed(
    dispatch: AppDispatch,
    parsedSpeed: ParsedSegmentSpeedInput,
    id: string,
    averageSpeed: number,
    forcedAverageSpeed: boolean
) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(
            segmentDataActions.setSegmentSpeeds({
                id,
                speed: parsedSpeed.speed,
                averageSpeed,
                forced: parsedSpeed.forced,
                forcedAverageSpeed,
            })
        );
    }, 500);
}

export function SegmentSpeedCells({ gpxSegment }: { gpxSegment: ParsedGpxSegment }) {
    const intl = useIntl();
    const { id } = gpxSegment;
    const dispatch: AppDispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const forcedAverageSpeed = useSelector(getForcedAverageSpeed);
    const segmentSpeeds = useSelector(getSegmentSpeeds);
    const forcedSegmentSpeeds = useSelector(getForcedSegmentSpeeds);

    const segmentSpeed = segmentSpeeds[id];
    const forced = isForcedSegmentSpeed(forcedSegmentSpeeds, segmentSpeeds, id);
    const hasCustomSpeed = (segmentSpeed ?? 0) > 0;
    const displayedAverageSpeed = `${averageSpeed.toFixed(1)}${forcedAverageSpeed ? '!' : ''}`;
    return (
        <>
            {hasCustomSpeed ? (
                <td style={{ backgroundColor: 'grey' }}>
                    <s>{displayedAverageSpeed}</s>
                </td>
            ) : (
                <td>{displayedAverageSpeed}</td>
            )}
            <td>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.customSpeed.placeholder' })}
                    title={intl.formatMessage({ id: 'msg.customSpeed.hint' })}
                    defaultValue={formatSegmentSpeedInput(segmentSpeed, forced)}
                    onChange={(event) => {
                        debounceSettingOfSpeed(
                            dispatch,
                            parseSegmentSpeedInput(event.target.value),
                            id,
                            averageSpeed,
                            forcedAverageSpeed
                        );
                    }}
                />
            </td>
        </>
    );
}
