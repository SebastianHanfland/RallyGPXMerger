import { useDispatch, useSelector } from 'react-redux';
import { getTrackCompositions, trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Button, ButtonGroup, DropdownButton } from 'react-bootstrap';
import { useState } from 'react';
import { getColor } from '../../../utils/colorUtil.ts';
import { useIntl } from 'react-intl';
import { mapActions } from '../../store/map.reducer.ts';
import { AppDispatch } from '../../store/planningStore.ts';
import flip from '../../../assets/flip.svg';
import { getParsedGpxSegments, segmentDataActions } from '../../store/segmentData.redux.ts';
import { TrackSelectionNodeButton } from './TrackSelectionNodeButton.tsx';
import { getSegmentUsages, getUsagesOfSegment } from '../../segments/segmentUsageCounter.ts';
import { TrackSelectionGapDisplay } from './TrackSelectionGapDisplay.tsx';
import { DraggableIcon } from '../../../utils/icons/DraggableIcon.tsx';
import { getAggregateStreetsInSegments } from '../../../common/calculation/aggregated-segments/aggregatePointsSelector.ts';
import { getSegmentInfo } from './getSegmentInfo.ts';
import { TrackSelectionContextMenu } from './TrackSelectionContextMenu.tsx';
import { TrackSelectionSegmentActionItems } from './TrackSelectionSegmentActionItems.tsx';

interface Props {
    trackId: string;
    segmentId: string;
    segmentName: string;
    fullGpxDelete: boolean;
    segmentIndex: number;
}

export function TrackSelectionSegmentOption({ segmentId, segmentName, trackId, fullGpxDelete, segmentIndex }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number }>();
    const aggregatedSegments = useSelector(getAggregateStreetsInSegments);
    const aggregatedInfo = aggregatedSegments[segmentId];

    const info = getSegmentInfo(aggregatedInfo);

    const trackCompositions = useSelector(getTrackCompositions);
    const segmentUsages = useSelector(getSegmentUsages);
    const { tooltip } = getUsagesOfSegment(segmentUsages, segmentId, intl, trackCompositions.length > 0);

    const gpxSegment = useSelector(getParsedGpxSegments).find((segment) => segment.id === segmentId);
    if (!gpxSegment) {
        return null;
    }
    const { flipped } = gpxSegment;

    return (
        <div>
            <TrackSelectionNodeButton segmentId={segmentId} />
            <div
                onMouseEnter={() => dispatch(mapActions.setHighlightedSegmentId(segmentId))}
                onMouseLeave={() => dispatch(mapActions.setHighlightedSegmentId(undefined))}
            >
                <div
                    data-testid={`track-segment-${segmentId}`}
                    className={'rounded-2 d-flex justify-content-between'}
                    style={{
                        border: '1px solid transparent',
                        borderColor: 'black',
                        cursor: 'pointer',
                        margin: '1px',
                        backgroundColor: getColor(gpxSegment),
                    }}
                    key={segmentId}
                    onContextMenu={(event) => {
                        event.preventDefault();
                        setContextMenu({ x: event.clientX, y: event.clientY });
                    }}
                >
                    <div className={'my-2'} title={segmentName + '\n' + tooltip}>
                        <DraggableIcon />
                        <span className={'m-1'}>{segmentName}</span>
                        {info && <span>({info})</span>}
                    </div>
                    <div>
                        <TrackSelectionGapDisplay segmentId={segmentId} trackId={trackId} />
                        {flipped && <img src={flip} className="m-1" alt="flip" />}
                        <Button
                            variant="danger"
                            size={'sm'}
                            className={'m-1'}
                            onClick={() => {
                                dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId }));
                                if (fullGpxDelete) {
                                    dispatch(segmentDataActions.removeGpxSegment(segmentId));
                                }
                            }}
                            title={intl.formatMessage({ id: 'msg.removeTrackSegment' }, { segmentName })}
                        >
                            X
                        </Button>
                        <DropdownButton
                            as={ButtonGroup}
                            key={'primary'}
                            id={`dropdown-variants-${'primary'}`}
                            variant={'primary'}
                            title={''}
                        >
                            <TrackSelectionSegmentActionItems segment={gpxSegment} segmentIndex={segmentIndex} />
                        </DropdownButton>
                    </div>
                </div>
            </div>
            {contextMenu && (
                <TrackSelectionContextMenu {...contextMenu} onClose={() => setContextMenu(undefined)}>
                    <TrackSelectionSegmentActionItems
                        segment={gpxSegment}
                        segmentIndex={segmentIndex}
                        includeInsertionActions
                        onAction={() => setContextMenu(undefined)}
                        onAddBreak={(insertionIndex) => {
                            dispatch(trackMergeActions.setBreakInsertion({ trackId, insertionIndex }));
                            setContextMenu(undefined);
                        }}
                        onAddEntryPoint={(insertionIndex) => {
                            dispatch(trackMergeActions.setEntryPointInsertion({ trackId, insertionIndex }));
                            setContextMenu(undefined);
                        }}
                    />
                </TrackSelectionContextMenu>
            )}
        </div>
    );
}
