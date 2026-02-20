import { ApiKeyInput } from '../../streets/ApiKeyInput.tsx';
import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { GapFinderParameters } from '../../parameters/GapFinderParameters.tsx';
import { PlanningTitle } from '../../parameters/PlanningTitle.tsx';
import { PlannerSidebarServerSection } from './PlannerSidebarServerSection.tsx';
import { ArrivalDateTimePicker } from '../../parameters/ArrivalDateTimePicker.tsx';
import { BlockTextDescription } from '../../layout/BlockTextDescription.tsx';

export const PlannerSidebarSimpleSettings = () => {
    return (
        <div className={'m-2'}>
            <BlockTextDescription messageId={'msg.description.documents'} />
            <PlannerSidebarServerSection />
            <div className={'d-inline-block m-3'}>
                <h5 className="form-label m-3">
                    <FormattedMessage id={'msg.titleOfPlanning'} />
                </h5>
                <PlanningTitle />
                <ArrivalDateTimePicker />
            </div>
            <Accordion defaultActiveKey={'2'}>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.gapSetting'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <GapFinderParameters />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.ownApiKey'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <ApiKeyInput />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};
