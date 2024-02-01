import { ArrivalDateTimePicker } from '../parameters/ArrivalDateTimePicker.tsx';
import { useSelector } from 'react-redux';
import { getArrivalDateTime } from '../store/trackMerge.reducer.ts';
import { ParticipantsDelaySetter } from '../parameters/ParticipantsDelaySetter.tsx';
import { AverageSpeedSetter } from '../parameters/AverageSpeedSetter.tsx';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { WizardHeader } from './WizardHeader.tsx';

export const WizardParameters = () => {
    const arrivalDateTime = useSelector(getArrivalDateTime);
    return (
        <Container>
            <WizardHeader />
            <Row>
                <Col>
                    <ArrivalDateTimePicker />
                    {arrivalDateTime && (
                        <>
                            <hr />
                            <h5 className={'mt-5'}>Optional paramters</h5>
                            <ParticipantsDelaySetter />
                            <hr />
                            <AverageSpeedSetter />
                            <hr />
                            <p>These parameters can still be changed afterwards</p>
                            <Button>Continue</Button>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};
