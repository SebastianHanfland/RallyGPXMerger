import { TrackDataOverviewTable } from './TrackDataOverviewTable.tsx';
import { FormattedMessage } from 'react-intl';
import { DashboardStreetsContent } from '../layout/dashboard/DashboardStreetsContent.tsx';

export function TrackDataOverview() {
    return (
        <div className={'m-2 p-2'}>
            <h4>
                <FormattedMessage id={'msg.externalDataOverview'} />
            </h4>
            <TrackDataOverviewTable />

            <DashboardStreetsContent showClearButton={true} />
        </div>
    );
}
