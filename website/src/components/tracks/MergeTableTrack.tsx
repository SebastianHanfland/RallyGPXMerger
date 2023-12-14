import { Form } from 'react-bootstrap';
import { TrackComposition } from '../../store/types.ts';
import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { TrackSelectionCell } from './TrackSelectionCell.tsx';
import { TrackButtonsCell } from './TrackButtonsCell.tsx';
import { ChangeEvent } from 'react';

interface Props {
    track: TrackComposition;
}

function getCount(value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const number = Number(value.target.value);
    return isNaN(number) ? 0 : number;
}

export function MergeTableTrack({ track }: Props) {
    const { name, id, peopleCount } = track;
    const dispatch = useDispatch();

    return (
        <tr>
            <td>
                <Form.Control
                    type="text"
                    placeholder="Track name"
                    value={name}
                    onChange={(value) =>
                        dispatch(trackMergeActions.setTrackName({ id, trackName: value.target.value }))
                    }
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    placeholder="People on track"
                    value={peopleCount}
                    onChange={(value) =>
                        dispatch(trackMergeActions.setTrackPeopleCount({ id, peopleCount: getCount(value) }))
                    }
                />
            </td>
            <TrackSelectionCell track={track} />
            <TrackButtonsCell track={track} />
        </tr>
    );
}
