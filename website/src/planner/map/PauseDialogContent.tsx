import { Form } from 'react-bootstrap';
import { TrackPause } from '../store/types.ts';
import wc from '../../assets/wc.svg';
import Select, { SingleValue } from 'react-select';
import { useIntl } from 'react-intl';

interface Props {
    values: Partial<TrackPause>;
    setValues: (point: Partial<TrackPause>) => void;
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

export const PauseDialogContent = ({ values, setValues }: Props) => {
    const intl = useIntl();
    const addSegmentToTrack = (newValue: SingleValue<{ value: number }>) => {
        setValues({ ...values, minutes: newValue?.value });
    };
    return (
        <div>
            <Form.Group>
                <Form.Label>Minutes</Form.Label>
                <Select
                    name="segmentSelect"
                    value={breaks.find((option) => option.value === values.minutes)}
                    placeholder={intl.formatMessage({ id: 'msg.selectTrackSegment' })}
                    options={breaks}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={addSegmentToTrack}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    as="textarea"
                    rows={3}
                    placeholder="Description"
                    value={values.description ?? ''}
                    onChange={(value) => setValues({ ...values, description: value.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Radius in m</Form.Label>
                <Form.Check
                    type={'checkbox'}
                    label={
                        <span>
                            Has a toilet
                            <img className={'mx-1'} src={wc} alt={'wc'} />
                        </span>
                    }
                    placeholder="Radius in m"
                    checked={values.hasToilet}
                    onClick={() => setValues({ ...values, hasToilet: !values.hasToilet })}
                ></Form.Check>
            </Form.Group>
        </div>
    );
};
