import { FileDragAndDrop } from './FileDragAndDrop.tsx';

export function FileUploadSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Input of Files</h4>
            <FileDragAndDrop />
        </div>
    );
}
