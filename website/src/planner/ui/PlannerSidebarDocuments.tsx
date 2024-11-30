import { PlannerSidebarStreetInfos } from './PlannerSidebarStreetInfos.tsx';
import { FormattedMessage } from 'react-intl';
import { PlanningLabel } from '../parameters/PlanningLabel.tsx';
import { PlannerSidebarServerSection } from './PlannerSidebarServerSection.tsx';

export const PlannerSidebarDocuments = () => {
    return (
        <div>
            <div className={'m-2'}>
                <PlannerSidebarServerSection />
            </div>
            <div className={'m-2'}>
                <h3>
                    <FormattedMessage id={'msg.street'} />
                </h3>
                <PlannerSidebarStreetInfos />
            </div>
            <div>
                <PlanningLabel />
            </div>
        </div>
    );
};
