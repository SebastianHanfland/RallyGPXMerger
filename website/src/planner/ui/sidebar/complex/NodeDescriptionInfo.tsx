import { DescriptionInfoButton } from '../DescriptionInfoButton.tsx';
import { FormattedMessage } from 'react-intl';

const Sketch = ({ messageId }: { messageId: string }) => (
    <div className="font-monospace my-2" style={{ whiteSpace: 'pre-wrap' }}>
        <FormattedMessage id={messageId} />
    </div>
);

export const NodeDescriptionInfo = () => (
    <DescriptionInfoButton titleMessageId="msg.nodes.specificBehavior" descriptionMessageId="msg.description.nodes">
        <ol>
            <li>
                <FormattedMessage id="msg.description.nodes.people" />
                <Sketch messageId="msg.description.nodes.peopleSketch" />
            </li>
            <li>
                <FormattedMessage id="msg.description.nodes.priority" />
                <Sketch messageId="msg.description.nodes.prioritySketch" />
            </li>
            <li>
                <FormattedMessage id="msg.description.nodes.percentage" />
                <Sketch messageId="msg.description.nodes.percentageSketch" />
            </li>
        </ol>
        <p>
            <FormattedMessage id="msg.description.nodes.laterNodes" />
        </p>
    </DescriptionInfoButton>
);
