import FileSaver from 'file-saver';
import { Button } from 'react-bootstrap';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import download from '../../assets/file-down.svg';

interface Props {
    id: string;
    content: string;
    name: string;
    onlyIcon?: boolean;
}

const downloadFile = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'gpx' });
    FileSaver.saveAs(blob, `${name}`);
};

export const FileDownloader = ({ id, name, content, onlyIcon }: Props) => {
    return (
        <Button
            onClick={() => downloadFile(name, content)}
            style={{ backgroundColor: getColorFromUuid(id) }}
            title={`Download file "${name}"`}
            className={onlyIcon ? 'm-1' : undefined}
        >
            {onlyIcon ? <img src={download} alt="download file" color={'#ffffff'} /> : name}
        </Button>
    );
};
