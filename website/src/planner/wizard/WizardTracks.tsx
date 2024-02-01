import { useDispatch } from 'react-redux';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { WizardHeader } from './WizardHeader.tsx';
import { layoutActions } from '../store/layout.reducer.ts';
import { Sections } from '../layout/types.ts';
import { DirectlyToPlannerButton } from './DirectlyToPlannerButton.tsx';
import { MergeTable } from '../tracks/MergeTable.tsx';
import { calculateMerge } from '../logic/merge/MergeCalculation.ts';
import { AppDispatch } from '../store/store.ts';

export const WizardTracks = () => {
    const dispatch: AppDispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));

    return (
        <Container>
            <WizardHeader />
            <h5>Click the plus button to create a new track</h5>
            <Row>
                <Col>
                    <MergeTable />
                    <DirectlyToPlannerButton />
                    <Button
                        className={'m-4'}
                        onClick={() => {
                            dispatch(calculateMerge);
                            setSelectedSection('gps');
                        }}
                    >
                        Continue
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
