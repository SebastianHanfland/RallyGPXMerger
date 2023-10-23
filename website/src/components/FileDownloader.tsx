import FileSaver from 'file-saver';
import { Button } from 'react-bootstrap';

interface Props {
    content: string;
    name: string;
}

const downloadFile = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'gpx' });
    FileSaver.saveAs(blob, `${name}`);
};

export const FileDownloader = ({ name, content }: Props) => {
    return (
        <Button className={'m-2'} onClick={() => downloadFile(name, content)}>
            {name}
        </Button>
    );
};
