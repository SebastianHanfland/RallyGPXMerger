import { Form, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { useEffect, useState } from 'react';
import { filterItems } from '../../utils/filterUtil.ts';
import { SegmentSpeedRow } from './SegmentSpeedRow.tsx';
import { GpxSegment } from '../../common/types.ts';

export function SegmentSpeedSettings() {
    const [filterTerm, setFilterTerm] = useState('');
    const gpxSegments = useSelector(getGpxSegments);
    const [filteredSegments, setFilteredSegments] = useState<GpxSegment[]>([]);
    useEffect(() => {
        setFilteredSegments(filterItems(filterTerm, gpxSegments, (segment) => segment.filename));
    }, [filterTerm]);

    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h3>Construction sites to display</h3>
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
                            <th style={{ width: '40%' }}>Segment</th>
                            <th style={{ width: '30%', minWidth: '150px' }}>Global speed in km/h</th>
                            <th style={{ width: '30%', minWidth: '150px' }}>Custom speed in km/h</th>
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
