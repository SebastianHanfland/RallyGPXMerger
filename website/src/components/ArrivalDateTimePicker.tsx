import { Button, Form } from 'react-bootstrap';

export function ArrivalDateTimePicker() {
    return (
        <Button variant={'light'}>
            <Form.Control
                type="datetime"
                placeholder="Arrival Time and Date"
                style={{ width: '300px' }}
                value={'19.05.2024 14:00'}
            />
        </Button>
    );
}
