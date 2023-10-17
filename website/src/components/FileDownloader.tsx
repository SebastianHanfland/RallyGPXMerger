import FileSaver from 'file-saver';

interface Props {
    content: string;
    name: string;
}

const downloadFile = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'gpx' });
    FileSaver.saveAs(blob, `${name}.gpx`);
};

export const FileDownloader = ({ name, content }: Props) => {
    return <button onClick={() => downloadFile(name, content)}>DownloadFile</button>;
};
