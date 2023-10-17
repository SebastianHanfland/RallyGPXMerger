import React from 'react';
import { Table, Form } from 'react-bootstrap';

export const DummyTable = () => {
    return (
        <Table striped bordered hover style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th>Track name</th>
                    <th>Track components</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'A1'} />
                    </td>
                    <td>A_11 + A_12 + 30min</td>
                </tr>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'B1'} />
                    </td>
                    <td>B_11 + B_12 + 30min</td>
                </tr>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'B2'} />
                    </td>
                    <td>B_21 + B_12 + 30min</td>
                </tr>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'C1'} />
                    </td>
                    <td>C_11 + B_12 + 30min</td>
                </tr>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="Track name" value={'C2'} />
                    </td>
                    <td>B_11 + B_12 + 30min</td>
                </tr>
            </tbody>
        </Table>
    );
};
