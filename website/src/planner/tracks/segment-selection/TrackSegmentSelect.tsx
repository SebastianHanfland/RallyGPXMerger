import { ParsedGpxSegment, SEGMENT, TrackComposition } from '../../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import Select, { SingleValue } from 'react-select';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../../store/planningStore.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';

interface Props {
    track: TrackComposition;
}

function toOption(gpxSegment: ParsedGpxSegment): { value: string; label: string } {
    return {
        value: gpxSegment.id,
        label: gpxSegment.filename.replace('.gpx', ''),
    };
}

export function TrackSegmentSelect({ track }: Props) {
    const intl = useIntl();
    const { id, segments } = track;
    const dispatch: AppDispatch = useDispatch();
    const gpxSegments = useSelector(getParsedGpxSegments);
    const options = [...gpxSegments.map(toOption)];

    const addSegmentToTrack = (newValue: SingleValue<{ value: string }>) => {
        if (newValue) {
            const trackElements = [...segments, { id: newValue.value, segmentId: newValue.value, type: SEGMENT }];
            dispatch(trackMergeActions.setSegments({ id, segments: trackElements }));
        }
    };

    return (
        <Select
            name="segmentSelect"
            value={null}
            menuPlacement={'top'}
            placeholder={intl.formatMessage({ id: 'msg.selectTrackSegment' })}
            options={options.filter((option) => !segments.map((segment) => segment.id).includes(option.value))}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={addSegmentToTrack}
        />
    );
}
