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
    const accordionEntries: { key: string; title: string; component: ReactNode }[] = [
        { key: 'checks', title: 'msg.checks', component: <PlannerSidebarOverviewChecks /> },
        {
            key: 'points',
            title: 'msg.points',
            component: <PointsOfInterest />,
        },
        { key: 'streets', title: 'msg.streetOverview', component: <PlannerSidebarOverviewStreets /> },
        {
            key: 'start-names',
            title: 'msg.startNameOverwrite',
            component: <PlannerSidebarOverviewStartNames />,
        },
        { key: 'communicated-start', title: 'msg.communicatedStart', component: <StartTimeTable /> },
        { key: 'nodes', title: 'msg.nodes', component: <TrackNodesTable /> },
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
            <Accordion defaultActiveKey="checks">
                {accordionEntries.map(({ key, title, component }) => (
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
