import { TrackComposition } from '../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import Select, { SingleValue } from 'react-select';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';

import { BREAK_IDENTIFIER } from '../logic/merge/types.ts';
import { ReactSortable } from 'react-sortablejs';
import { Accordion } from 'react-bootstrap';
import { TrackSelectionOption } from './TrackSelectionOption.tsx';
import { GpxSegment } from '../../common/types.ts';
import { useIntl } from 'react-intl';

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
    { value: `01${BREAK_IDENTIFIER}1`, label: '+ 01 min' },
    { value: `01${BREAK_IDENTIFIER}2`, label: '+ 01 min' },
    { value: `01${BREAK_IDENTIFIER}3`, label: '+ 01 min' },
    { value: `01${BREAK_IDENTIFIER}4`, label: '+ 01 min' },
    { value: `02${BREAK_IDENTIFIER}1`, label: '+ 02 min' },
    { value: `02${BREAK_IDENTIFIER}2`, label: '+ 02 min' },
    { value: `02${BREAK_IDENTIFIER}3`, label: '+ 02 min' },
    { value: `02${BREAK_IDENTIFIER}4`, label: '+ 02 min' },
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
    { value: `-01${BREAK_IDENTIFIER}1`, label: '- 01 min' },
    { value: `-01${BREAK_IDENTIFIER}2`, label: '- 01 min' },
    { value: `-01${BREAK_IDENTIFIER}3`, label: '- 01 min' },
    { value: `-01${BREAK_IDENTIFIER}4`, label: '- 01 min' },
    { value: `-02${BREAK_IDENTIFIER}1`, label: '- 02 min' },
    { value: `-02${BREAK_IDENTIFIER}2`, label: '- 02 min' },
    { value: `-02${BREAK_IDENTIFIER}3`, label: '- 02 min' },
    { value: `-02${BREAK_IDENTIFIER}4`, label: '- 02 min' },
    { value: `-03${BREAK_IDENTIFIER}1`, label: '- 03 min' },
    { value: `-03${BREAK_IDENTIFIER}2`, label: '- 03 min' },
    { value: `-03${BREAK_IDENTIFIER}3`, label: '- 03 min' },
    { value: `-03${BREAK_IDENTIFIER}4`, label: '- 03 min' },
    { value: `-04${BREAK_IDENTIFIER}1`, label: '- 04 min' },
    { value: `-04${BREAK_IDENTIFIER}2`, label: '- 04 min' },
    { value: `-04${BREAK_IDENTIFIER}3`, label: '- 04 min' },
    { value: `-04${BREAK_IDENTIFIER}4`, label: '- 04 min' },
    { value: `-05${BREAK_IDENTIFIER}1`, label: '- 05 min' },
    { value: `-05${BREAK_IDENTIFIER}2`, label: '- 05 min' },
    { value: `-05${BREAK_IDENTIFIER}3`, label: '- 05 min' },
    { value: `-05${BREAK_IDENTIFIER}4`, label: '- 05 min' },
    { value: `-10${BREAK_IDENTIFIER}1`, label: '- 10 min' },
    { value: `-10${BREAK_IDENTIFIER}2`, label: '- 10 min' },
    { value: `-10${BREAK_IDENTIFIER}3`, label: '- 10 min' },
    { value: `-10${BREAK_IDENTIFIER}4`, label: '- 10 min' },
];

export function TrackSelectionCell({ track }: Props) {
    const intl = useIntl();
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
            <Accordion className={'mt-0'}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header className={'m-0'}>
                        <span style={segmentIds.length === 0 ? { color: 'red' } : undefined}>{`${
                            segmentIds.length
                        } ${intl.formatMessage({ id: 'msg.segments' })}`}</span>
                    </Accordion.Header>
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
                            name="segmentSelect"
                            value={null}
                            menuPlacement={'top'}
                            placeholder={intl.formatMessage({ id: 'msg.selectTrackSegment' })}
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
