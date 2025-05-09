import { FileUploader } from 'react-drag-drop-files';
import { Table } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { getConstructionSegments, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { ConstructionFileDisplay } from './ConstructionFileDisplay.tsx';
import { GpxSegment, ParsedTrack } from '../../common/types.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { parsedTracksActions } from '../store/parsedTracks.reducer.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { optionallyDecompress } from '../store/compressHelper.ts';

const fileTypes = ['GPX'];

async function toGpxSegment(file: File): Promise<GpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name,
        content: new TextDecoder().decode(buffer),
    }));
}

export const ALLOWS_TO_ENTER_PEOPLE_AT_START: boolean = false;

export function ConstructionSites() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const constructionSegments = useSelector(getConstructionSegments) ?? [];

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toGpxSegment)).then((newGpxSegments) => {
            dispatch(gpxSegmentsActions.addConstructionSegments(newGpxSegments));
            const parsedConstructionSegments = newGpxSegments.map(
                (track): ParsedTrack => ({
                    id: track.id,
                    filename: track.filename,
                    version: 'current',
                    color: 'red',
                    points: SimpleGPX.fromString(optionallyDecompress(track.content)).getPoints(),
                })
            );
            dispatch(parsedTracksActions.addParsedConstructionSegments(parsedConstructionSegments));
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
