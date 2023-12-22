import { GpxSegment, TrackComposition } from '../../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import Select, { SingleValue } from 'react-select';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';

import { BREAK_IDENTIFIER } from '../../logic/types.ts';
import { ReactSortable } from 'react-sortablejs';
import { Accordion } from 'react-bootstrap';
import { TrackSelectionOption } from './TrackSelectionOption.tsx';

interface Props {
    track: TrackComposition;
}

function toOption(gpxSegment: GpxSegment): { value: string; label: string } {
    return {
        value: gpxSegment.id,
        label: gpxSegment.filename.replace('.gpx', ''),
    };
}

const breaks = [
    { value: `05${BREAK_IDENTIFIER}1`, label: '+ 05 min' },
    { value: `05${BREAK_IDENTIFIER}2`, label: '+ 05 min' },
    { value: `05${BREAK_IDENTIFIER}3`, label: '+ 05 min' },
    { value: `05${BREAK_IDENTIFIER}4`, label: '+ 05 min' },
    { value: `10${BREAK_IDENTIFIER}1`, label: '+ 10 min' },
    { value: `10${BREAK_IDENTIFIER}2`, label: '+ 10 min' },
    { value: `10${BREAK_IDENTIFIER}3`, label: '+ 10 min' },
    { value: `10${BREAK_IDENTIFIER}4`, label: '+ 10 min' },
    { value: `15${BREAK_IDENTIFIER}1`, label: '+ 15 min' },
    { value: `15${BREAK_IDENTIFIER}2`, label: '+ 15 min' },
    { value: `15${BREAK_IDENTIFIER}3`, label: '+ 15 min' },
    { value: `15${BREAK_IDENTIFIER}4`, label: '+ 15 min' },
    { value: `20${BREAK_IDENTIFIER}1`, label: '+ 20 min' },
    { value: `20${BREAK_IDENTIFIER}2`, label: '+ 20 min' },
    { value: `20${BREAK_IDENTIFIER}3`, label: '+ 20 min' },
    { value: `20${BREAK_IDENTIFIER}4`, label: '+ 20 min' },
    { value: `25${BREAK_IDENTIFIER}1`, label: '+ 25 min' },
    { value: `25${BREAK_IDENTIFIER}2`, label: '+ 25 min' },
    { value: `25${BREAK_IDENTIFIER}3`, label: '+ 25 min' },
    { value: `25${BREAK_IDENTIFIER}4`, label: '+ 25 min' },
    { value: `30${BREAK_IDENTIFIER}1`, label: '+ 30 min' },
    { value: `30${BREAK_IDENTIFIER}2`, label: '+ 30 min' },
    { value: `30${BREAK_IDENTIFIER}3`, label: '+ 30 min' },
    { value: `30${BREAK_IDENTIFIER}4`, label: '+ 30 min' },
];

export function TrackSelectionCell({ track }: Props) {
    const { id, segmentIds } = track;
    const dispatch = useDispatch();
    const gpxSegments = useSelector(getGpxSegments);
    const options = [...gpxSegments.map(toOption), ...breaks];

    const setSegmentIds = (items: { id: string }[]) => {
        const newSegments = items.map((segmentOption) => segmentOption.id);
        return dispatch(trackMergeActions.setSegments({ id, segments: newSegments }));
    };

    const addSegmentToTrack = (newValue: SingleValue<{ value: string }>) => {
        if (newValue) {
            const segments = [...segmentIds, newValue.value];
            dispatch(trackMergeActions.setSegments({ id, segments: segments }));
        }
    };

    return (
        <td>
            <Accordion className={'mt'}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>{`${segmentIds.length} segments`}</Accordion.Header>
                    <Accordion.Body>
                        <ReactSortable
                            delayOnTouchOnly={true}
                            list={segmentIds.map((segmentId) => ({ id: segmentId }))}
                            setList={setSegmentIds}
                        >
                            {segmentIds.map((segmentId) => {
                                const segmentName = options.find((option) => option.value === segmentId)?.label;
                                return (
                                    <TrackSelectionOption
                                        key={segmentId}
                                        segmentId={segmentId}
                                        trackId={id}
                                        segmentName={segmentName ?? 'Currently blank'}
                                    />
                                );
                            })}
                        </ReactSortable>
                        <Select
                            name="colors"
                            value={null}
                            placeholder={'Select next segment to add'}
                            options={options.filter((option) => !segmentIds.includes(option.value))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={addSegmentToTrack}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </td>
    );
}
