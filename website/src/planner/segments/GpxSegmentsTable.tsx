import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Table } from 'react-bootstrap';
import { DescriptionInfoButton } from '../ui/sidebar/DescriptionInfoButton.tsx';
import { GpxSegmentRow } from './GpxSegmentRow.tsx';
import { SegmentSortButton } from './SegmentSortButton.tsx';
import { SegmentTableRow } from './segmentTableData.ts';

export function GpxSegmentsTable({ rows, upload }: { rows: SegmentTableRow[]; upload: ReactNode }) {
    return (
        <Table striped bordered hover style={{ width: '100%' }} size="sm">
            <thead>
                <tr>
                    <th style={{ width: '100%' }}>
                        <SegmentSortButton field="name" messageId="msg.file" />
                    </th>
                    <th style={{ width: '120px', minWidth: '120px' }}>
                        <SegmentSortButton field="distance" messageId="msg.distanceInKm" />
                    </th>
                    <th style={{ width: '30%', minWidth: '150px' }}>
                        <FormattedMessage id="msg.globalSpeed" />
                    </th>
                    <th style={{ width: '30%', minWidth: '150px' }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <FormattedMessage id="msg.customSpeed" />
                            <DescriptionInfoButton
                                titleMessageId="msg.customSpeed.title"
                                descriptionMessageId="msg.description.customSpeed"
                            />
                        </div>
                    </th>
                    <th style={{ width: '30%', minWidth: '150px' }}>
                        <SegmentSortButton field="speed" messageId="msg.calculatedSpeed" />
                    </th>
                    <th style={{ width: '70px', minWidth: '70px' }}>
                        <FormattedMessage id="msg.actions" />
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows.length > 5 && (
                    <tr>
                        <td colSpan={6}>{upload}</td>
                    </tr>
                )}
                {rows.map(({ segment, distance }) => (
                    <GpxSegmentRow key={segment.id} gpxSegment={segment} distance={distance} />
                ))}
                <tr>
                    <td colSpan={6}>{upload}</td>
                </tr>
            </tbody>
        </Table>
    );
}
