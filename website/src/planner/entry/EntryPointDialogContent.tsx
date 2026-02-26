import { Form } from 'react-bootstrap';
import { TrackEntry } from '../store/types.ts';
import wc from '../../assets/wc.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { getCount } from '../../utils/inputUtil.ts';
import { ChangeEvent } from 'react';

interface Props {
    values: Partial<TrackEntry>;
    setValues: (point: Partial<TrackEntry>) => void;
}

export const EntryPointDialogContent = ({ values, setValues }: Props) => {
    const intl = useIntl();
    const addSegmentToTrack = (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, minutes: getCount(event) });
    };
    return (
        <div>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.minutes'} />
                </Form.Label>
                <Form.Control
                    type="number"
                    step={1}
                    title={intl.formatMessage({ id: 'msg.minutes.details' })}
                    value={values.minutes ?? 0}
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
                <Form.Label>{<FormattedMessage id={'msg.toilets'} />}</Form.Label>
                <Form.Check
                    type={'checkbox'}
                    label={
                        <span>
                            <span>
                                <img className={'mx-1'} src={wc} alt={'wc'} />
                            </span>
                            <FormattedMessage id={'msg.toiletAtPause'} />
                        </span>
                    }
                    placeholder={intl.formatMessage({ id: 'msg.toiletAtPause' })}
                    checked={values.hasToilet ?? false}
                    onChange={() => setValues({ ...values, hasToilet: !values.hasToilet })}
                ></Form.Check>
            </Form.Group>
        </div>
    );
};
