import { ApiKeyInput } from '../../../streets/ApiKeyInput.tsx';
import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { GapFinderParameters } from '../../../parameters/GapFinderParameters.tsx';
import { ReactNode } from 'react';
import { ResetAllResolvedStreets } from '../../../segments/ResetAllResolvedStreets.tsx';

export const PlannerSidebarSimpleSettings = () => {
    const accordionEntries: [string, ReactNode, string][] = [
        ['msg.gapSetting', <GapFinderParameters />, '0'],
        ['msg.ownApiKey', <ApiKeyInput />, '1'],
        ['msg.resetAllStreets.title', <ResetAllResolvedStreets />, '2'],
    ];
    return (
        <div className={'m-2'}>
            <Accordion defaultActiveKey={'0'}>
                {accordionEntries.map(([title, component, key]) => (
                    <Accordion.Item eventKey={key} key={key}>
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
