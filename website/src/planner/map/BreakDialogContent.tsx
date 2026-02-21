import { Form } from 'react-bootstrap';
import { TrackBreak } from '../store/types.ts';
import wc from '../../assets/wc.svg';
import Select, { SingleValue } from 'react-select';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
    values: Partial<TrackBreak>;
    setValues: (point: Partial<TrackBreak>) => void;
}

const breaks = [
    { value: 1, label: '+ 1 min' },
    { value: 2, label: '+ 2 min' },
    { value: 5, label: '+ 5 min' },
    { value: 10, label: '+ 10 min' },
    { value: 15, label: '+ 15 min' },
    { value: 20, label: '+ 20 min' },
    { value: 25, label: '+ 25 min' },
    { value: 30, label: '+ 30 min' },
    { value: -1, label: '- 1 min' },
    { value: -2, label: '- 2 min' },
    { value: -3, label: '- 3 min' },
    { value: -4, label: '- 4 min' },
    { value: -5, label: '- 5 min' },
    { value: -10, label: '- 10 min' },
];

export const BreakDialogContent = ({ values, setValues }: Props) => {
    const intl = useIntl();
    const addSegmentToTrack = (newValue: SingleValue<{ value: number }>) => {
        setValues({ ...values, minutes: newValue?.value });
    };
    return (
        <div>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.minutes'} />
                </Form.Label>
                <Select
                    name="segmentSelect"
                    value={breaks.find((option) => option.value === values.minutes)}
                    placeholder={intl.formatMessage({ id: 'msg.minutes.details' })}
                    options={breaks}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={addSegmentToTrack}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.description'} />
                </Form.Label>
                <Form.Control
                    type="text"
                    as="textarea"
                    rows={3}
                    placeholder={intl.formatMessage({ id: 'msg.description' })}
                    value={values.description ?? ''}
                    onChange={(value) => setValues({ ...values, description: value.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.toiletAtPause'} />
                </Form.Label>
                <Form.Check
                    type={'checkbox'}
                    label={
                        <span>
                            <img className={'mx-1'} src={wc} alt={'wc'} />
                        </span>
                    }
                    placeholder={intl.formatMessage({ id: 'msg.toiletAtPause' })}
                    checked={values.hasToilet}
                    onClick={() => setValues({ ...values, hasToilet: !values.hasToilet })}
                ></Form.Check>
            </Form.Group>
        </div>
    );
};
