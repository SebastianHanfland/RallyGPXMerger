import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { CalculatedTrack } from '../store/types.ts';
import download from '../assets/file-down.svg';

const downloadFile = (calculatedTracks: CalculatedTrack[]) => {
    const zip = new JSZip();
    calculatedTracks.forEach((track) => {
        zip.file(`${track.filename}.gpx`, new Blob([track.content], { type: 'gpx' }));
    });
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, `RallySimulation-${new Date().toISOString()}.zip`);
    });
};

export const CalculatedFilesDownloader = () => {
    const calculatedTracks = useSelector(getCalculatedTracks);
    return (
        <Button
            onClick={() => downloadFile(calculatedTracks)}
            disabled={calculatedTracks.length === 0}
            title={'Download all GPX files for the tracks'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            Download GPX Files
        </Button>
    );
};
