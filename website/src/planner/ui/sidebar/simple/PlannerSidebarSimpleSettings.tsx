import { ApiKeyInput } from '../../../streets/ApiKeyInput.tsx';
import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { GapFinderParameters } from '../../../parameters/GapFinderParameters.tsx';
import { PlanningTitle } from '../../../parameters/PlanningTitle.tsx';
import { PlannerSidebarServerSection } from '../PlannerSidebarServerSection.tsx';
import { ArrivalDateTimePicker } from '../../../parameters/ArrivalDateTimePicker.tsx';
import { BlockTextDescription } from '../../../../utils/layout/BlockTextDescription.tsx';
import { ReactNode } from 'react';

export const PlannerSidebarSimpleSettings = () => {
    const accordionEntries: [string, ReactNode, string][] = [
        ['msg.gapSetting', <GapFinderParameters />, '0'],
        ['msg.ownApiKey', <ApiKeyInput />, '1'],
    ];
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
            <Accordion defaultActiveKey={'0'}>
                {accordionEntries.map(([title, component, key]) => (
                    <Accordion.Item eventKey={key}>
                        <Accordion.Header>
                            <FormattedMessage id={title} />
                        </Accordion.Header>
                        <Accordion.Body>{component}</Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
};
