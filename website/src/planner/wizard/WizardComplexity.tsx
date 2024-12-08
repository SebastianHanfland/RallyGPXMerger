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
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { useNavigate } from 'react-router';
import { resetData } from '../io/resetData.ts';

export const WizardsComplexity = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigateTo = useNavigate();
    const continueAsSimpleRally = () => {
        resetData(dispatch);
        dispatch(simpleRallyThunk);
        dispatch(layoutActions.setHasSingleTrack(true));
        navigateTo('?section=gps', { replace: true });
    };
    const continueAsComplexRally = () => {
        resetData(dispatch);
        dispatch(trackMergeActions.setDefaultArrivalDateTime());
        dispatch(trackMergeActions.setIsCalculationOnTheFly(false));
        dispatch(layoutActions.setIsSidebarOpen(true));
        dispatch(layoutActions.setHasSingleTrack(false));
        dispatch(layoutActions.setSelectedSidebarSection('segments'));
        navigateTo('?section=gps', { replace: true });
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
            <h5 className={'mt-5'}>
                <FormattedMessage id={'msg.helpButton.hint'} />
            </h5>
        </Container>
    );
};
