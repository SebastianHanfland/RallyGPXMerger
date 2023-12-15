import { Form, Table } from 'react-bootstrap';
import { FileDisplay } from '../segments/FileDisplay.tsx';
import { useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { GpxSegment } from '../../store/types.ts';
import { useEffect, useState } from 'react';
import { filterItems } from '../../utils/filterUtil.ts';

export function SegmentSpeedSettings() {
    const [filterTerm, setFilterTerm] = useState('');
    const gpxSegments = useSelector(getGpxSegments);
    const [filteredSegments, setFilteredSegments] = useState<GpxSegment[]>([]);
    useEffect(() => {
        setFilteredSegments(filterItems(filterTerm, gpxSegments, (segment) => segment.filename));
    }, [filterTerm]);

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
            {filteredSegments.length > 0 ? (
                <Table striped bordered hover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>File</th>
                            <th style={{ width: '10%', minWidth: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSegments.map((gpxSegment) => (
                            <FileDisplay key={gpxSegment.id} gpxSegment={gpxSegment} />
                        ))}
                    </tbody>
                </Table>
            ) : (
                <div>
                    <div>No file selected</div>
                </div>
            )}
        </div>
    );
}
