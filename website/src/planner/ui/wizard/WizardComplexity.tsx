import { Col, Container, Row } from 'react-bootstrap';
import line from '../../../assets/line.svg';
import mergeTracks from '../../../assets/mergeTracks.svg';
import { WizardHeader } from './WizardHeader';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../../store/layout.reducer';
import { simpleRallyThunk } from './simpleRallyThunk';
import { AppDispatch } from '../../store/planningStore';
import { FormattedMessage } from 'react-intl';
import { WizardCard } from './WizardCard';
import { useNavigate } from 'react-router';
import { resetData } from '../../import/resetData';
import { settingsActions } from '../../store/settings.reducer';

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
        dispatch(settingsActions.setDefaultArrivalDateTime());
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
                <a
                    href="https://github.com/SebastianHanfland/RallyGPXMerger?tab=readme-ov-file#rallygpxmerger"
                    className="nav-link px-2 text-muted"
                    target={'_blank'}
                    referrerPolicy={'no-referrer'}
                >
                    https://github.com/SebastianHanfland/RallyGPXMerger
                </a>
            </h5>
        </Container>
    );
};
