import { Col, Container, Row } from 'react-bootstrap';
import line from '../../assets/line.svg';
import mergeTracks from '../../assets/mergeTracks.svg';
import { WizardHeader } from './WizardHeader.tsx';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { simpleRallyThunk } from './simpleRallyThunk.ts';
import { AppDispatch } from '../store/store.ts';
import { FormattedMessage } from 'react-intl';
import { WizardCard } from '../layout/WizardCard.tsx';

export const WizardsComplexity = () => {
    const dispatch: AppDispatch = useDispatch();
    const continueAsSimpleRally = () => {
        dispatch(simpleRallyThunk);
        dispatch(layoutActions.setHasSingleTrack(true));
    };
    const continueAsComplexRally = () => {
        dispatch(layoutActions.setHasSingleTrack(false));
        dispatch(layoutActions.selectSection('gps'));
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
        </Container>
    );
};
