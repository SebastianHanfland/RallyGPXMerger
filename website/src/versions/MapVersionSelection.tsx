import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getShowMapMarker, mapActions } from '../store/map.reducer.ts';
import { getSelectedVersions, getZipTracks, zipTracksActions } from '../store/zipTracks.reducer.ts';

export function MapVersionSelection() {
    const showMapMarker = useSelector(getShowMapMarker);
    const zipTracks = useSelector(getZipTracks);
    const selectedVersions = useSelector(getSelectedVersions);
    const dispatch = useDispatch();
    return (
        <Form.Group>
            <Form className={'d-flex'}>
                {Object.keys(zipTracks)
                    .sort()
                    .map((versionName) => (
                        <Form.Check
                            type={'checkbox'}
                            id={versionName}
                            key={versionName}
                            className={'m-3'}
                            label={versionName}
                            title={versionName}
                            checked={selectedVersions.includes(versionName)}
                            readOnly
                            onClick={() => dispatch(zipTracksActions.selectVersion(versionName))}
                        ></Form.Check>
                    ))}
                <Form.Check
                    type={'checkbox'}
                    id={'marker'}
                    className={'m-3'}
                    label={'Marker'}
                    title={showMapMarker ? 'Marker verstecken' : 'Marker anzeigen'}
                    checked={showMapMarker}
                    readOnly
                    onClick={() => dispatch(mapActions.setShowMapMarker(!showMapMarker))}
                ></Form.Check>
            </Form>
        </Form.Group>
    );
}
