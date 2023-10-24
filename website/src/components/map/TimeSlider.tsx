import { useState } from 'react';
import { Form } from 'react-bootstrap';

export function TimeSlider() {
    const [range, setRange] = useState<number>(0);
    console.log(range);
    return (
        <Form.Group className={'m-2'}>
            <h5>Time slider</h5>
            <div>{range}</div>
            <Form.Control
                type={'range'}
                min={0}
                max={10000}
                value={range}
                onChange={(event) => setRange(Number(event.target.value))}
            ></Form.Control>
        </Form.Group>
    );
}
