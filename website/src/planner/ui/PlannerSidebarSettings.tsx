import { TrackMergeParameters } from '../parameters/TrackMergeParameters.tsx';
import { ApiKeyInput } from '../streets/ApiKeyInput.tsx';
import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { ConstructionSites } from '../settings/ConstructionSites.tsx';
import { GapFinderParameters } from '../parameters/GapFinderParameters.tsx';

export const PlannerSidebarSettings = ({ all }: { all?: boolean }) => {
    return (
        <div className={'m-2'}>
            <Accordion defaultActiveKey={all ? '0' : '1'}>
                {all && (
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <FormattedMessage id={'msg.trackSettings'} />
                        </Accordion.Header>
                        <Accordion.Body>
                            <TrackMergeParameters />
                        </Accordion.Body>
                    </Accordion.Item>
                )}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.gapSetting'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <GapFinderParameters />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.ownApiKey'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <ApiKeyInput />
                    </Accordion.Body>
                </Accordion.Item>
                {all && (
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>
                            <FormattedMessage id={'msg.constructions.title'} />
                        </Accordion.Header>
                        <Accordion.Body>
                            <ConstructionSites />
                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </Accordion>
        </div>
    );
};
