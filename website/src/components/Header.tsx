import { ButtonGroup, ButtonToolbar, Container, Pagination, Row } from 'react-bootstrap';
import { HelpButton } from './tutorial/HelpButton.tsx';
import { RemoveDataButton } from './RemoveDataButton.tsx';
import { LoadExampleDataButton } from './LoadExampleDataButton.tsx';
import { useState } from 'react';

export const AppHeader = () => {
    const [selectedTrackId, setSelectedTrackId] = useState('gps');
    return (
        <div className="footer-copyright text-center py-3">
            <Container fluid>
                <Row>
                    <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">
                        <Pagination>
                            <Pagination.Item
                                key={'gps'}
                                active={'gps' === selectedTrackId}
                                onClick={() => setSelectedTrackId('gps')}
                            >
                                GPS Planner
                            </Pagination.Item>
                            <Pagination.Item
                                key={'streets'}
                                active={'streets' === selectedTrackId}
                                onClick={() => setSelectedTrackId('streets')}
                            >
                                Street Resolver
                            </Pagination.Item>
                        </Pagination>
                        <h1>Rally GPX Merger</h1>
                        <ButtonToolbar aria-label="Toolbar with Button groups">
                            <ButtonGroup aria-label="help-buttons">
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
