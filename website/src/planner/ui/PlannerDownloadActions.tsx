import { Dropdown } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { DownloadIcon } from '../../utils/icons/DownloadIcon.tsx';
import { DownloadDataButton } from '../server/DownloadDataButton.tsx';
import { DownloadDataForCopyButton } from '../server/DownloadDataForCopyButton.tsx';
import { CalculatedFilesDownloader } from '../download/gpx/CalculatedFilesDownloader.tsx';
import { SegmentFilesDownloader } from '../download/gpx/SegmentFilesDownloader.tsx';
import { StreetFilesDownloader } from '../streets/StreetFilesDownloader.tsx';
import { PdfDocumentInZipButton } from '../download/pdf/PdfDocumentInZip.tsx';
import type { ReactNode } from 'react';

const Action = ({ children }: { children: ReactNode }) => <Dropdown.Item as="div">{children}</Dropdown.Item>;

export const PlannerDownloadActions = ({ onMap = false }: { onMap?: boolean }) => {
    const intl = useIntl();
    return (
        <Dropdown className="m-1" drop={onMap ? 'down' : undefined}>
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
