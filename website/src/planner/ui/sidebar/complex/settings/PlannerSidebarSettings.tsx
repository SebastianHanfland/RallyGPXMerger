import { TrackMergeParameters } from '../../../../parameters/TrackMergeParameters';
import { ApiKeyInput } from '../../../../streets/ApiKeyInput';
import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { ConstructionSites } from '../../../../construction/ConstructionSites';
import { PlanningTitle } from '../../../../parameters/PlanningTitle';
import { ArrivalDateTimePicker } from '../../../../parameters/ArrivalDateTimePicker';
import { ReactNode } from 'react';
import { ResetAllResolvedStreets } from '../../../../segments/ResetAllResolvedStreets';

export const PlannerSidebarSettings = () => {
    const accordionEntries: [string, ReactNode][] = [
        [
            'msg.titleOfPlanning',
            <>
                <PlanningTitle />
                <ArrivalDateTimePicker />
            </>,
        ],
        ['msg.trackSettings', <TrackMergeParameters />],
        ['msg.ownApiKey', <ApiKeyInput />],
        ['msg.resetAllStreets.title', <ResetAllResolvedStreets />],
        ['msg.constructions.title', <ConstructionSites />],
    ];
    return (
        <div className={'m-2'}>
            <Accordion defaultActiveKey={'0'}>
                {accordionEntries.map(([title, component], key) => (
                    <Accordion.Item eventKey={`${key}`} key={key}>
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
