import { Form, Table } from 'react-bootstrap';
import { GpxSegmentRow } from './GpxSegmentRow.tsx';
import { useDispatch, useSelector } from 'react-redux';
// import { getFilteredGpxSegments, getSegmentFilterTerm, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { GpxSegmentsUploadAndParse } from './GpxSegmentsUploadAndParse.tsx';
import { getFilteredGpxSegments, getSegmentFilterTerm, segmentDataActions } from '../new-store/segmentData.redux.ts';

interface Props {
    noFilter?: boolean;
}

export function GpxSegments({ noFilter }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const filterTerm = useSelector(getSegmentFilterTerm);
    const setFilterTerm = (term: string) => dispatch(segmentDataActions.setFilterTerm(term));
    const filteredSegments = useSelector(getFilteredGpxSegments);

    return (
        <div>
            {!noFilter && (
                <div className={'my-2'}>
                    <Form.Control
                        type="text"
                        placeholder={intl.formatMessage({ id: 'msg.filterSegments' })}
                        value={filterTerm ?? ''}
                        onChange={(value) => setFilterTerm(value.target.value)}
                    />
                </div>
            )}
            {filteredSegments.length > 0 ? (
                <Table striped bordered hover style={{ width: '100%' }} size="sm">
                    <thead>
                        <tr>
                            <th style={{ width: '100%' }}>
                                <FormattedMessage id={'msg.file'} />
                            </th>
                            <th style={{ width: '30%', minWidth: '150px' }}>
                                <FormattedMessage id={'msg.globalSpeed'} />
                            </th>
                            <th style={{ width: '30%', minWidth: '150px' }}>
                                <FormattedMessage id={'msg.customSpeed'} />
                            </th>
                            <th style={{ width: '70px', minWidth: '70px' }}>
                                <FormattedMessage id={'msg.actions'} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSegments.length > 5 && (
                            <tr>
                                <td colSpan={3}>
                                    <GpxSegmentsUploadAndParse />
                                </td>
                            </tr>
                        )}
                        {filteredSegments.map((gpxSegment) => (
                            <GpxSegmentRow key={gpxSegment.id} gpxSegment={gpxSegment} />
                        ))}
                        <tr>
                            <td colSpan={3}>
                                <GpxSegmentsUploadAndParse />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <div>
                    <div>
                        <FormattedMessage id={'msg.noFile'} />
                    </div>
                    <div style={{ height: '70px', width: '200px' }}>
                        <GpxSegmentsUploadAndParse />
                    </div>
                </div>
            )}
        </div>
    );
}
