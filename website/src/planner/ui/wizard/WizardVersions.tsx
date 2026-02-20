import { useDispatch } from 'react-redux';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { WizardHeader } from './WizardHeader.tsx';
import { layoutActions } from '../../store/layout.reducer.ts';
import { Sections } from '../../layout/types.ts';
import { AppDispatch } from '../../store/planningStore.ts';
import { FormattedMessage } from 'react-intl';

export const WizardVersions = () => {
    const dispatch: AppDispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));

    return (
        <Container>
            <WizardHeader />
            <h3>
                <FormattedMessage id={'msg.versions'} />
            </h3>
            <Button onClick={() => setSelectedSection('menu')}>
                <FormattedMessage id={'msg.back'} />
            </Button>
            <Row>
                <Col style={{ overflow: 'auto' }}>
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    <FormattedMessage id={'msg.versionName'} />
                                </th>
                                <th>
                                    <FormattedMessage id={'msg.variants'} />
                                </th>
                            </tr>
                        </thead>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};
