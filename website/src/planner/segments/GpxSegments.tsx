import { FileUploader } from 'react-drag-drop-files';
import { Form, Spinner, Table } from 'react-bootstrap';
import { FileDisplay } from './FileDisplay.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getFilteredGpxSegments, getSegmentFilterTerm, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { gpxShortener } from '../io/gpxShortener.ts';
import { GpxSegment } from '../../common/types.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { resolveStreetNames } from '../logic/resolving/streets/mapMatchingStreetResolver.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getIsLoadingStreetData } from '../store/geoCodingRequests.reducer.ts';

const fileTypes = ['GPX'];

export async function toGpxSegment(file: File): Promise<GpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name.replace('.gpx', ''),
        content: gpxShortener(new TextDecoder().decode(buffer)),
    }));
}

export const ALLOWS_TO_ENTER_PEOPLE_AT_START: boolean = false;

interface Props {
    noFilter?: boolean;
}

export function GpxSegments({ noFilter }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const filterTerm = useSelector(getSegmentFilterTerm);
    const isLoadingStreetData = useSelector(getIsLoadingStreetData);
    const setFilterTerm = (term: string) => dispatch(gpxSegmentsActions.setFilterTerm(term));
    const filteredSegments = useSelector(getFilteredGpxSegments);

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toGpxSegment))
            .then((newGpxSegments) => dispatch(gpxSegmentsActions.addGpxSegments(newGpxSegments)))
            .then(() => dispatch(resolveStreetNames));
    };
    return (
        <div>
            {isLoadingStreetData && (
                <span>
                    <Spinner size={'sm'} />
                    <FormattedMessage id={'msg.loadingStreetNames'} />
                </span>
            )}
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
                                    <FileUploader
                                        handleChange={handleChange}
                                        name="file"
                                        types={fileTypes}
                                        multiple={true}
                                        label={intl.formatMessage({ id: 'msg.uploadFile' })}
                                    />
                                </td>
                            </tr>
                        )}
                        {filteredSegments.map((gpxSegment) => (
                            <FileDisplay key={gpxSegment.id} gpxSegment={gpxSegment} />
                        ))}
                        <tr>
                            <td colSpan={3}>
                                <FileUploader
                                    handleChange={handleChange}
                                    name="file"
                                    types={fileTypes}
                                    multiple={true}
                                    label={intl.formatMessage({ id: 'msg.uploadFile' })}
                                />
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
                        <FileUploader
                            handleChange={handleChange}
                            name="file"
                            types={fileTypes}
                            multiple={true}
                            label={intl.formatMessage({ id: 'msg.uploadFile' })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
