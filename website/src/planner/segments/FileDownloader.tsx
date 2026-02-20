import FileSaver from 'file-saver';
import { Button, Dropdown } from 'react-bootstrap';
import { getColor } from '../../utils/colorUtil.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { DownloadIcon } from '../../utils/icons/DownloadIcon.tsx';

interface Props {
    id: string;
    content: string;
    name: string;
    color?: string;
    onlyIcon?: boolean;
    label?: string;
    size?: 'lg' | 'sm';
}

interface DropdownProps {
    content: string;
    name: string;
}

function getType(name: string) {
    if (name.includes('.gpx')) {
        return 'application/gpx+xml';
    }
    if (name.includes('.txt')) {
        return 'text/plain';
    }
    return 'application/json';
}

export const downloadFile = (name: string, content: string) => {
    const blob = new Blob([content], { type: getType(name) });
    FileSaver.saveAs(blob, name);
};

export const FileDownloader = (props: Props) => {
    const { name, content, onlyIcon, label, size } = props;
    const intl = useIntl();
    return (
        <Button
            onClick={() => downloadFile(name, content)}
            style={{ backgroundColor: getColor(props) }}
            size={size}
            title={intl.formatMessage({ id: 'msg.downloadFile.hint' }, { name })}
            className={onlyIcon ? 'm-1' : undefined}
        >
            {onlyIcon ? <DownloadIcon /> : name}
            {!!label && label}
        </Button>
    );
};

export const FileDownloaderDropdownItem = ({ name, content }: DropdownProps) => {
    const intl = useIntl();
    return (
        <Dropdown.Item
            onClick={() => downloadFile(name, content)}
            title={intl.formatMessage({ id: 'msg.downloadFile.hint' }, { name })}
        >
            <DownloadIcon black={true} />
            <span>
                <FormattedMessage id={'msg.downloadFile'} />
            </span>
        </Dropdown.Item>
    );
};
