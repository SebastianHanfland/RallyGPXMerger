import { Form } from 'react-bootstrap';
import { TrackEntry } from '../store/types.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { getCount } from '../../utils/inputUtil.ts';
import { ChangeEvent } from 'react';

interface Props {
    values: Partial<TrackEntry>;
    setValues: (point: Partial<TrackEntry>) => void;
}

export const EntryPointDialogContent = ({ values, setValues }: Props) => {
    const intl = useIntl();
    return (
        <div>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.street'} />
                </Form.Label>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.street' })}
                    value={values.streetName ?? ''}
                    onChange={(value) => setValues({ ...values, streetName: value.target.value })}
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
                    value={values.extraInfo ?? ''}
                    onChange={(value) => setValues({ ...values, extraInfo: value.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.buffer'} />
                </Form.Label>
                <Form.Control
                    type="number"
                    step={1}
                    title={intl.formatMessage({ id: 'msg.buffer' })}
                    value={values.buffer ?? 0}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setValues({ ...values, buffer: getCount(event) });
                    }}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.rounding'} />
                </Form.Label>
                <Form.Control
                    type="number"
                    step={1}
                    title={intl.formatMessage({ id: 'msg.rounding' })}
                    value={values.rounding ?? 0}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setValues({ ...values, rounding: getCount(event) });
                    }}
                />
            </Form.Group>
        </div>
    );
};
