import { Accordion } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { DescriptionInfoButton } from '../DescriptionInfoButton';
import { PointsOfInterest } from '../../../points/PointsOfInterest';
import { StartTimeTable } from '../../../parameters/StartTimeTable';
import { TrackNodesTable } from '../../../parameters/nodes/TrackNodesTable';
import { TrackOverviewButton } from '../../../tracks/overview/TrackOverviewButton';
import { NodeOverviewButton } from '../../../parameters/nodes/NodeOverviewButton';
import { PlannerSidebarOverviewChecks } from './PlannerSidebarOverviewChecks';
import type { ReactNode } from 'react';
import { PlannerSidebarOverviewStartNames } from './PlannerSidebarOverviewStartNames';
import { GapOverview } from '../../../points/GapOverview';
import { GapOverviewHeader } from '../../../points/GapOverviewHeader';
import { PointsOfInterestHeader } from '../../../points/PointsOfInterestHeader';
import { OverviewChecksHeader } from './OverviewChecksHeader';
import { PlannerSidebarOverviewStartNamesHeader } from './PlannerSidebarOverviewStartNamesHeader';
import { PlannerSidebarOverviewStartTimesHeader } from './PlannerSidebarOverviewStartTimesHeader';
import { PlannerSidebarOverviewEntryPoints } from './PlannerSidebarOverviewEntryPoints';
import { PlannerSidebarOverviewEntryPointsHeader } from './PlannerSidebarOverviewEntryPointsHeader';
import { PlannerSidebarOverviewPublicLinks } from './PlannerSidebarOverviewPublicLinks';
import { FlowOverviewButton } from '../../../flow/FlowOverviewButton';
import { PlannerSidebarOverviewTrackArrivals } from './PlannerSidebarOverviewTrackArrivals';
import { TrackPriorityTable } from '../../../parameters/TrackPriorityTable';

export const PlannerSidebarOverview = () => {
    const intl = useIntl();

    const accordionEntries: [string, string | ReactNode, ReactNode][] = [
        ['checks', <OverviewChecksHeader />, <PlannerSidebarOverviewChecks />],
        ['gaps', <GapOverviewHeader />, <GapOverview />],
        ['points', <PointsOfInterestHeader />, <PointsOfInterest />],
        ['start', <PlannerSidebarOverviewStartNamesHeader />, <PlannerSidebarOverviewStartNames />],
        ['comStart', <PlannerSidebarOverviewStartTimesHeader />, <StartTimeTable />],
        ['entryPoints', <PlannerSidebarOverviewEntryPointsHeader />, <PlannerSidebarOverviewEntryPoints />],
        ['priorities', intl.formatMessage({ id: 'msg.prio' }), <TrackPriorityTable />],
        ['trackArrivals', intl.formatMessage({ id: 'msg.trackArrivals' }), <PlannerSidebarOverviewTrackArrivals />],
        ['nodes', intl.formatMessage({ id: 'msg.nodes' }), <TrackNodesTable />],
        ['publicLinks', intl.formatMessage({ id: 'msg.publicLinks' }), <PlannerSidebarOverviewPublicLinks />],
    ];

    return (
        <div className="m-2">
            <div className={'d-flex my-2 justify-content-between'}>
                <TrackOverviewButton />
                <NodeOverviewButton />
                <FlowOverviewButton />
                <div className="d-flex justify-content-end">
                    <DescriptionInfoButton
                        titleMessageId="msg.overview"
                        descriptionMessageId="msg.description.overview"
                    />
                </div>
            </div>
            <Accordion defaultActiveKey="checks">
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
