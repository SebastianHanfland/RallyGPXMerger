import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { FileDownloader } from './FileDownloader.tsx';
import GpxParser from 'gpxparser';

const fileTypes = ['JPG', 'PNG', 'GIF', 'GPX'];

function FileDisplay(props: { file: File }) {
    const [fileContent, setFileContent] = useState<string>(null);
    const [showContent, setShowContent] = useState(false);
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

    return (
        <div>
            <div>{props.file.name}</div>
            {fileContent && <FileDownloader content={fileContent} name={'newGpx'} />}
            <button onClick={() => setShowContent(!showContent)}>
                {showContent ? 'Hide content' : 'Show content'}
            </button>
            {showContent && fileContent && <div>{fileContent}</div>}
        </div>
    );
}

export function FileDragAndDrop() {
    const [files, setFiles] = useState<File[]>([]);
    const handleChange = (newFiles: File[]) => {
        setFiles([...files, ...newFiles]);
    };
    return (
        <div>
            <FileUploader handleChange={handleChange} name="file" types={fileTypes} multiple={true} />
            {files.length > 0 ? files.map((file) => <FileDisplay file={file} />) : <div>No file selected</div>}
        </div>
    );
}
