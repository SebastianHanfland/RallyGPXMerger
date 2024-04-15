import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import download from '../../assets/file-down.svg';
import { FormattedMessage, useIntl } from 'react-intl';

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
            onClick={() => downloadFilesInZip(calculatedTracks, 'RallySimulation')}
            disabled={calculatedTracks.length === 0}
            title={intl.formatMessage({ id: 'msg.downloadTracks.hint' })}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            <FormattedMessage id={'msg.downloadTracks'} />
        </Button>
    );
};
