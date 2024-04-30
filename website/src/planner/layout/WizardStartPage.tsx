import { Col, Container, Row } from 'react-bootstrap';
import { Sections } from './types.ts';
import stars from '../../assets/stars.svg';
import fileUp from '../../assets/file-up.svg';
import info from '../../assets/info.svg';
import versionSvg from '../../assets/version.svg';
import { WizardHeader } from '../wizard/WizardHeader.tsx';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { loadSampleData } from '../io/loadSampleData.ts';
import { DirectlyToPlannerButton } from '../wizard/DirectlyToPlannerButton.tsx';
import { AppFooter } from './Footer.tsx';
import { importHook } from '../io/importHook.ts';
import { FormattedMessage } from 'react-intl';
import { WizardStartPageCard } from './WizardStartPageCard.tsx';

export const WizardStartPage = () => {
    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));
    const { uploadInput, importButtonClicked, changeHandler } = importHook();

    return (
        <Container>
            <WizardHeader />
            <h5 className={'mb-5'}>
                <FormattedMessage id={'msg.choose'} />:
            </h5>
            <Row>
                <Col>
                    <WizardStartPageCard
                        icon={stars}
                        onClick={() => setSelectedSection('wizard-parameters')}
                        title={<FormattedMessage id={'msg.startPlan'} />}
                        text={<FormattedMessage id={'msg.startPlan.hint'} />}
                    />
                </Col>
                <Col>
                    <WizardStartPageCard
                        icon={fileUp}
                        onClick={importButtonClicked}
                        title={<FormattedMessage id={'msg.loadPlan'} />}
                        text={<FormattedMessage id={'msg.loadPlan.hint'} />}
                    />
                    <input
                        type="file"
                        name="file"
                        onChange={changeHandler}
                        ref={uploadInput}
                        hidden={true}
                        accept={'application/json'}
                    />
                </Col>
                <Col>
                    <WizardStartPageCard
                        icon={info}
                        onClick={() => {
                            loadSampleData(dispatch);
                            dispatch(layoutActions.setShowDashboard(true));
                            setSelectedSection('gps');
                        }}
                        title={<FormattedMessage id={'msg.loadSample'} />}
                        text={<FormattedMessage id={'msg.loadSample.hint'} />}
                    />
                </Col>
                <Col>
                    <WizardStartPageCard
                        icon={versionSvg}
                        onClick={() => setSelectedSection('wizard-versions')}
                        title={<FormattedMessage id={'msg.versions'} />}
                        text={<FormattedMessage id={'msg.versions.hint'} />}
                    />
                </Col>
            </Row>
            <DirectlyToPlannerButton />
            <AppFooter />
        </Container>
    );
};
