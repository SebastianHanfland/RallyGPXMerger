import { Button, Col, Row } from 'react-bootstrap';
import { FileUploadSection } from './components/FileUploadSection.tsx';

interface Props {
    setHideMap: () => void;
}

export function TrackMapPage(props: Props) {
    return (
        <Row className="flex-xl-nowrap" style={{ height: '85vh', overflow: 'auto', width: '100%' }}>
            <Col xl={9}>
                <FileUploadSection />
            </Col>
            <Col xl={3}>
                <Button className={'m-2'} onClick={props.setHideMap}>
                    Hide Map
                </Button>
            </Col>
        </Row>
    );
}
