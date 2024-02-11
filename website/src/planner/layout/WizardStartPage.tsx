import { Card, Col, Container, Row } from 'react-bootstrap';
import { Sections } from './types.ts';
import stars from '../../assets/stars.svg';
import fileUp from '../../assets/file-up.svg';
import info from '../../assets/info.svg';
import { WizardHeader } from '../wizard/WizardHeader.tsx';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { loadSampleData } from '../io/loadSampleData.ts';
import { DirectlyToPlannerButton } from '../wizard/DirectlyToPlannerButton.tsx';
import { AppFooter } from './Footer.tsx';
import { importHook } from '../io/importHook.ts';
import { FormattedMessage } from 'react-intl';

const cardStyle = {
    style: { minWidth: '18rem', minHeight: '25rem', cursor: 'pointer' },
    className: 'startPageCard shadow m-2',
};

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
                    <Card {...cardStyle} onClick={() => setSelectedSection('wizard-parameters')}>
                        <Card.Body>
                            <Card.Title>
                                <FormattedMessage id={'msg.startPlan'} />
                            </Card.Title>
                            <Card.Text style={{ minHeight: '3rem' }}>
                                <FormattedMessage id={'msg.startPlan.hint'} />
                            </Card.Text>
                            <img
                                src={stars}
                                className="m-1"
                                alt="start new plan"
                                style={{ height: '10rem', width: '10rem' }}
                                color={'#ffffff'}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card {...cardStyle} onClick={importButtonClicked}>
                        <Card.Body>
                            <Card.Title>
                                <FormattedMessage id={'msg.loadPlan'} />
                            </Card.Title>
                            <Card.Text style={{ minHeight: '3rem' }}>
                                <FormattedMessage id={'msg.loadPlan.hint'} />
                            </Card.Text>
                            <img
                                src={fileUp}
                                className="m-1"
                                alt="open existing plan"
                                style={{ height: '10rem', width: '10rem' }}
                                color={'#ffffff'}
                            />
                            <input
                                type="file"
                                name="file"
                                onChange={changeHandler}
                                ref={uploadInput}
                                hidden={true}
                                accept={'application/json'}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card
                        {...cardStyle}
                        onClick={() => {
                            loadSampleData(dispatch);
                            setSelectedSection('gps');
                        }}
                    >
                        <Card.Body>
                            <Card.Title>
                                <FormattedMessage id={'msg.loadSample'} />
                            </Card.Title>
                            <Card.Text style={{ minHeight: '3rem' }}>
                                <FormattedMessage id={'msg.loadSample.hint'} />:
                                <ul>
                                    <li>
                                        <FormattedMessage id={'msg.loadSample.ex1'} />:
                                    </li>
                                    <li>
                                        <FormattedMessage id={'msg.loadSample.ex2'} />:
                                    </li>
                                </ul>
                            </Card.Text>
                            <img
                                src={info}
                                className="m-1"
                                alt="open existing plan"
                                style={{ height: '10rem', width: '10rem' }}
                                color={'#ffffff'}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <DirectlyToPlannerButton />
            <AppFooter />
        </Container>
    );
};
