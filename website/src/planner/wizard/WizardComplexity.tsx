import { Col, Container, Row } from 'react-bootstrap';
import line from '../../assets/line.svg';
import mergeTracks from '../../assets/mergeTracks.svg';
import { WizardHeader } from './WizardHeader.tsx';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { Sections } from '../layout/types.ts';
import { DirectlyToPlannerButton } from './DirectlyToPlannerButton.tsx';
import { simpleRallyThunk } from './simpleRallyThunk.ts';
import { AppDispatch } from '../store/store.ts';
import { FormattedMessage } from 'react-intl';
import { WizardCard } from '../layout/WizardCard.tsx';

export const WizardsComplexity = () => {
    const dispatch: AppDispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));
    const continueAsSimpleRally = () => {
        dispatch(simpleRallyThunk);
    };
    const continueAsComplexRally = () => {
        setSelectedSection('wizard-tracks');
    };

    return (
        <Container>
            <WizardHeader />
            <h5 className={'mb-5'}>
                <FormattedMessage id={'msg.choose'} />:
            </h5>
            <Row>
                <Col>
                    <WizardCard
                        onClick={continueAsSimpleRally}
                        title={<FormattedMessage id={'msg.simple'} />}
                        text={<FormattedMessage id={'msg.simple.hint'} />}
                        icon={line}
                    />
                </Col>
                <Col>
                    <WizardCard
                        onClick={continueAsComplexRally}
                        title={<FormattedMessage id={'msg.complex'} />}
                        text={<FormattedMessage id={'msg.complex.hint'} />}
                        icon={mergeTracks}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <DirectlyToPlannerButton />
                </Col>
            </Row>
        </Container>
    );
};
