import { Form } from 'react-bootstrap';
import { PointOfInterest, PointOfInterestType } from '../../store/types.ts';
import Select from 'react-select';

interface Props {
    values: Partial<PointOfInterest>;
    setValues: (point: Partial<PointOfInterest>) => void;
}

const typeOptions = Object.values(PointOfInterestType).map((value) => ({ value, label: value }));

export function PointsOfInterestForm({ values, setValues }: Props) {
    return (
        <div>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Title"
                    value={values.title ?? ''}
                    onChange={(value) => setValues({ ...values, title: value.target.value })}
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
                <Form.Control
                    type="number"
                    placeholder="Radius in m"
                    value={values.radiusInM ?? ''}
                    onChange={(value) => setValues({ ...values, radiusInM: Number(value.target.value) })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Type</Form.Label>
                <Select
                    aria-label="Default select example"
                    options={typeOptions}
                    value={typeOptions.find((option) => option.value === values.type)}
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
