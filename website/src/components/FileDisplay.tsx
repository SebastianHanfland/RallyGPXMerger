import { useEffect, useState } from 'react';
import GpxParser from 'gpxparser';
import { Form } from 'react-bootstrap';

export function FileDisplay(props: { file: File }) {
    const [fileContent, setFileContent] = useState<string | null>(null);
    useEffect(() => {
        props.file.arrayBuffer().then((content) => {
            const textContent = new TextDecoder().decode(content);
            setFileContent(textContent);
            const gpx = new GpxParser();
            gpx.parse(textContent);
            console.log('Tracks', gpx.tracks);
            console.log('All', gpx);
        });
    }, [props.file]);

    console.log(fileContent);

    return (
        <tr>
            <td>
                <div>{props.file.name}</div>
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
