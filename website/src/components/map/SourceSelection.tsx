import { Form } from 'react-bootstrap';

export function SourceSelection() {
    return (
        <Form.Group>
            <h5>Source selection</h5>
            <Form>
                <Form.Check type={'radio'} className={'m-3'} label={'GPX Segments'}></Form.Check>
                <Form.Check type={'radio'} className={'m-3'} label={'Calculated Tracks'}></Form.Check>
            </Form>
        </Form.Group>
    );
}
