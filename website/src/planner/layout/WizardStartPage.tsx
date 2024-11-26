import { Col, Container, Row } from 'react-bootstrap';
import { Sections } from './types.ts';
import stars from '../../assets/stars.svg';
import fileUp from '../../assets/file-up.svg';
import versionSvg from '../../assets/version.svg';
import pencil from '../../assets/pencil.svg';
import { WizardHeader } from '../wizard/WizardHeader.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { importHook } from '../io/importHook.ts';
import { FormattedMessage } from 'react-intl';
import { WizardCard } from './WizardCard.tsx';
import { BackToStartDialog } from './BackToStartDialog.tsx';
import { useState } from 'react';
import { isPlanningInProgress } from '../store/planner.selector.ts';
import { getBaseUrl } from '../../utils/linkUtil.ts';
import { LanguageSelection } from './LanguageSelection.tsx';

export const WizardStartPage = () => {
    const dispatch = useDispatch();
    const planningInProgress = useSelector(isPlanningInProgress);
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));
    const { uploadInput, importButtonClicked, changeHandler } = importHook();
    const [showModal, setShowModal] = useState(false);
    const [nextSection, setNextSection] = useState<'gps' | 'wizard-complexity' | undefined>();

    return (
        <Container fluid className={'m-0'}>
            {showModal && (
                <BackToStartDialog
                    closeModal={() => setShowModal(false)}
                    onConfirm={() => {
                        nextSection && setSelectedSection(nextSection);
                        history.replaceState(null, '', `${getBaseUrl()}`);
                    }}
                />
            )}
            <WizardHeader />
            <Row>
                <Col>
                    <WizardCard
                        icon={stars}
                        onClick={() => {
                            if (planningInProgress) {
                                setShowModal(true);
                                setNextSection('wizard-complexity');
                            } else {
                                setSelectedSection('wizard-complexity');
                            }
                        }}
                        title={<FormattedMessage id={'msg.startPlan'} />}
                        text={<FormattedMessage id={'msg.startPlan.hint'} />}
                    />
                </Col>
                {planningInProgress && (
                    <Col>
                        <WizardCard
                            icon={pencil}
                            onClick={() => setSelectedSection('gps')}
                            title={<FormattedMessage id={'msg.continuePlan'} />}
                            text={<FormattedMessage id={'msg.continuePlan.hint'} />}
                        />
                    </Col>
                )}
                {/*<Col>*/}
                {/*    <WizardCard*/}
                {/*        icon={magic}*/}
                {/*        onClick={() => {*/}
                {/*            setShowModal(true);*/}
                {/*            setNextSection('wizard-parameters');*/}
                {/*        }}*/}
                {/*        title={<FormattedMessage id={'msg.startWizard'} />}*/}
                {/*        text={<FormattedMessage id={'msg.startWizard.hint'} />}*/}
                {/*    />*/}
                {/*</Col>*/}
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
                        icon={versionSvg}
                        onClick={() => setSelectedSection('wizard-versions')}
                        title={<FormattedMessage id={'msg.versions'} />}
                        text={<FormattedMessage id={'msg.versions.hint'} />}
                    />
                </Col>
            </Row>
            <LanguageSelection />
        </Container>
    );
};
