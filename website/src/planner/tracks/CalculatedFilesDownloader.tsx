import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import download from '../../assets/file-downB.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { getGpxContentFromTimedPoints } from '../../utils/SimpleGPXFromPoints.ts';

export const downloadFilesInZip = (calculatedTracks: { content: string; filename: string }[], zipName: string) => {
    const zip = new JSZip();
    const usedFilenames: string[] = [];
    let conflictCounter = 1;
    calculatedTracks.forEach((track) => {
        let intendedFileName = track.filename.replace('.gpx', '');
        if (usedFilenames.includes(intendedFileName)) {
            intendedFileName += `(${conflictCounter++})`;
        }
        zip.file(`${intendedFileName}.gpx`, new Blob([track.content], { type: 'application/gpx+xml' }));
        usedFilenames.push(intendedFileName);
    });
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, `${zipName}-${new Date().toISOString()}.zip`);
    });
};

export const CalculatedFilesDownloader = () => {
    const intl = useIntl();
    const calculatedTracks = useSelector(getCalculatedTracks);
    return (
        <Button
            onClick={() => {
                const trackWithContent = calculatedTracks.map((track) => ({
                    filename: track.filename,
                    content: getGpxContentFromTimedPoints(track.points, track.filename!),
                }));
                downloadFilesInZip(trackWithContent, 'RallySimulation');
            }}
            disabled={calculatedTracks.length === 0}
            variant={'info'}
            title={intl.formatMessage({ id: 'msg.downloadTracks.hint' })}
        >
            <img
                src={download}
                className="m-1"
                alt="download file"
                color={'#ffffff'}
                style={{ height: '20px', width: '20px' }}
            />
            <FormattedMessage id={'msg.downloadTracks'} />
        </Button>
    );
};
