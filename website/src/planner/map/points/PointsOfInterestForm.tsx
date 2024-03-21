import { Form } from 'react-bootstrap';
import { PointOfInterest } from '../../store/types.ts';

interface Props {
    values: Partial<PointOfInterest>;
    setValues: (point: Partial<PointOfInterest>) => void;
}

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
                    placeholder="Description"
                    value={values.description ?? ''}
                    onChange={(value) => setValues({ ...values, description: value.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Radius in m"
                    value={values.radiusInM ?? ''}
                    onChange={(value) => setValues({ ...values, radiusInM: Number(value.target.value) })}
                />
            </Form.Group>
        </div>
    );
}
