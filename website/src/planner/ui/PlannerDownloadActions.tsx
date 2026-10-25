import { Dropdown } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { DownloadIcon } from '../../utils/icons/DownloadIcon';
import { DownloadDataButton } from '../server/DownloadDataButton';
import { DownloadDataForCopyButton } from '../server/DownloadDataForCopyButton';
import { CalculatedFilesDownloader } from '../download/gpx/CalculatedFilesDownloader';
import { SegmentFilesDownloader } from '../download/gpx/SegmentFilesDownloader';
import { StreetFilesDownloader } from '../streets/StreetFilesDownloader';
import { PdfDocumentInZipButton } from '../download/pdf/PdfDocumentInZip';
import type { ReactNode } from 'react';

const Action = ({ children }: { children: ReactNode }) => <Dropdown.Item as="div">{children}</Dropdown.Item>;

export const PlannerDownloadActions = ({ onMap = false }: { onMap?: boolean }) => {
    const intl = useIntl();
    return (
        <Dropdown className="my-1" drop={onMap ? 'down' : undefined}>
            <Dropdown.Toggle
                variant="info"
                title={intl.formatMessage({ id: 'msg.downloads' })}
                style={onMap ? { width: '45px', height: '45px', padding: 0 } : undefined}
            >
                <DownloadIcon size={20} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Header>
                    <FormattedMessage id="msg.downloads" />
                </Dropdown.Header>
                <Action>
                    <DownloadDataButton />
                </Action>
                <Action>
                    <DownloadDataForCopyButton />
                </Action>
                <Action>
                    <PdfDocumentInZipButton />
                </Action>
                <Action>
                    <CalculatedFilesDownloader />
                </Action>
                <Action>
                    <StreetFilesDownloader />
                </Action>
                <Action>
                    <SegmentFilesDownloader />
                </Action>
            </Dropdown.Menu>
        </Dropdown>
    );
};
