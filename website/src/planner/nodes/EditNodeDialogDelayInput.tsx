import { FormattedMessage } from 'react-intl';
import { Form } from 'react-bootstrap';
import { NodeSpecification } from '../store/types.ts';
import { getCount } from '../../utils/inputUtil.ts';
import { getNodeOffset } from '../../common/calculation/calculated-tracks/nodeSpecOffset.ts';

interface Props {
    nodeSpecs: NodeSpecification;
    setNodeSpecs: (nodeSpecs: NodeSpecification) => void;
    branchSize: number;
    segmentId: string;
    total: number;
    peopleOffset: number;
    percentage: number;
}

export const EditNodeDialogDelayInput = ({
    nodeSpecs,
    setNodeSpecs,
    segmentId,
    branchSize,
    total,
    peopleOffset,
    percentage,
}: Props) => {
    return (
        <div className={'mx-2'}>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.nodeOffsetPercentage'} />
                </Form.Label>
                <Form.Control
                    type={'number'}
                    min={0}
                    max={100}
                    step={0.1}
                    placeholder={'%'}
                    value={percentage}
                    onChange={(value) => {
                        const newValue = Math.max(0, Math.min(100, getCount(value) ?? 0));
                        setNodeSpecs({
                            ...nodeSpecs,
                            trackOffsetPercentages: {
                                ...(nodeSpecs.trackOffsetPercentages ?? {}),
                                [segmentId]: newValue,
                            },
                            trackOffsets: {
                                ...nodeSpecs.trackOffsets,
                                [segmentId]: getNodeOffset(
                                    { ...nodeSpecs, trackOffsetPercentages: { [segmentId]: newValue } },
                                    segmentId,
                                    branchSize,
                                    total
                                ),
                            },
                        });
                    }}
                />
                <Form.Text>
                    <FormattedMessage id={'msg.nodeOffsetCalculated'} values={{ people: peopleOffset }} />
                </Form.Text>
            </Form.Group>
        </div>
    );
};
