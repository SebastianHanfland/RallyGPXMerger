import FileSaver from 'file-saver';
import { Button } from 'react-bootstrap';
import { getColorFromUuid } from '../utils/colorUtil.ts';

interface Props {
    id: string;
    content: string;
    name: string;
}

const downloadFile = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'gpx' });
    FileSaver.saveAs(blob, `${name}`);
};

export const FileDownloader = ({ id, name, content }: Props) => {
    return (
        <Button
            className={'m-2'}
            onClick={() => downloadFile(name, content)}
            style={{ backgroundColor: getColorFromUuid(id) }}
            title={`Download file "${name}"`}
        >
            {name}
        </Button>
    );
};
