import { ButtonGroup, ButtonToolbar, Container, Pagination, Row } from 'react-bootstrap';
import { HelpButton } from './tutorial/HelpButton.tsx';
import { RemoveDataButton } from './RemoveDataButton.tsx';
import { LoadExampleDataButton } from './LoadExampleDataButton.tsx';
import { Sections } from './types.ts';

interface Props {
    selectedSection: Sections;
    setSelectedSection: (section: Sections) => void;
}

export const AppHeader = ({ selectedSection, setSelectedSection }: Props) => {
    return (
        <div className="footer-copyright text-center py-3">
            <Container fluid>
                <Row>
                    <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">
                        <Pagination>
                            <Pagination.Item
                                key={'gps'}
                                active={'gps' === selectedSection}
                                onClick={() => setSelectedSection('gps')}
                            >
                                GPS Planner
                            </Pagination.Item>
                            <Pagination.Item
                                key={'streets'}
                                active={'streets' === selectedSection}
                                onClick={() => setSelectedSection('streets')}
                            >
                                Street Resolver
                            </Pagination.Item>
                            <Pagination.Item
                                key={'importExport'}
                                active={'importExport' === selectedSection}
                                onClick={() => setSelectedSection('importExport')}
                            >
                                Import Export
                            </Pagination.Item>
                        </Pagination>
                        <h1>Rally GPX Merger</h1>
                        <ButtonToolbar aria-label="Toolbar with Button groups" className={'m-0'}>
                            <ButtonGroup aria-label="help-buttons" className={'m-0'}>
                                <HelpButton />
                                <LoadExampleDataButton />
                                <RemoveDataButton />
                            </ButtonGroup>
                        </ButtonToolbar>
                    </ButtonToolbar>
                </Row>
            </Container>
        </div>
    );
};
