import { PlannerSidebarStreetInfos } from './PlannerSidebarStreetInfos.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { SegmentFilesDownloader } from '../segments/SegmentFilesDownloader.tsx';
import { CalculatedFilesDownloader } from '../tracks/CalculatedFilesDownloader.tsx';
import { StreetFilesDownloader } from '../streets/StreetFilesDownloader.tsx';
import { StreetFilesPdfMakeDownloader } from '../streets/StreetFilesPdfMakeDownloader.tsx';
import { ExportStateJson } from '../io/ExportStateJson.tsx';
import { PlanningLabel } from '../parameters/PlanningLabel.tsx';

export const PlannerSidebarDocuments = () => {
    const intl = useIntl();
    return (
        <div>
            <div>
                <h3>
                    <FormattedMessage id={'msg.street'} />
                </h3>
                <PlannerSidebarStreetInfos />
            </div>
            <div>
                <h3>
                    <FormattedMessage id={'msg.documents'} />
                </h3>
                <PlanningLabel />
                <h4>
                    <FormattedMessage id={'msg.segments'} />
                </h4>
                <SegmentFilesDownloader />
                <h4>
                    <FormattedMessage id={'msg.tracks'} />
                </h4>
                <CalculatedFilesDownloader />
                <h4>
                    <FormattedMessage id={'msg.documents'} />
                </h4>
                <div className={'m-2'}>
                    <StreetFilesDownloader /> <StreetFilesPdfMakeDownloader />
                </div>
                <h4>
                    <FormattedMessage id={'msg.completeStatus'} />
                </h4>
                <ExportStateJson label={intl.formatMessage({ id: 'msg.downloadPlanning' })} />
            </div>
        </div>
    );
};
