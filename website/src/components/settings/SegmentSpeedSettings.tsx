import { Form, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { GpxSegment } from '../../store/types.ts';
import { useEffect, useState } from 'react';
import { filterItems } from '../../utils/filterUtil.ts';
import { SegmentSpeedRow } from './SegmentSpeedRow.tsx';

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
                            <th style={{ width: '50%' }}>Segment</th>
                            <th style={{ width: '50%', minWidth: '150px' }}>Average velocity in km/h</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSegments.map((gpxSegment) => (
                            <SegmentSpeedRow key={gpxSegment.id} gpxSegment={gpxSegment} />
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
