import { Table, Form } from 'react-bootstrap';

export const DummyTable = () => {
    return (
        <Table striped bordered hover style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ width: '25%' }}>Track name</th>
                    <th style={{ width: '75%' }}>Track components</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'A1'} />
                    </td>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'A_11 + A_12 + 30min'} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'B1'} />
                    </td>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'B_11 + B_12 + 30min'} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'B2'} />
                    </td>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'B_21 + B_12 + 30min'} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'C1'} />
                    </td>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'C_11 + B_12 + 30min'} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'C2'} />
                    </td>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'B_11 + B_12 + 30min'} />
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>+</td>
                </tr>
            </tbody>
        </Table>
    );
};
