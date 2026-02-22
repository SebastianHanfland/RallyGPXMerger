import { useDispatch, useSelector } from 'react-redux';
import { getTrackCompositions, trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Button, ButtonGroup, DropdownButton } from 'react-bootstrap';
import { getColor } from '../../../utils/colorUtil.ts';
import { useIntl } from 'react-intl';
import { mapActions } from '../../store/map.reducer.ts';
import { FileDownloaderDropdownItem } from '../../download/FileDownloader.tsx';
import { FileChangeWithUploadButton } from '../../segments/FileChangeWithUploadButton.tsx';
import { RemoveFileButton } from '../../segments/RemoveFileButton.tsx';
import { FlipGpxButton } from '../../segments/FlipGpxButton.tsx';
import { ResetResolvedStreetsButton } from '../../segments/ResetResolvedStreetsButton.tsx';
import { AppDispatch } from '../../store/planningStore.ts';
import flip from '../../../assets/flip.svg';
import { getParsedGpxSegments, segmentDataActions } from '../../store/segmentData.redux.ts';
import { useOnTheFlyCreatedGpx } from '../../../utils/gpxUtil.ts';
import { TrackSelectionNodeButton } from './TrackSelectionNodeButton.tsx';
import { getUsagesOfSegment } from '../../segments/segmentUsageCounter.ts';
import { TrackSelectionGapDisplay } from './TrackSelectionGapDisplay.tsx';
import { EditSegmentColorButton } from '../../segments/EditSegmentColor.tsx';
import { DraggableIcon } from '../../../utils/icons/DraggableIcon.tsx';
import { FileChangeButton } from '../../segments/FileChangeButton.tsx';

interface Props {
    trackId: string;
    segmentId: string;
    segmentName: string;
    fullGpxDelete: boolean;
}

export function TrackSelectionSegmentOption({ segmentId, segmentName, trackId, fullGpxDelete }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const trackCompositions = useSelector(getTrackCompositions);
    const { tooltip } = getUsagesOfSegment(trackCompositions, segmentId, intl);

    const gpxSegment = useSelector(getParsedGpxSegments).find((segment) => segment.id === segmentId);
    const content = useOnTheFlyCreatedGpx(gpxSegment);

    if (!gpxSegment) {
        return null;
    }
    const { id, filename, flipped } = gpxSegment;

    return (
        <div
            onMouseEnter={() => dispatch(mapActions.setHighlightedSegmentId(segmentId))}
            onMouseLeave={() => dispatch(mapActions.setHighlightedSegmentId(undefined))}
        >
            <div
                className={'rounded-2 d-flex justify-content-between'}
                style={{
                    border: '1px solid transparent',
                    borderColor: 'black',
                    cursor: 'pointer',
                    margin: '1px',
                    backgroundColor: getColor(gpxSegment),
                }}
                key={segmentId}
            >
                <div className={'my-2'} title={segmentName + '\n' + tooltip}>
                    <DraggableIcon />
                    <span className={'m-1'}>{segmentName}</span>
                </div>
                <div>
                    <TrackSelectionGapDisplay segmentId={segmentId} trackId={trackId} />
                    <TrackSelectionNodeButton segmentId={segmentId} />
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
                        <FileDownloaderDropdownItem content={content} name={`${filename}.gpx`} />
                        <FileChangeWithUploadButton id={id} name={filename} />
                        <FileChangeButton id={id} name={filename} />
                        <RemoveFileButton id={id} name={filename} />
                        <FlipGpxButton id={id} name={filename} flipped={flipped} />
                        <EditSegmentColorButton segment={gpxSegment} />
                        <ResetResolvedStreetsButton id={id} name={filename} />
                    </DropdownButton>
                </div>
            </div>
        </div>
    );
}
