import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import download from '../assets/file-down.svg';

export const downloadFilesInZip = (calculatedTracks: { content: string; filename: string }[], zipName: string) => {
    const zip = new JSZip();
    calculatedTracks.forEach((track) => {
        zip.file(`${track.filename}.gpx`, new Blob([track.content], { type: 'gpx' }));
    });
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, `${zipName}-${new Date().toISOString()}.zip`);
    });
};

export const CalculatedFilesDownloader = () => {
    const calculatedTracks = useSelector(getCalculatedTracks);
    return (
        <Button
            onClick={() => downloadFilesInZip(calculatedTracks, 'RallySimulation')}
            disabled={calculatedTracks.length === 0}
            title={'Download all GPX files for the tracks'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            Download GPX Files
        </Button>
    );
};
