import { TrackComposition } from '../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import Select, { SingleValue } from 'react-select';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';

import { ReactSortable } from 'react-sortablejs';
import { TrackSelectionOption } from './TrackSelectionOption.tsx';
import { GpxSegment } from '../../common/types.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/store.ts';
import Button from 'react-bootstrap/Button';
import { GpxSegmentsUpload } from '../ui/GpxSegmentsUpload.tsx';

interface Props {
    track: TrackComposition;
    hideSelect?: boolean;
    fullGpxDelete?: boolean;
}

function toOption(gpxSegment: GpxSegment): { value: string; label: string } {
    return {
        value: gpxSegment.id,
        label: gpxSegment.filename.replace('.gpx', ''),
    };
}

export function TrackSegmentSelection({ track, hideSelect, fullGpxDelete }: Props) {
    const intl = useIntl();
    const { id, segmentIds } = track;
    const dispatch: AppDispatch = useDispatch();
    const gpxSegments = useSelector(getGpxSegments);
    const options = [...gpxSegments.map(toOption)];

    const setSegmentIds = (items: { id: string }[]) => {
        const mappedIds = items.map((item) => item.id).join();
        if (mappedIds !== segmentIds.join()) {
            const newSegments = items.map((segmentOption) => segmentOption.id);
            dispatch(trackMergeActions.setSegments({ id, segments: newSegments }));
            dispatch(triggerAutomaticCalculation);
        }
    };

    const addSegmentToTrack = (newValue: SingleValue<{ value: string }>) => {
        if (newValue) {
            const segments = [...segmentIds, newValue.value];
            dispatch(trackMergeActions.setSegments({ id, segments: segments }));
            dispatch(triggerAutomaticCalculation);
        }
    };

    return (
        <div>
            <ReactSortable
                delayOnTouchOnly={true}
                list={segmentIds.map((segmentId) => ({ id: segmentId }))}
                setList={setSegmentIds}
            >
                {segmentIds.map((segmentId) => {
                    const segmentName = options.find((option) => option.value === segmentId)?.label;
                    return (
                        <TrackSelectionOption
                            key={segmentId}
                            segmentId={segmentId}
                            trackId={id}
                            segmentName={segmentName ?? 'Currently blank'}
                            fullGpxDelete={!!fullGpxDelete}
                        />
                    );
                })}
            </ReactSortable>
            <div className={'d-flex my-4'}>
                {!hideSelect ? (
                    <div className={'flex-grow-1'}>
                        <Select
                            name="segmentSelect"
                            value={null}
                            menuPlacement={'top'}
                            placeholder={intl.formatMessage({ id: 'msg.selectTrackSegment' })}
                            options={options.filter((option) => !segmentIds.includes(option.value))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={addSegmentToTrack}
                        />
                    </div>
                ) : (
                    <div className={'flex-grow-1'}>
                        <GpxSegmentsUpload />
                    </div>
                )}
                <div style={{ marginLeft: '10px' }}>
                    <Button onClick={() => dispatch(trackMergeActions.setTrackIdForAddingABreak(track.id))}>
                        <FormattedMessage id={'msg.pause'} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
