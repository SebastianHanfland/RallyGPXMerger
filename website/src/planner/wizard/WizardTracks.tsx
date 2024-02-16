import { useDispatch } from 'react-redux';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { WizardHeader } from './WizardHeader.tsx';
import { layoutActions } from '../store/layout.reducer.ts';
import { DirectlyToPlannerButton } from './DirectlyToPlannerButton.tsx';
import { MergeTable } from '../tracks/MergeTable.tsx';
import { calculateMerge } from '../logic/merge/MergeCalculation.ts';
import { AppDispatch } from '../store/store.ts';
import { FormattedMessage } from 'react-intl';

export const WizardTracks = () => {
    const dispatch: AppDispatch = useDispatch();

    return (
        <Container>
            <WizardHeader />
            <h5>
                <FormattedMessage id={'msg.complex.title'} />
            </h5>
            <Row>
                <Col>
                    <MergeTable />
                    <DirectlyToPlannerButton />
                    <Button
                        className={'m-4'}
                        onClick={() => {
                            dispatch(calculateMerge);
                            dispatch(layoutActions.setShowDashboard(true));
                            dispatch(layoutActions.selectSection('gps'));
                        }}
                    >
                        <FormattedMessage id={'msg.continue'} />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
