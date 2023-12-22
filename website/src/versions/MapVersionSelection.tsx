import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getShowMapMarker, mapActions } from '../store/map.reducer.ts';
import { getSelectedVersions, getZipTracks, zipTracksActions } from '../store/zipTracks.reducer.ts';
import Select from 'react-select';

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
                        <div className={'mx-3'} style={{ width: `${100 / (Object.keys(zipTracks).length + 1)}vw` }}>
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
                            <Select
                                name="colors"
                                // value={null}
                                placeholder={`Nur einzelne Routen der ${versionName} anzeigen`}
                                options={zipTracks[versionName]?.map((track) => ({
                                    value: track.id,
                                    label: track.filename,
                                }))}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                // onChange={() => {}}
                            />
                        </div>
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
