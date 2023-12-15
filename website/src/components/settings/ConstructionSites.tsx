import { FileUploader } from 'react-drag-drop-files';
import { Table } from 'react-bootstrap';
import { FileDisplay } from '../segments/FileDisplay.tsx';
import { GpxSegment } from '../../store/types.ts';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

const fileTypes = ['GPX'];

async function toGpxSegment(file: File): Promise<GpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name,
        content: new TextDecoder().decode(buffer),
    }));
}

export const ALLOWS_TO_ENTER_PEOPLE_AT_START: boolean = false;

export function ConstructionSites() {
    const [constructionSites, setConstructionSites] = useState<GpxSegment[]>([]);

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toGpxSegment)).then((newGpxSegments) => setConstructionSites(newGpxSegments));
    };
    return (
        <div>
            <h3>Construction sites to display</h3>
            {constructionSites.length > 0 ? (
                <Table striped bordered hover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>File</th>
                            <th style={{ width: '10%', minWidth: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {constructionSites.map((gpxSegment) => (
                            <FileDisplay key={gpxSegment.id} gpxSegment={gpxSegment} />
                        ))}
                        <tr>
                            <td colSpan={3}>
                                <FileUploader
                                    handleChange={handleChange}
                                    name="file"
                                    types={fileTypes}
                                    multiple={true}
                                    label={'Please upload the GPX segments here'}
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <div>
                    <div>No file selected</div>
                    <div style={{ height: '70px' }}>
                        <FileUploader
                            handleChange={handleChange}
                            name="file"
                            types={fileTypes}
                            multiple={true}
                            label={'Please upload the GPX segments here'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
