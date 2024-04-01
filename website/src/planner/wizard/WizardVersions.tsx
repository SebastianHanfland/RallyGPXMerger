import { useDispatch } from 'react-redux';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { WizardHeader } from './WizardHeader.tsx';
import { layoutActions } from '../store/layout.reducer.ts';
import { Sections } from '../layout/types.ts';
import { AppDispatch } from '../store/store.ts';
import { FormattedMessage } from 'react-intl';
import { versions } from '../../versions/versionLinks.ts';

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
                        {Object.entries(versions).map(([version, variants]) => (
                            <tbody>
                                <tr>
                                    <td>
                                        <a href={`${window.location.pathname}?version=${version}`} target={'_blank'}>
                                            {version}
                                        </a>
                                    </td>
                                    <td>
                                        {variants.length} ({variants.map((variant) => variant.name).join(', ')})
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};
