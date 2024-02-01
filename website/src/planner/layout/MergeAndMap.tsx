import { TrackCompositionSection } from '../tracks/TrackCompositionSection.tsx';
import { FileUploadSection } from '../segments/FileUploadSection.tsx';
import { Col, Row } from 'react-bootstrap';
import { StreetResolvingSection } from '../streets/StreetResolvingSection.tsx';
import { parseCalculatedTracksHook } from '../map/hooks/parseCalculatedTracksHook.ts';
import { PlainMap } from '../map/PlainMap.tsx';
import { MapToolbar } from '../map/MapToolbar.tsx';
import { ImportExport } from '../io/ImportExport.tsx';
import { Settings } from '../settings/Settings.tsx';
import { useSelector } from 'react-redux';
import { getSelectionSection } from '../store/layout.reducer.ts';

export function MergeAndMap() {
    parseCalculatedTracksHook();
    const selectedSection = useSelector(getSelectionSection);

    if (selectedSection === 'gps') {
        return (
            <Row className="flex-xl-nowrap" style={{ height: '80vh', width: '100%' }}>
                <Col xl={3}>
                    <FileUploadSection />
                </Col>
                <Col xl={4}>
                    <TrackCompositionSection />
                </Col>
                <Col xl={5}>
                    <div style={{ height: '65vh' }}>
                        <PlainMap />
                    </div>
                    <div style={{ height: '10%' }} className={'mt-1'}>
                        <MapToolbar />
                    </div>
                </Col>
            </Row>
        );
    }

    if (selectedSection === 'streets') {
        return <StreetResolvingSection />;
    }

    if (selectedSection === 'importExport') {
        return <ImportExport />;
    }

    if (selectedSection === 'settings') {
        return <Settings />;
    }
}
