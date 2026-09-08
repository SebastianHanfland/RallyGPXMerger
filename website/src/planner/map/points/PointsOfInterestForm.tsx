import { Form } from 'react-bootstrap';
import { PointOfInterest, PointOfInterestType } from '../../store/types.ts';
import Select from 'react-select';
import { FormattedMessage, useIntl } from 'react-intl';
import { getPointTypeMessageId } from '../../points/pointOfInterestConfig.ts';

interface Props {
    values: Partial<PointOfInterest>;
    setValues: (point: Partial<PointOfInterest>) => void;
}

const typeOptions = Object.values(PointOfInterestType).map((value) => ({ value, label: getPointTypeMessageId(value) }));

export function PointsOfInterestForm({ values, setValues }: Props) {
    const intl = useIntl();
    const description = intl.formatMessage({ id: 'msg.description' });
    const title = intl.formatMessage({ id: 'msg.title' });
    const type = intl.formatMessage({ id: 'msg.type' });
    const radiusInM = intl.formatMessage({ id: 'msg.radius' });
    return (
        <div>
            <Form.Group>
                <Form.Label>{title}</Form.Label>
                <Form.Control
                    type="text"
                    placeholder={title}
                    value={values.title ?? ''}
                    onChange={(value) => setValues({ ...values, title: value.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>{description}</Form.Label>
                <Form.Control
                    type="text"
                    as="textarea"
                    rows={3}
                    placeholder={description}
                    value={values.description ?? ''}
                    onChange={(value) => setValues({ ...values, description: value.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>{radiusInM}</Form.Label>
                <Form.Control
                    type="number"
                    placeholder={radiusInM}
                    value={values.radiusInM ?? ''}
                    onChange={(value) => setValues({ ...values, radiusInM: Number(value.target.value) })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>{type}</Form.Label>
                <Select
                    aria-label="Default select example"
                    options={typeOptions}
                    value={typeOptions.find((option) => option.value === values.type)}
                    formatOptionLabel={(option) => <FormattedMessage id={option.label} />}
                    onChange={(option) => {
                        setValues({ ...values, type: option?.value ?? PointOfInterestType.OTHER });
                        // if (option) {
                        //     option?.openModal ? setShowModal(true) : setSelectedSection(option?.value);
                        // }
                    }}
                    isSearchable={false}
                />
            </Form.Group>
        </div>
    );
}
