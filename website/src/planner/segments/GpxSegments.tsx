import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore';
import { GpxSegmentsUploadAndParse } from './GpxSegmentsUploadAndParse';
import { getSegmentFilterTerm, segmentDataActions } from '../store/segmentData.redux';
import { DescriptionInfoButton } from '../ui/sidebar/DescriptionInfoButton';
import { GpxCreationHint } from './GpxCreationHint';
import { getTrackCompositions } from '../store/trackMerge.reducer';
import { getSegmentTableRows } from './segmentTableData';
import { SegmentUsageFilter } from './SegmentUsageFilter';
import { GpxSegmentsTable } from './GpxSegmentsTable';
import { getSegmentUsages } from './segmentUsageCounter';

interface Props {
    noFilter?: boolean;
}

export function GpxSegments({ noFilter }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const filterTerm = useSelector(getSegmentFilterTerm);
    const trackCompositions = useSelector(getTrackCompositions);
    const segmentUsages = useSelector(getSegmentUsages);
    const rows = useSelector(getSegmentTableRows);

    return (
        <div>
            {!noFilter ? (
                <div className="mb-2 d-flex justify-content-between">
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
                <GpxSegmentsTable
                    rows={rows}
                    upload={<GpxSegmentsUploadAndParse />}
                    segmentUsages={segmentUsages}
                    planningHasTracks={trackCompositions.length > 0}
                />
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
