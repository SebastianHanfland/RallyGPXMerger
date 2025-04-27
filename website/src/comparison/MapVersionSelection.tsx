import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getShowMapMarker, mapActions } from './store/map.reducer.ts';
import {
    getSelectedTracks,
    getSelectedVersions,
    getTrackInfo,
    getComparisonTracks,
    comparisonActions,
    getPlanningIds,
} from './store/tracks.reducer.ts';
import Select from 'react-select';
import { ComparisonTimeSlider } from './ComparisonTimeSlider.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { getBaseUrl } from '../utils/linkUtil.ts';

export function MapVersionSelection() {
    const showMapMarker = useSelector(getShowMapMarker);
    const comparisonTracks = useSelector(getComparisonTracks);
    const selectedVersions = useSelector(getSelectedVersions);
    const selectedTracks = useSelector(getSelectedTracks);
    const trackInfo = useSelector(getTrackInfo);
    const planningIds = useSelector(getPlanningIds);
    const dispatch = useDispatch();
    const intl = useIntl();

    const optionsMap: Record<string, { value: string; label: string }[] | undefined> = {};
    Object.entries(comparisonTracks).forEach(([version, tracks]) => {
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
                {planningIds.map((planningId) => {
                    const versionName = trackInfo[planningId] ?? planningId;
                    return (
                        <div
                            key={planningId}
                            className={'mx-3'}
                            style={{ width: `${100 / (Object.keys(comparisonTracks).length + 2)}vw` }}
                        >
                            <Form.Check
                                type={'checkbox'}
                                id={planningId}
                                className={'m-3'}
                                label={<span>{versionName}</span>}
                                title={versionName}
                                checked={selectedVersions.includes(planningId)}
                                readOnly
                                onClick={() => dispatch(comparisonActions.selectVersion(planningId))}
                            ></Form.Check>
                            <Select
                                name="version"
                                value={optionsMap[planningId]?.find((opt) =>
                                    selectedTracks[planningId]?.includes(opt.value)
                                )}
                                placeholder={intl.formatMessage(
                                    { id: 'msg.onlyDisplaySingle' },
                                    { versionName: versionName }
                                )}
                                // @ts-ignore
                                options={optionsMap[planningId] ?? []}
                                className="basic-multi-select"
                                isClearable={true}
                                classNamePrefix="select"
                                // @ts-ignore
                                onChange={(newValue: { value: string }) => {
                                    dispatch(
                                        comparisonActions.setDisplayTracks({
                                            version: planningId,
                                            selectedTracks: newValue ? [newValue.value] : [],
                                        })
                                    );
                                }}
                            />
                            <a
                                target={'_blank'}
                                href={`${getBaseUrl()}?display=${planningId}`}
                                referrerPolicy={'no-referrer'}
                            >
                                <FormattedMessage id={'msg.detailsVersionGpx'} values={{ versionName: versionName }} />
                            </a>
                        </div>
                    );
                })}
                <div className={'mx-3'} style={{ width: `${100 / (Object.keys(comparisonTracks).length + 2)}vw` }}>
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
                    <ComparisonTimeSlider />
                </div>
            </Form>
        </Form.Group>
    );
}
