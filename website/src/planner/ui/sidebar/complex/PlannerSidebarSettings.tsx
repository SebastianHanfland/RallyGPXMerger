import { TrackMergeParameters } from '../../../parameters/TrackMergeParameters.tsx';
import { ApiKeyInput } from '../../../streets/ApiKeyInput.tsx';
import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { ConstructionSites } from '../../../construction/ConstructionSites.tsx';
import { PlanningTitle } from '../../../parameters/PlanningTitle.tsx';
import { TrackPriorityTable } from '../../../parameters/TrackPriorityTable.tsx';
import { ArrivalDateTimePicker } from '../../../parameters/ArrivalDateTimePicker.tsx';
import { ReactNode } from 'react';
import { ResetAllResolvedStreets } from '../../../segments/ResetAllResolvedStreets.tsx';

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
        ['msg.prio', <TrackPriorityTable />],
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
