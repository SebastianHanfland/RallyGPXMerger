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
import { PointsOverview } from '../points/PointsOverview.tsx';
import { TracksOverview } from '../trackoverview/TracksOverview.tsx';
import { NodePointsOverview } from '../nodes/NodePointsOverview.tsx';

export function MergeAndMap() {
    parseCalculatedTracksHook();
    const selectedSection = useSelector(getSelectionSection);

    if (selectedSection === 'gps') {
        return (
            <Row className="flex-xl-nowrap" style={{ height: '80vh', width: '100%' }}>
                <Col xxl={3} xl={4} lg={12}>
                    <FileUploadSection />
                </Col>
                <Col xl={4} lg={12}>
                    <TrackCompositionSection />
                </Col>
                <Col xxl={5} xl={4} lg={12}>
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

    if (selectedSection === 'tracks') {
        return <TracksOverview />;
    }

    if (selectedSection === 'importExport') {
        return <ImportExport />;
    }

    if (selectedSection === 'settings') {
        return <Settings />;
    }

    if (selectedSection === 'points') {
        return <PointsOverview />;
    }

    if (selectedSection === 'nodePoints') {
        return <NodePointsOverview />;
    }
}
