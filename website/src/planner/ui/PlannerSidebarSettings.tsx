import { TrackMergeParameters } from '../parameters/TrackMergeParameters.tsx';
import { ApiKeyInput } from '../streets/ApiKeyInput.tsx';
import { Accordion } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

export const PlannerSidebarSettings = () => {
    return (
        <div>
            <TrackMergeParameters />
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <FormattedMessage id={'msg.ownApiKey'} />
                    </Accordion.Header>
                    <Accordion.Body>
                        <ApiKeyInput />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};
