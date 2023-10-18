import { FileUploader } from 'react-drag-drop-files';
import { Table } from 'react-bootstrap';
import { FileDisplay } from './FileDisplay.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getGpxSegments, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { GpxSegment } from '../store/types.ts';
import { v4 as uuidv4 } from 'uuid';

const fileTypes = ['GPX'];

async function toGpxSegment(file: File): Promise<GpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name,
        content: new TextDecoder().decode(buffer),
    }));
}

export function FileDragAndDrop() {
    const dispatch = useDispatch();
    const gpxSegments = useSelector(getGpxSegments);
    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toGpxSegment)).then((newGpxSegments) =>
            dispatch(gpxSegmentsActions.addGpxSegments(newGpxSegments))
        );
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
            {gpxSegments.length > 0 ? (
                <Table striped bordered hover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '33%' }}>File name</th>
                            <th style={{ width: '33%' }}>People at Start</th>
                            <th style={{ width: '33%' }}>People at End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gpxSegments.map((gpxSegment) => (
                            <FileDisplay gpxSegment={gpxSegment} />
                        ))}
                    </tbody>
                </Table>
            ) : (
                <div>No file selected</div>
            )}
        </div>
    );
}
