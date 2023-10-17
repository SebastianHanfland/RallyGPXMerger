import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { Table } from 'react-bootstrap';
import { FileDisplay } from './FileDisplay.tsx';

const fileTypes = ['GPX'];

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
