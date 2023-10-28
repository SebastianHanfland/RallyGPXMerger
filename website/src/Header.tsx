import { Button, ButtonGroup, ButtonToolbar, Container, Row } from 'react-bootstrap';
import { HelpButton } from './components/tutorial/HelpButton.tsx';
import { MergeTracksButton } from './components/MergeTracksButton.tsx';
import { CalculatedFilesDownloader } from './components/CalculatedFilesDownloader.tsx';
import { RemoveDataButton } from './components/RemoveDataButton.tsx';
import fileUpload from './assets/file-up.svg';

export const AppHeader = () => {
    return (
        <div className="footer-copyright text-center py-3">
            <Container fluid>
                <Row>
                    <h1>Rally GPX Merger</h1>
                </Row>

                <Row>
                    <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">
                        <ButtonToolbar aria-label="Toolbar with Button groups">
                            <ButtonGroup aria-label="help-buttons">
                                <MergeTracksButton />
                                <CalculatedFilesDownloader />
                            </ButtonGroup>
                        </ButtonToolbar>
                        <ButtonToolbar aria-label="Toolbar with Button groups">
                            <ButtonGroup aria-label="help-buttons">
                                <HelpButton />

                                <Button>
                                    <img src={fileUpload} className="m-1" alt="open file" />
                                    Load sample data
                                </Button>
                                <RemoveDataButton />
                            </ButtonGroup>
                        </ButtonToolbar>
                    </ButtonToolbar>
                </Row>
            </Container>
        </div>
    );
};
