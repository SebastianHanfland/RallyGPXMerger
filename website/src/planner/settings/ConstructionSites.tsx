import { FileUploader } from 'react-drag-drop-files';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ConstructionFileDisplay } from './ConstructionFileDisplay.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { getConstructionSegments, segmentDataActions } from '../new-store/segmentData.redux.ts';
import { toParsedGpxSegment } from '../segments/segmentParsing.ts';

const fileTypes = ['GPX'];

export function ConstructionSites() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const constructionSegments = useSelector(getConstructionSegments) ?? [];

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toParsedGpxSegment)).then((newGpxSegments) => {
            dispatch(segmentDataActions.addConstructionSegments(newGpxSegments));
        });
    };
    return (
        <div style={{ height: '95%', overflow: 'auto' }}>
            {constructionSegments.length > 0 ? (
                <Table striped bordered hover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>File</th>
                            <th style={{ width: '10%', minWidth: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {constructionSegments.map((gpxSegment) => (
                            <ConstructionFileDisplay key={gpxSegment.id} gpxSegment={gpxSegment} />
                        ))}
                        <tr>
                            <td colSpan={3}>
                                <FileUploader
                                    handleChange={handleChange}
                                    name="file"
                                    types={fileTypes}
                                    multiple={true}
                                    label={intl.formatMessage({ id: 'msg.uploadConstructionFile' })}
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <div>
                    <div className={'m-3'}>
                        <FormattedMessage id={'msg.noFile'} />
                    </div>
                    <div style={{ height: '70px' }}>
                        <FileUploader
                            handleChange={handleChange}
                            name="file"
                            types={fileTypes}
                            multiple={true}
                            label={intl.formatMessage({ id: 'msg.uploadConstructionFile' })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
