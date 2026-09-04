import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { DescriptionInfoButton } from '../DescriptionInfoButton.tsx';
import { PointsOfInterest } from '../../../points/PointsOfInterest.tsx';
import { StartTimeTable } from '../../../parameters/StartTimeTable.tsx';
import { TrackNodesTable } from '../../../parameters/nodes/TrackNodesTable.tsx';
import { TrackOverviewButton } from '../../../tracks/overview/TrackOverviewButton.tsx';
import { NodeOverviewButton } from '../../../parameters/nodes/NodeOverviewButton.tsx';
import { PlannerSidebarOverviewChecks } from './PlannerSidebarOverviewChecks.tsx';
import { PlannerSidebarOverviewStreets } from './PlannerSidebarOverviewStreets.tsx';
import type { ReactNode } from 'react';
import { PlannerSidebarOverviewStartNames } from './PlannerSidebarOverviewStartNames.tsx';

export const PlannerSidebarOverview = () => {
    const accordionEntries: [string, ReactNode][] = [
        ['msg.checks', <PlannerSidebarOverviewChecks />],
        ['msg.points', <PointsOfInterest />],
        ['msg.streetOverview', <PlannerSidebarOverviewStreets />],
        ['msg.startNameOverwrite', <PlannerSidebarOverviewStartNames />],
        ['msg.communicatedStart', <StartTimeTable />],
        ['msg.nodes', <TrackNodesTable />],
    ];

    return (
        <div className="m-2">
            <div className={'d-flex my-2'}>
                <TrackOverviewButton />
                <NodeOverviewButton />
                <div className="d-flex justify-content-end">
                    <DescriptionInfoButton
                        titleMessageId="msg.overview"
                        descriptionMessageId="msg.description.overview"
                    />
                </div>
            </div>
            <Accordion defaultActiveKey="msg.checks">
                {accordionEntries.map(([title, component]) => (
                    <Accordion.Item eventKey={title} key={title}>
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
