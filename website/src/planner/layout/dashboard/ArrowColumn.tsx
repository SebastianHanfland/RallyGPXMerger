import { Col, Row } from 'react-bootstrap';
import arrowDown from '../../../assets/arrow-down.svg';

export function ArrowColumn() {
    return (
        <Row>
            <Col className={'d-flex justify-content-center'}>
                <img src={arrowDown} className="m-1" alt="leads to" />
            </Col>
        </Row>
    );
}
