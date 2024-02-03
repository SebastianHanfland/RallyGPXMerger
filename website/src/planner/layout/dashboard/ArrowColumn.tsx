import { Col } from 'react-bootstrap';
import arrowDown from '../../../assets/arrow-down.svg';

export function ArrowColumn() {
    return (
        <Col className={'d-flex justify-content-center'}>
            <img src={arrowDown} className="m-1" alt="leads to" />
        </Col>
    );
}
