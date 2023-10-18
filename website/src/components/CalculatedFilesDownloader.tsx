import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';

interface Props {
    content: string;
    name: string;
}

const downloadFile = (name: string, content: string) => {
    const zip = new JSZip();
    zip.file(`${name}.gpx`, new Blob([content], { type: 'gpx' }));
    zip.file(`${name}1.gpx`, new Blob([content], { type: 'gpx' }));
    zip.file(`${name}2.gpx`, new Blob([content], { type: 'gpx' }));
    zip.file(`${name}3.gpx`, new Blob([content], { type: 'gpx' }));
    zip.file(`${name}4.gpx`, new Blob([content], { type: 'gpx' }));
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, 'download.zip');
    });

    // const blob = new Blob([content], { type: 'gpx' });
    // FileSaver.saveAs(blob, `${name}.gpx`);
};

export const CalculatedFilesDownloader = ({ name, content }: Props) => {
    return (
        <Button className={'m-2'} onClick={() => downloadFile(name, content)}>
            Download File
        </Button>
    );
};
