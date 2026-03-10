import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'react-bootstrap';
import { NodeSpecification } from '../store/types.ts';
import { getCount } from '../../utils/inputUtil.ts';

function getNodeDelayValue(numberValue: number, branchParticipants: number, total: number) {
    const maximum = (total ?? 0) - branchParticipants;
    if (numberValue > maximum) {
        return maximum;
    }
    if (numberValue < 0) {
        return 0;
    }
    return numberValue;
}

interface Props {
    nodeSpecs: NodeSpecification;
    setNodeSpecs: (nodeSpecs: NodeSpecification) => void;
    branchSize: number;
    segmentId: string;
    total: number;
}

export const EditNodeDialogDelayInput = ({ nodeSpecs, setNodeSpecs, segmentId, total, branchSize }: Props) => {
    const intl = useIntl();

    return (
        <div className={'mx-2'}>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.nodeOffset'} />
                </Form.Label>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
                    value={nodeSpecs.trackOffsets[segmentId] ?? ''}
                    onChange={(value) => {
                        const newValue = getNodeDelayValue(getCount(value) ?? 0, branchSize, total);
                        setNodeSpecs({
                            ...nodeSpecs,
                            trackOffsets: { ...nodeSpecs.trackOffsets, [segmentId]: newValue },
                        });
                    }}
                />
            </Form.Group>
        </div>
    );
};
