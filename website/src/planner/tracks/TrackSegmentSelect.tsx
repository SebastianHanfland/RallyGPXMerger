import { TrackComposition } from '../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import Select, { SingleValue } from 'react-select';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { GpxSegment } from '../../common/types.ts';
import { useIntl } from 'react-intl';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/planningStore.ts';

interface Props {
    track: TrackComposition;
}

function toOption(gpxSegment: GpxSegment): { value: string; label: string } {
    return {
        value: gpxSegment.id,
        label: gpxSegment.filename.replace('.gpx', ''),
    };
}

export function TrackSegmentSelect({ track }: Props) {
    const intl = useIntl();
    const { id, segmentIds } = track;
    const dispatch: AppDispatch = useDispatch();
    const gpxSegments = useSelector(getGpxSegments);
    const options = [...gpxSegments.map(toOption)];

    const addSegmentToTrack = (newValue: SingleValue<{ value: string }>) => {
        if (newValue) {
            const segments = [...segmentIds, newValue.value];
            dispatch(trackMergeActions.setSegments({ id, segments: segments }));
            dispatch(triggerAutomaticCalculation);
        }
    };

    return (
        <Select
            name="segmentSelect"
            value={null}
            menuPlacement={'top'}
            placeholder={intl.formatMessage({ id: 'msg.selectTrackSegment' })}
            options={options.filter((option) => !segmentIds.includes(option.value))}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={addSegmentToTrack}
        />
    );
}
