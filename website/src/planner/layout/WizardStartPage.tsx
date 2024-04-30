import { Col, Container, Row } from 'react-bootstrap';
import { Sections } from './types.ts';
import stars from '../../assets/stars.svg';
import fileUp from '../../assets/file-up.svg';
import info from '../../assets/info.svg';
import versionSvg from '../../assets/version.svg';
import pencil from '../../assets/pencil.svg';
import magic from '../../assets/magic_b.svg';
import { WizardHeader } from '../wizard/WizardHeader.tsx';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { loadSampleData } from '../io/loadSampleData.ts';
import { DirectlyToPlannerButton } from '../wizard/DirectlyToPlannerButton.tsx';
import { AppFooter } from './Footer.tsx';
import { importHook } from '../io/importHook.ts';
import { FormattedMessage } from 'react-intl';
import { WizardCard } from './WizardCard.tsx';
import { BackToStartDialog } from './BackToStartDialog.tsx';
import { useState } from 'react';

export const WizardStartPage = () => {
    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));
    const { uploadInput, importButtonClicked, changeHandler } = importHook();
    const [showModal, setShowModal] = useState(false);
    const [nextSection, setNextSection] = useState<'gps' | 'wizard-parameters' | undefined>();

    return (
        <Container fluid className={'m-0'}>
            {showModal && (
                <BackToStartDialog
                    closeModal={() => setShowModal(false)}
                    onConfirm={() => nextSection && setSelectedSection(nextSection)}
                />
            )}
            <WizardHeader />
            <Row>
                <Col>
                    <WizardCard
                        icon={stars}
                        onClick={() => {
                            setShowModal(true);
                            setNextSection('gps');
                        }}
                        title={<FormattedMessage id={'msg.startPlan'} />}
                        text={<FormattedMessage id={'msg.startPlan.hint'} />}
                    />
                </Col>
                <Col>
                    <WizardCard
                        icon={pencil}
                        // TODO Only show when planing in progress
                        onClick={() => setSelectedSection('gps')}
                        title={<FormattedMessage id={'msg.continuePlan'} />}
                        text={<FormattedMessage id={'msg.continuePlan.hint'} />}
                    />
                </Col>
                <Col>
                    <WizardCard
                        icon={magic}
                        onClick={() => {
                            setShowModal(true);
                            setNextSection('wizard-parameters');
                        }}
                        title={<FormattedMessage id={'msg.startWizard'} />}
                        text={<FormattedMessage id={'msg.startWizard.hint'} />}
                    />
                </Col>
                <Col>
                    <WizardCard
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
                    <WizardCard
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
                    <WizardCard
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
