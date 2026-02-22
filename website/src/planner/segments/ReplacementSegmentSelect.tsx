import { useDispatch, useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import { useIntl } from 'react-intl';
import { getParsedGpxSegments, getReplaceProcess, segmentDataActions } from '../store/segmentData.redux.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { ParsedGpxSegment } from '../store/types.ts';

function toOption(gpxSegment: ParsedGpxSegment): { value: string; label: string } {
    return {
        value: gpxSegment.id,
        label: gpxSegment.filename.replace('.gpx', ''),
    };
}

export function ReplacementSegmentSelect() {
    const intl = useIntl();
    const replaceProcess = useSelector(getReplaceProcess);
    const dispatch: AppDispatch = useDispatch();
    const gpxSegments = useSelector(getParsedGpxSegments);
    const options = [...gpxSegments.map(toOption)];

    const addSegmentToReplacement = (newValue: SingleValue<{ value: string }>) => {
        if (newValue && replaceProcess) {
            const foundSegment = gpxSegments.find((segment) => segment.id === newValue.value);
            const updatedReplacement = {
                ...replaceProcess,
                replacementSegments: [...replaceProcess.replacementSegments, ...(foundSegment ? [foundSegment] : [])],
            };
            dispatch(segmentDataActions.setReplaceProcess(updatedReplacement));
        }
    };

    return (
        <Select
            name="segmentSelect"
            value={null}
            menuPlacement={'top'}
            placeholder={intl.formatMessage({ id: 'msg.selectTrackSegment' })}
            options={options.filter((option) => {
                if (option.value === replaceProcess?.targetSegment) {
                    return false;
                }
                return !replaceProcess?.replacementSegments.map((segment) => segment.id).includes(option.value);
            })}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={addSegmentToReplacement}
        />
    );
}
