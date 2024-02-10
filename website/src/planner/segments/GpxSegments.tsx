import { FileUploader } from 'react-drag-drop-files';
import { Form, Table } from 'react-bootstrap';
import { FileDisplay } from './FileDisplay.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getFilteredGpxSegments, getSegmentFilterTerm, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { gpxShortener } from '../io/gpxShortener.ts';
import { GpxSegment } from '../../common/types.ts';
import { FormattedMessage, useIntl } from 'react-intl';

const fileTypes = ['GPX'];

export async function toGpxSegment(file: File): Promise<GpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name,
        content: gpxShortener(new TextDecoder().decode(buffer)),
    }));
}

export const ALLOWS_TO_ENTER_PEOPLE_AT_START: boolean = false;

interface Props {
    noFilter?: boolean;
}

export function GpxSegments({ noFilter }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const filterTerm = useSelector(getSegmentFilterTerm);
    const setFilterTerm = (term: string) => dispatch(gpxSegmentsActions.setFilterTerm(term));
    const filteredSegments = useSelector(getFilteredGpxSegments);

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toGpxSegment)).then((newGpxSegments) =>
            dispatch(gpxSegmentsActions.addGpxSegments(newGpxSegments))
        );
    };
    return (
        <div>
            {!noFilter && (
                <div className={'my-2'}>
                    <Form.Control
                        type="text"
                        placeholder={intl.formatMessage({ id: 'msg.filterSegments' })}
                        value={filterTerm}
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
                            <th style={{ width: '38px' }}>
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
                                        label={'Please upload the GPX segments here'}
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
