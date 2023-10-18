import { useEffect, useState } from 'react';
import GpxParser from 'gpxparser';
import { Form } from 'react-bootstrap';
import { GpxSegment } from '../store/types.ts';

export function FileDisplay(props: { gpxSegment: GpxSegment }) {
    const [fileContent, setFileContent] = useState<string | null>(null);
    useEffect(() => {
        const textContent = props.gpxSegment.content;
        setFileContent(textContent);
        const gpx = new GpxParser();
        gpx.parse(textContent);
        console.log('Tracks', gpx.tracks);
        console.log('All', gpx);
    }, [props.gpxSegment]);

    console.log(fileContent);

    return (
        <tr>
            <td>
                <div>{props.gpxSegment.filename}</div>
            </td>
            <td>
                <Form.Control type="text" placeholder="Track name" value={500} />
            </td>
            <td>
                <Form.Control type="text" placeholder="Track name" value={700} />
            </td>
        </tr>
    );
}
