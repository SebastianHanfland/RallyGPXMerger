import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { GpxSegmentsUploadAndParse } from './GpxSegmentsUploadAndParse.tsx';
import {
    getFilteredGpxSegments,
    getSegmentFilterTerm,
    getSegmentSortDirection,
    getSegmentSortField,
    getShowUnusedSegments,
    getShowUsedSegments,
    segmentDataActions,
} from '../store/segmentData.redux.ts';
import { DescriptionInfoButton } from '../ui/sidebar/DescriptionInfoButton.tsx';
import { GpxCreationHint } from './GpxCreationHint.tsx';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getAggregateStreetsInSegments } from '../../common/calculation/aggregated-segments/aggregatePointsSelector.ts';
import { getSegmentTableRows } from './segmentTableData.ts';
import { SegmentUsageFilter } from './SegmentUsageFilter.tsx';
import { GpxSegmentsTable } from './GpxSegmentsTable.tsx';

interface Props {
    noFilter?: boolean;
}

export function GpxSegments({ noFilter }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const filterTerm = useSelector(getSegmentFilterTerm);
    const segments = useSelector(getFilteredGpxSegments);
    const trackCompositions = useSelector(getTrackCompositions);
    const aggregatedSegments = useSelector(getAggregateStreetsInSegments);
    const sortField = useSelector(getSegmentSortField);
    const sortDirection = useSelector(getSegmentSortDirection);
    const showUsedSegments = useSelector(getShowUsedSegments);
    const showUnusedSegments = useSelector(getShowUnusedSegments);
    const rows = getSegmentTableRows(
        segments,
        aggregatedSegments,
        trackCompositions,
        showUsedSegments,
        showUnusedSegments,
        sortField,
        sortDirection
    );

    return (
        <div>
            {!noFilter ? (
                <div className="my-2 d-flex justify-content-between">
                    <Form.Control
                        type="text"
                        placeholder={intl.formatMessage({ id: 'msg.filterSegments' })}
                        value={filterTerm ?? ''}
                        onChange={(event) => dispatch(segmentDataActions.setFilterTerm(event.target.value))}
                    />
                    <div className="d-flex align-items-center">
                        <SegmentUsageFilter />
                        <DescriptionInfoButton
                            titleMessageId="msg.segment"
                            descriptionMessageId="msg.description.segments"
                        >
                            <GpxCreationHint />
                        </DescriptionInfoButton>
                    </div>
                </div>
            ) : (
                <div>
                    <FormattedMessage id="msg.description.segments" />
                    <GpxCreationHint />
                </div>
            )}
            {rows.length > 0 ? (
                <GpxSegmentsTable rows={rows} upload={<GpxSegmentsUploadAndParse />} />
            ) : (
                <div>
                    <div>
                        <FormattedMessage id="msg.noFile" />
                    </div>
                    <div style={{ height: '70px', width: '200px' }}>
                        <GpxSegmentsUploadAndParse />
                    </div>
                </div>
            )}
            <div style={{ height: '200px' }}></div>
        </div>
    );
}
