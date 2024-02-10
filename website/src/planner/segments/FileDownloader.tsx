import FileSaver from 'file-saver';
import { Button, Dropdown } from 'react-bootstrap';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import download from '../../assets/file-down.svg';
import downloadB from '../../assets/file-downB.svg';
import { FormattedMessage } from 'react-intl';

interface Props {
    id: string;
    content: string;
    name: string;
    onlyIcon?: boolean;
    label?: string;
}

interface DropdownProps {
    content: string;
    name: string;
}

const downloadFile = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'gpx' });
    FileSaver.saveAs(blob, `${name}`);
};

export const FileDownloader = ({ id, name, content, onlyIcon, label }: Props) => {
    return (
        <Button
            onClick={() => downloadFile(name, content)}
            style={{ backgroundColor: getColorFromUuid(id) }}
            title={`Download file "${name}"`}
            className={onlyIcon ? 'm-1' : undefined}
        >
            {onlyIcon ? <img src={download} alt="download file" color={'#ffffff'} /> : name}
            {!!label && label}
        </Button>
    );
};

export const FileDownloaderDropdownItem = ({ name, content }: DropdownProps) => {
    return (
        <Dropdown.Item onClick={() => downloadFile(name, content)} title={`Download file "${name}"`}>
            <img src={downloadB} alt="download file" color={'#ffffff'} className="m-1" />
            <span>
                <FormattedMessage id={'msg.downloadFile'} />
            </span>
        </Dropdown.Item>
    );
};
