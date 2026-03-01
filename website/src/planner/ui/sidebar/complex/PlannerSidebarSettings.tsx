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

export const PlannerSidebarSettings = () => {
    const accordionEntries: [string, ReactNode, string][] = [
        [
            'msg.titleOfPlanning',
            <>
                <PlanningTitle />
                <ArrivalDateTimePicker />
            </>,
            '0',
        ],
        ['msg.trackSettings', <TrackMergeParameters />, '1'],
        ['msg.gapSetting', <GapFinderParameters />, '2'],
        ['msg.prio', <TrackPriorityTable />, '3'],
        ['msg.communicatedStart', <StartTimeTable />, '4'],
        ['msg.startNameOverwrite', <StartNameOverwriteTable />, '5'],
        ['msg.ownApiKey', <ApiKeyInput />, '6'],
        ['msg.constructions.title', <ConstructionSites />, '7'],
        ['msg.points', <PointsOfInterest />, '8'],
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
