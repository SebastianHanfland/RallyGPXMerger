import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getShowMapMarker, mapActions } from '../store/map.reducer.ts';
import { getSelectedTracks, getSelectedVersions, getZipTracks, zipTracksActions } from '../store/zipTracks.reducer.ts';
import Select from 'react-select';
import { ZipTimeSlider } from './ZipTimeSlider.tsx';

export function MapVersionSelection() {
    const showMapMarker = useSelector(getShowMapMarker);
    const zipTracks = useSelector(getZipTracks);
    const selectedVersions = useSelector(getSelectedVersions);
    const selectedTracks = useSelector(getSelectedTracks);
    const dispatch = useDispatch();

    const optionsMap: Record<string, { value: string; label: string }[] | undefined> = {};
    Object.entries(zipTracks).forEach(([version, tracks]) => {
        if (!tracks) {
            return;
        }
        const trackCopy = [...tracks];
        optionsMap[version] = trackCopy
            ?.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }))
            .map((track) => ({
                value: track.id,
                label: track.filename,
            }));
    });

    return (
        <Form.Group>
            <Form className={'d-flex'}>
                {Object.keys(zipTracks)
                    .sort()
                    .map((versionName) => (
                        <div
                            key={versionName}
                            className={'mx-3'}
                            style={{ width: `${100 / (Object.keys(zipTracks).length + 2)}vw` }}
                        >
                            <Form.Check
                                type={'checkbox'}
                                id={versionName}
                                className={'m-3'}
                                label={versionName}
                                title={versionName}
                                checked={selectedVersions.includes(versionName)}
                                readOnly
                                onClick={() => dispatch(zipTracksActions.selectVersion(versionName))}
                            ></Form.Check>
                            <Select
                                name="colors"
                                value={optionsMap[versionName]?.find((opt) =>
                                    selectedTracks[versionName]?.includes(opt.value)
                                )}
                                placeholder={`Nur einzelne Routen der ${versionName} anzeigen`}
                                // @ts-ignore
                                options={optionsMap[versionName] ?? []}
                                className="basic-multi-select"
                                isClearable={true}
                                classNamePrefix="select"
                                // @ts-ignore
                                onChange={(newValue: { value: string }) => {
                                    console.log(newValue);
                                    dispatch(
                                        zipTracksActions.setDisplayTracks({
                                            version: versionName,
                                            selectedTracks: newValue ? [newValue.value] : [],
                                        })
                                    );
                                }}
                            />
                        </div>
                    ))}
                <div className={'mx-3'} style={{ width: `${100 / (Object.keys(zipTracks).length + 2)}vw` }}>
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
                    <ZipTimeSlider />
                </div>
            </Form>
        </Form.Group>
    );
}
