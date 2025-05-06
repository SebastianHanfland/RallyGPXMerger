import { Col, Container, Row } from 'react-bootstrap';
import { Sections } from './types.ts';
import stars from '../../assets/stars.svg';
import fileUp from '../../assets/file-up.svg';
import pencil from '../../assets/pencil.svg';
import { WizardHeader } from '../wizard/WizardHeader.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { importHook } from '../io/importHook.ts';
import { FormattedMessage } from 'react-intl';
import { WizardCard } from './WizardCard.tsx';
import { DataLossDialog } from './DataLossDialog.tsx';
import { useState } from 'react';
import { isPlanningInProgress } from '../store/planner.selector.ts';
import { LanguageSelection } from './LanguageSelection.tsx';
import { useNavigate } from 'react-router';
import { getPlanningId } from '../store/backend.reducer.ts';

export const WizardStartPage = () => {
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const planningId = useSelector(getPlanningId);

    const planningInProgress = useSelector(isPlanningInProgress);
    const setSelectedSection = (section: Sections) => {
        dispatch(layoutActions.selectSection(section));
        navigateTo(
            `?section=${section}${planningId && section !== 'wizard-complexity' ? `&planning=${planningId}` : ''}`
        );
    };
    const { uploadInput, importButtonClicked, changeHandler } = importHook();
    const [showModal, setShowModal] = useState(false);
    const [showImportWarningModal, setShowImportWarningModal] = useState(false);
    const [nextSection, setNextSection] = useState<'gps' | 'wizard-complexity' | undefined>();

    return (
        <Container fluid className={'m-0'}>
            {showModal && (
                <DataLossDialog
                    closeModal={() => setShowModal(false)}
                    onConfirm={() => {
                        nextSection && setSelectedSection(nextSection);
                    }}
                    importWarning={false}
                />
            )}
            {showImportWarningModal && (
                <DataLossDialog
                    closeModal={() => setShowImportWarningModal(false)}
                    onConfirm={importButtonClicked}
                    importWarning={true}
                />
            )}
            <WizardHeader />
            <Row className={'mb-5'}>
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
                <Col>
                    <WizardCard
                        icon={fileUp}
                        onClick={() => {
                            if (planningInProgress) {
                                setShowImportWarningModal(true);
                            } else {
                                importButtonClicked();
                            }
                        }}
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
            </Row>
            <LanguageSelection />
        </Container>
    );
};
