import { Accordion } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { DescriptionInfoButton } from '../DescriptionInfoButton.tsx';
import { PointsOfInterest } from '../../../points/PointsOfInterest.tsx';
import { StartTimeTable } from '../../../parameters/StartTimeTable.tsx';
import { TrackNodesTable } from '../../../parameters/nodes/TrackNodesTable.tsx';
import { TrackOverviewButton } from '../../../tracks/overview/TrackOverviewButton.tsx';
import { NodeOverviewButton } from '../../../parameters/nodes/NodeOverviewButton.tsx';
import { PlannerSidebarOverviewChecks } from './PlannerSidebarOverviewChecks.tsx';
import type { ReactNode } from 'react';
import { PlannerSidebarOverviewStartNames } from './PlannerSidebarOverviewStartNames.tsx';
import { GapOverview } from '../../../points/GapOverview.tsx';
import { GapOverviewHeader } from '../../../points/GapOverviewHeader.tsx';
import { PointsOfInterestHeader } from '../../../points/PointsOfInterestHeader.tsx';

export const PlannerSidebarOverview = () => {
    const intl = useIntl();

    const accordionEntries: [string, string | ReactNode, ReactNode][] = [
        ['checks', intl.formatMessage({ id: 'msg.checks' }), <PlannerSidebarOverviewChecks />],
        ['gaps', <GapOverviewHeader />, <GapOverview />],
        ['points', <PointsOfInterestHeader />, <PointsOfInterest />],
        ['start', intl.formatMessage({ id: 'msg.startNameOverwrite' }), <PlannerSidebarOverviewStartNames />],
        ['comStart', intl.formatMessage({ id: 'msg.communicatedStart' }), <StartTimeTable />],
        ['nodes', intl.formatMessage({ id: 'msg.nodes' }), <TrackNodesTable />],
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
                {accordionEntries.map(([key, title, component]) => (
                    <Accordion.Item eventKey={key} key={key}>
                        <Accordion.Header>{title}</Accordion.Header>
                        <Accordion.Body>{component}</Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
};
