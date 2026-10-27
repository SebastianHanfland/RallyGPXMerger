import { FormattedMessage } from 'react-intl';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { DescriptionInfoButton } from '../../ui/sidebar/DescriptionInfoButton';
import { getTrackCompositions } from '../../store/trackMerge.reducer';
import { MemoizedGpxSegmentRow } from './GpxSegmentRow';
import { SegmentSortButton } from './SegmentSortButton';
import { getSegmentTableRows } from './segmentTableData';
import { getSegmentUsages } from './segmentUsageCounter';
import { GpxSegmentsUploadAndParse } from '../GpxSegmentsUploadAndParse.tsx';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';

export function GpxSegmentsTable() {
    const rows = useSelector(getSegmentTableRows);
    const segmentUsages = useSelector(getSegmentUsages);
    const planningHasTracks = useSelector(getTrackCompositions).length > 0;
    const parsedGpxSegments = useSelector(getParsedGpxSegments);

    if (parsedGpxSegments.length === 0) {
        return (
            <div>
                <div>
                    <FormattedMessage id="msg.noFile" />
                </div>
                <div style={{ height: '70px', width: '200px' }}>
                    <GpxSegmentsUploadAndParse />
                </div>
            </div>
        );
    }

    if (rows.length === 0) {
        return null;
    }
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
                        <td colSpan={6}>
                            <GpxSegmentsUploadAndParse />
                        </td>
                    </tr>
                )}
                {rows.map(({ id, filename, flipped, color, distance, speed, info }) => (
                    <MemoizedGpxSegmentRow
                        key={id}
                        id={id}
                        filename={filename}
                        flipped={flipped}
                        color={color}
                        distance={distance}
                        calculatedSpeed={speed}
                        info={info}
                        segmentUsages={segmentUsages}
                        planningHasTracks={planningHasTracks}
                    />
                ))}
                <tr>
                    <td colSpan={6}>
                        <GpxSegmentsUploadAndParse />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}
