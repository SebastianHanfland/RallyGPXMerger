import React from 'react';
import { Table } from 'react-bootstrap';

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
                    <td>A1</td>
                    <td>A_11 + A_12 + 30min</td>
                </tr>
                <tr>
                    <td>B1</td>
                    <td>B_11 + B_12 + 30min</td>
                </tr>
            </tbody>
        </Table>
    );
};
