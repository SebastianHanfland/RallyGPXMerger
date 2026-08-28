import { PlannerSidebarStreetInfos } from './PlannerSidebarStreetInfos.tsx';
import { FormattedMessage } from 'react-intl';
import { PlanningLabel } from '../../../parameters/PlanningLabel.tsx';
import { PlannerSidebarServerSection } from '../../../server/ServerInteraction.tsx';
import { PlannerSidebarBlockedStreets } from './PlannerSidebarBlockedStreets.tsx';
import { DescriptionInfoButton } from '../DescriptionInfoButton.tsx';

export const PlannerSidebarDocuments = () => {
    return (
        <div>
            <div className={'d-flex justify-content-end m-2'}>
                <DescriptionInfoButton
                    titleMessageId={'msg.documents'}
                    descriptionMessageId={'msg.description.documents'}
                />
            </div>
            <div className={'m-2'}>
                <PlannerSidebarServerSection />
            </div>
            <div className={'m-2'}>
                <h3>
                    <FormattedMessage id={'msg.street'} />
                </h3>
                <PlannerSidebarStreetInfos />
            </div>
            <PlannerSidebarBlockedStreets />
            <div>
                <PlanningLabel />
            </div>
        </div>
    );
};
