import { GpxSegment, TrackComposition } from '../../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import Select from 'react-select';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';

import { BREAK_IDENTIFIER } from '../../logic/types.ts';
import { ReactSortable } from 'react-sortablejs';
import { Button } from 'react-bootstrap';

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

    return (
        <td>
            <ReactSortable
                delayOnTouchOnly={true}
                list={segmentIds.map((segmentId) => ({ id: segmentId }))}
                setList={(items) =>
                    dispatch(
                        trackMergeActions.setSegments({ id, segments: items.map((segmentOption) => segmentOption.id) })
                    )
                }
            >
                {segmentIds.map((segmentId) => {
                    const segmentName = options.find((option) => option.value === segmentId);
                    if (!segmentName) {
                        return null;
                    }
                    return (
                        <div
                            className={'d-flex justify-content-between'}
                            style={{
                                border: '1px solid transparent',
                                borderColor: 'black',
                                cursor: 'pointer',
                                margin: '1px',
                            }}
                            key={segmentId}
                        >
                            <div className={'m-1'}>{segmentName?.label}</div>
                            <Button
                                variant="danger"
                                size={'sm'}
                                onClick={() =>
                                    dispatch(
                                        trackMergeActions.setSegments({
                                            id,
                                            segments: segmentIds.filter((sId) => sId !== segmentId),
                                        })
                                    )
                                }
                            >
                                X
                            </Button>
                        </div>
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
                onChange={(newValue) => {
                    if (newValue) {
                        const segments = [...segmentIds, newValue.value];
                        dispatch(trackMergeActions.setSegments({ id, segments: segments }));
                    }
                }}
            />
        </td>
    );
}
