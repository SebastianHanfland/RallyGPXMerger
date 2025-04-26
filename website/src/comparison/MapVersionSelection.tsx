import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getShowMapMarker, mapActions } from '../versions/store/map.reducer.ts';
import {
    getSelectedTracks,
    getSelectedVersions,
    getTrackInfo,
    getZipTracks,
    zipTracksActions,
} from '../versions/store/zipTracks.reducer.ts';
import Select from 'react-select';
import { ZipTimeSlider } from './ZipTimeSlider.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { getBaseUrl } from '../utils/linkUtil.ts';

export function MapVersionSelection() {
    const showMapMarker = useSelector(getShowMapMarker);
    const zipTracks = useSelector(getZipTracks);
    const selectedVersions = useSelector(getSelectedVersions);
    const selectedTracks = useSelector(getSelectedTracks);
    const trackInfo = useSelector(getTrackInfo);
    const dispatch = useDispatch();
    const intl = useIntl();

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
                    .map((versionId) => {
                        const versionName = trackInfo[versionId] ?? versionId;
                        return (
                            <div
                                key={versionId}
                                className={'mx-3'}
                                style={{ width: `${100 / (Object.keys(zipTracks).length + 2)}vw` }}
                            >
                                <Form.Check
                                    type={'checkbox'}
                                    id={versionId}
                                    className={'m-3'}
                                    label={<span>{versionName}</span>}
                                    title={versionName}
                                    checked={selectedVersions.includes(versionId)}
                                    readOnly
                                    onClick={() => dispatch(zipTracksActions.selectVersion(versionId))}
                                ></Form.Check>
                                <Select
                                    name="version"
                                    value={optionsMap[versionId]?.find((opt) =>
                                        selectedTracks[versionId]?.includes(opt.value)
                                    )}
                                    placeholder={intl.formatMessage(
                                        { id: 'msg.onlyDisplaySingle' },
                                        { versionName: versionName }
                                    )}
                                    // @ts-ignore
                                    options={optionsMap[versionId] ?? []}
                                    className="basic-multi-select"
                                    isClearable={true}
                                    classNamePrefix="select"
                                    // @ts-ignore
                                    onChange={(newValue: { value: string }) => {
                                        dispatch(
                                            zipTracksActions.setDisplayTracks({
                                                version: versionId,
                                                selectedTracks: newValue ? [newValue.value] : [],
                                            })
                                        );
                                    }}
                                />
                                <a
                                    target={'_blank'}
                                    href={`${getBaseUrl()}?display=${versionId}`}
                                    referrerPolicy={'no-referrer'}
                                >
                                    <FormattedMessage
                                        id={'msg.detailsVersionGpx'}
                                        values={{ versionName: versionName }}
                                    />
                                </a>
                            </div>
                        );
                    })}
                <div className={'mx-3'} style={{ width: `${100 / (Object.keys(zipTracks).length + 2)}vw` }}>
                    <Form.Check
                        type={'checkbox'}
                        id={'marker'}
                        className={'m-3'}
                        label={'Marker'}
                        title={intl.formatMessage({ id: showMapMarker ? 'msg.hideMarker' : 'msg.showMarker' })}
                        checked={showMapMarker}
                        readOnly
                        onClick={() => dispatch(mapActions.setShowMapMarker(!showMapMarker))}
                    ></Form.Check>
                    <ZipTimeSlider showTimes={true} />
                </div>
            </Form>
        </Form.Group>
    );
}
