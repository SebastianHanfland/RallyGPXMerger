import React, { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ['JPG', 'PNG', 'GIF', 'GPX'];

function FileDisplay(props: { file: File }) {
    const [fileContent, setFileContent] = useState<string>(null);
    useEffect(() => {
        props.file.arrayBuffer().then((content) => {
            const textContent = new TextDecoder().decode(content);
            setFileContent(textContent);
        });
    }, [props.file]);
    return (
        <div>
            <div>{props.file.name}</div>
            {fileContent && <div>{fileContent}</div>}
        </div>
    );
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
