import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { Form, Table } from 'react-bootstrap';
import GpxParser from 'gpxparser';

const fileTypes = ['GPX'];

function FileDisplay(props: { file: File }) {
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

export function FileDragAndDrop() {
    const [files, setFiles] = useState<File[]>([]);
    const handleChange = (newFiles: File[]) => {
        setFiles([...files, ...newFiles]);
    };
    return (
        <div>
            <div style={{ height: '70px' }}>
                <FileUploader
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                    multiple={true}
                    label={'Please upload the GPX segments here'}
                />
            </div>
            {files.length > 0 ? (
                <Table striped bordered hover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '33%' }}>File name</th>
                            <th style={{ width: '33%' }}>People</th>
                            <th style={{ width: '33%' }}>...</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <FileDisplay file={file} />
                        ))}
                    </tbody>
                </Table>
            ) : (
                <div>No file selected</div>
            )}
        </div>
    );
}
