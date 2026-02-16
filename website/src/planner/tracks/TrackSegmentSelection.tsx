import { SEGMENT, TrackComposition } from '../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';

import { ReactSortable } from 'react-sortablejs';
import { TrackSelectionOption } from './TrackSelectionOption.tsx';
import { FormattedMessage } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import Button from 'react-bootstrap/Button';
import { GpxSegmentsUploadAndParseAndSetToTrack } from '../ui/SimpleRouteGpxSegmentsUpload.tsx';
import { TrackSegmentSelect } from './TrackSegmentSelect.tsx';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';

interface Props {
    track: TrackComposition;
    hideSelect?: boolean;
    fullGpxDelete?: boolean;
}

export function TrackSegmentSelection({ track, hideSelect, fullGpxDelete }: Props) {
    const { id, segments } = track;
    const dispatch: AppDispatch = useDispatch();
    const gpxSegments = useSelector(getParsedGpxSegments);

    const setSegmentIds = (items: { id: string }[]) => {
        const mappedIds = items.map((item) => item.id).join();
        if (mappedIds !== segments.map((segment) => segment.id).join()) {
            const newSegments = items.map((segmentOption) => ({
                id: segmentOption.id,
                type: SEGMENT,
                segmentId: segmentOption.id,
            }));
            dispatch(trackMergeActions.setSegments({ id, segments: newSegments }));
        }
    };

    return (
        <div>
            <ReactSortable
                delayOnTouchOnly={true}
                list={segments.map((segment) => ({ id: segment.id }))}
                setList={setSegmentIds}
            >
                {segments.map((trackElement) => {
                    const segmentName = gpxSegments
                        .find((segment) => segment.id === trackElement.id)
                        ?.filename.replace('.gpx', '');
                    return (
                        <TrackSelectionOption
                            key={trackElement.id}
                            trackElement={trackElement}
                            trackId={id}
                            segmentName={segmentName ?? 'Currently blank'}
                            fullGpxDelete={!!fullGpxDelete}
                        />
                    );
                })}
            </ReactSortable>
            <div className={'d-flex my-4'}>
                <div className={'flex-grow-1'}>
                    {!hideSelect ? (
                        <TrackSegmentSelect track={track} />
                    ) : (
                        <GpxSegmentsUploadAndParseAndSetToTrack track={track} />
                    )}
                </div>
                <div style={{ marginLeft: '10px' }}>
                    <Button onClick={() => dispatch(trackMergeActions.setTrackIdForAddingABreak(track.id))}>
                        <FormattedMessage id={'msg.pause'} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
