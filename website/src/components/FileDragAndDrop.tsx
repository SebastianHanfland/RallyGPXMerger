import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ['JPG', 'PNG', 'GIF', 'GPX'];

export function FileDragAndDrop() {
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        setFile(file);
    };
    return <FileUploader handleChange={handleChange} name="file" types={fileTypes} />;
}
