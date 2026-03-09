import { TrackMergeParameters } from '../../../parameters/TrackMergeParameters.tsx';
import { ApiKeyInput } from '../../../streets/ApiKeyInput.tsx';
import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { ConstructionSites } from '../../../construction/ConstructionSites.tsx';
import { GapFinderParameters } from '../../../parameters/GapFinderParameters.tsx';
import { PlanningTitle } from '../../../parameters/PlanningTitle.tsx';
import { TrackPriorityTable } from '../../../parameters/TrackPriorityTable.tsx';
import { StartTimeTable } from '../../../parameters/StartTimeTable.tsx';
import { ArrivalDateTimePicker } from '../../../parameters/ArrivalDateTimePicker.tsx';
import { ReactNode } from 'react';
import { PointsOfInterest } from '../../../points/PointsOfInterest.tsx';
import { StartNameOverwriteTable } from '../../../parameters/StartNameOverwriteTable.tsx';
import { TrackNodesTable } from '../../../parameters/TrackNodesTable.tsx';

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
        ['msg.gapSetting', <GapFinderParameters />],
        ['msg.prio', <TrackPriorityTable />],
        ['msg.nodes', <TrackNodesTable />],
        ['msg.communicatedStart', <StartTimeTable />],
        ['msg.startNameOverwrite', <StartNameOverwriteTable />],
        ['msg.ownApiKey', <ApiKeyInput />],
        ['msg.constructions.title', <ConstructionSites />],
        ['msg.points', <PointsOfInterest />],
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
