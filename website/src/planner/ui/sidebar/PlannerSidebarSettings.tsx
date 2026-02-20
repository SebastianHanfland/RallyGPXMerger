import { TrackMergeParameters } from '../../parameters/TrackMergeParameters.tsx';
import { ApiKeyInput } from '../../streets/ApiKeyInput.tsx';
import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { ConstructionSites } from '../../settings/ConstructionSites.tsx';
import { GapFinderParameters } from '../../parameters/GapFinderParameters.tsx';
import { PlanningTitle } from '../../parameters/PlanningTitle.tsx';
import { TrackPriorityTable } from '../../parameters/TrackPriorityTable.tsx';
import { StartTimeTable } from '../../parameters/StartTimeTable.tsx';
import { ArrivalDateTimePicker } from '../../parameters/ArrivalDateTimePicker.tsx';

export const PlannerSidebarSettings = () => {
    return (
        <div className={'m-2'}>
            <Accordion defaultActiveKey={'0'}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.titleOfPlanning'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <PlanningTitle />
                        <ArrivalDateTimePicker />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.trackSettings'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <TrackMergeParameters />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.gapSetting'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <GapFinderParameters />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.prio'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <TrackPriorityTable />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.communicatedStart'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <StartTimeTable />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.ownApiKey'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <ApiKeyInput />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="6">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.constructions.title'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <ConstructionSites />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};
