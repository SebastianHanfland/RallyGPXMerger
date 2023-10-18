import { useEffect, useState } from 'react';
import GpxParser from 'gpxparser';
import { Form } from 'react-bootstrap';
import { GpxSegment } from '../store/types.ts';
import { useDispatch } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';

function getCount(value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const number = Number(value.target.value);
    return isNaN(number) ? 0 : number;
}

export function FileDisplay({ gpxSegment }: { gpxSegment: GpxSegment }) {
    const { id, filename, content, peopleCountStart, peopleCountEnd } = gpxSegment;
    const [fileContent, setFileContent] = useState<string | null>(null);
    const dispatch = useDispatch();

    // TODO: This is just example code. It should not be in here anymore...
    useEffect(() => {
        const textContent = content;
        setFileContent(textContent);
        const gpx = new GpxParser();
        gpx.parse(textContent);
        console.log('Tracks', gpx.tracks);
        console.log('All', gpx);
    }, [gpxSegment.content]);

    console.log(fileContent);

    return (
        <tr>
            <td>
                <div>{filename}</div>
            </td>
            <td>
                <Form.Control
                    type="text"
                    placeholder="People at start"
                    value={peopleCountStart}
                    onChange={(value) =>
                        dispatch(gpxSegmentsActions.setPeopleCountStart({ id, count: getCount(value) }))
                    }
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    placeholder="People at end"
                    value={peopleCountEnd}
                    onChange={(value) => dispatch(gpxSegmentsActions.setPeopleCountEnd({ id, count: getCount(value) }))}
                />
            </td>
            <td>
                <button onClick={() => dispatch(gpxSegmentsActions.removeGpxSegment(id))}>x</button>
            </td>
        </tr>
    );
}
