import { FileUploader } from 'react-drag-drop-files';
import { Form, Table } from 'react-bootstrap';
import { FileDisplay } from './FileDisplay.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getGpxSegments, gpxSegmentsActions } from '../../store/gpxSegments.reducer.ts';
import { GpxSegment } from '../../store/types.ts';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';

const fileTypes = ['GPX'];

async function toGpxSegment(file: File): Promise<GpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name,
        content: new TextDecoder().decode(buffer),
    }));
}

export const ALLOWS_TO_ENTER_PEOPLE_AT_START: boolean = false;

export function GpxSegments() {
    const dispatch = useDispatch();
    const gpxSegments = useSelector(getGpxSegments);

    // TODO: This code also exists in TrackCompositionSection.tsx, consolidate
    const [filterTerm, setFilterTerm] = useState('');
    const [filteredTracks, setFilteredTracks] = useState<GpxSegment[]>([]);

    useEffect(() => {
        const allFilterTerms = filterTerm.split(',');
        if (filterTerm === '') {
            setFilteredTracks(gpxSegments);
        } else {
            setFilteredTracks(
                gpxSegments.filter((track) => {
                    let match = false;
                    allFilterTerms.forEach((term) => {
                        if (term === '') {
                            return;
                        }
                        const matches = track.filename?.replace(/\s/g, '').includes(term.replace(/\s/g, ''));
                        if (matches) {
                            match = true;
                        }
                    });
                    return match;
                })
            );
        }
    }, [filterTerm, gpxSegments]);

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toGpxSegment)).then((newGpxSegments) =>
            dispatch(gpxSegmentsActions.addGpxSegments(newGpxSegments))
        );
    };
    return (
        <div>
            <div className={'my-2'}>
                <Form.Control
                    type="text"
                    placeholder="Filter tracks, separate term by ','"
                    value={filterTerm}
                    onChange={(value) => setFilterTerm(value.target.value)}
                />
            </div>
            {filteredTracks.length > 0 ? (
                <Table striped bordered hover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>File</th>
                            <th style={{ width: '10%', minWidth: '150px' }}>Actions</th>
                            {ALLOWS_TO_ENTER_PEOPLE_AT_START && <th style={{ width: '30%' }}>People at Start</th>}
                            <th style={{ width: '30%' }}>People at End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTracks.map((gpxSegment) => (
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
