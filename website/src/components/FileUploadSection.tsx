import { FileDragAndDrop } from './FileDragAndDrop.tsx';

export function FileUploadSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Upload GPX Segments</h4>
            <FileDragAndDrop />
        </div>
    );
}
