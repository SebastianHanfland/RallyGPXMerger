import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ['JPG', 'PNG', 'GIF', 'GPX'];

function FileDisplay(props: { file: File }) {
    return <div>{props.file.name}</div>;
}

export function FileDragAndDrop() {
    const [files, setFiles] = useState<File[]>([]);
    const handleChange = (newFiles) => {
        setFiles([...files, ...newFiles]);
    };
    console.log(files);
    return (
        <div>
            <FileUploader handleChange={handleChange} name="file" types={fileTypes} multiple={true} />
            {files.length > 0 ? files.map((file) => <FileDisplay file={file} />) : <div>No file selected</div>}
        </div>
    );
}
